import {spawn} from 'child_process'
import isAbsoluteUrl from 'is-absolute-url'
import { Readable } from 'stream';

function quote(val: string | any) {
  // escape and quote the value if it is a string and this isn't windows
  if (typeof val === 'string' && process.platform !== 'win32') {
    val = '"' + val.replace(/(["\\$`])/g, '\\$1') + '"'
  }

  return val
}

type WkCommand = 'wkhtmltopdf' | 'wkhtmltoimage'
type PaperSize = 'a0' | 'a1' | 'a2' | 'a3' | 'a4' | 'a5' | 'a6' | 'a7' | 'a8' | 'a9' | 'b0' | 'b1' | 'b2' | 'b3' | 'b4' | 'b5' | 'b6' | 'b7' | 'b8' | 'b9' | 'b10' | 'c5e' | 'comm10e' | 'dle' | 'executive' | 'folio' | 'ledger' | 'legal' | 'letter' | 'tabloid' | 'custom'

interface HtmlParserOptions {
  command: WkCommand
  pageSize?: PaperSize
  output?: string
}

export class HtmlParser {
  public shell = '/bin/bash'
  public stream: Readable | undefined

  private options: HtmlParserOptions = {
    command: 'wkhtmltopdf'
  }
  private callback: CallableFunction | undefined

  constructor(options?: Partial<HtmlParserOptions>, callback?: CallableFunction) {
    if (options) {
      this.options = Object.assign(this.options, {})
    }

    this.callback = callback
  }

  public createStream(input: string) {
    const args = [this.options.command]

    const isUrl = isAbsoluteUrl(input)
    args.push(isUrl ? quote(input) : '-')  // stdin if HTML given directly
    args.push(this.options.output ? quote(this.options.output) : '-')  // stdout if no output file

    let child

    if (process.platform === 'win32') {
      child = spawn(args[0], args.slice(1))
    } else if (process.platform === 'darwin') {
      child = spawn('/bin/sh', ['-c', args.join(' ') + ' | cat ; exit ${PIPESTATUS[0]}'])
    } else {
      // this nasty business prevents piping problems on linux
      // The return code should be that of wkhtmltopdf and not of cat
      // http://stackoverflow.com/a/18295541/1705056
      child = spawn(this.shell, ['-c', args.join(' ') + ' | cat ; exit ${PIPESTATUS[0]}']);
    }

    this.stream = child.stdout

    // call the callback with null error when the process exits successfully
    child.on('exit', code => {
      if (code !== 0) {
        console.error('wkhtmltopdf exited with code ' + code)
        // handleError(stderrMessages);
      } else if (this.callback) {
        this.callback(null, this.stream); // stream is child.stdout
      }
    })

    return this.stream
  }
}
