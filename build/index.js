"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const is_absolute_url_1 = __importDefault(require("is-absolute-url"));
function quote(val) {
    // escape and quote the value if it is a string and this isn't windows
    if (typeof val === 'string' && process.platform !== 'win32') {
        val = '"' + val.replace(/(["\\$`])/g, '\\$1') + '"';
    }
    return val;
}
class HtmlParser {
    constructor(options, callback) {
        this.shell = '/bin/bash';
        this.options = {
            command: 'wkhtmltopdf'
        };
        if (options) {
            this.options = Object.assign(this.options, {});
        }
        this.callback = callback;
    }
    createStream(input) {
        const args = [this.options.command];
        const isUrl = is_absolute_url_1.default(input);
        args.push(isUrl ? quote(input) : '-'); // stdin if HTML given directly
        args.push(this.options.output ? quote(this.options.output) : '-'); // stdout if no output file
        let child;
        if (process.platform === 'win32') {
            child = child_process_1.spawn(args[0], args.slice(1));
        }
        else if (process.platform === 'darwin') {
            child = child_process_1.spawn('/bin/sh', ['-c', args.join(' ') + ' | cat ; exit ${PIPESTATUS[0]}']);
        }
        else {
            // this nasty business prevents piping problems on linux
            // The return code should be that of wkhtmltopdf and not of cat
            // http://stackoverflow.com/a/18295541/1705056
            child = child_process_1.spawn(this.shell, ['-c', args.join(' ') + ' | cat ; exit ${PIPESTATUS[0]}']);
        }
        this.stream = child.stdout;
        // call the callback with null error when the process exits successfully
        child.on('exit', code => {
            if (code !== 0) {
                console.error('wkhtmltopdf exited with code ' + code);
                // handleError(stderrMessages);
            }
            else if (this.callback) {
                this.callback(null, this.stream); // stream is child.stdout
            }
        });
        return this.stream;
    }
}
exports.HtmlParser = HtmlParser;
//# sourceMappingURL=index.js.map