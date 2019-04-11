# wkhtmltox

A Node.js wrapper for the [wkhtmltox](http://wkhtmltopdf.org/) command line tool.  As the name implies, 
it converts HTML documents to PDFs, images and more using WebKit.

Inspired by [devongovett's node-wkhtmltopdf](https://github.com/devongovett/node-wkhtmltopdf/).

## Installation

First, you need to install the `wkhtmltopdf` command line tool on your system.

The **easiest way** to do this is to
[download](http://wkhtmltopdf.org/downloads.html#stable) a prebuilt version for your system.  **DO NOT** try to use
the packages provided by your distribution as they may not be using a patched Qt and have missing features.

Finally, to install the node module, use `npm` or `yarn`:

```
# npm
npm install wkhtmltox
# yarn
yarn add wkhtmltox
```

## Usage

```typescript
import {HtmlParser} from 'wkhtmltox'

// create the parser
const parser = new HtmlParser()

parser.createStream('http://google.com')
  .pipe(fs.createWriteStream('out.pdf'));

parser.createStream('<h1>Test</h1><p>Hello world</p>')
  .pipe(res);

// Stream input and output
var stream = wkhtmltopdf(fs.createReadStream('file.html'));
```

## License

MIT
