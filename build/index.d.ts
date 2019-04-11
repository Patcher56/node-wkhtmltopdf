/// <reference types="node" />
import { Readable } from 'stream';
declare type WkCommand = 'wkhtmltopdf' | 'wkhtmltoimage';
declare type PaperSize = 'a0' | 'a1' | 'a2' | 'a3' | 'a4' | 'a5' | 'a6' | 'a7' | 'a8' | 'a9' | 'b0' | 'b1' | 'b2' | 'b3' | 'b4' | 'b5' | 'b6' | 'b7' | 'b8' | 'b9' | 'b10' | 'c5e' | 'comm10e' | 'dle' | 'executive' | 'folio' | 'ledger' | 'legal' | 'letter' | 'tabloid' | 'custom';
interface HtmlParserOptions {
    command: WkCommand;
    pageSize?: PaperSize;
    output?: string;
}
export declare class HtmlParser {
    shell: string;
    stream: Readable | undefined;
    private options;
    private callback;
    constructor(options?: Partial<HtmlParserOptions>, callback?: CallableFunction);
    createStream(input: string): Readable;
}
export {};
