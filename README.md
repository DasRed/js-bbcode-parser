# js-bbcode-parser

Lightweight BBCode parser for browsers and Node.js. It turns BBCode into HTML via regular expressions, ships a
ready-made parser with the usual codes and lets you define your own. Input is escaped and the values of the default
codes are checked, so it is safe for text from users. Ships as ESM and CommonJS with TypeScript types.

Documentation: https://www.marco-starker.de/en/projects/js-bbcode-parser/docs
(Deutsch: https://www.marco-starker.de/de/projekte/js-bbcode-parser/doku)

## Quick start

```bash
npm i js-bbcode-parser
```

```js
import bbCodeParser from 'js-bbcode-parser';

bbCodeParser.parse('[b]Hello[/b] [url=https://example.com]world[/url]');
// <strong>Hello</strong> <a href="https://example.com">world</a>

bbCodeParser.parse('<script>alert(1)</script> [url=javascript:alert(1)]x[/url]');
// &lt;script&gt;alert(1)&lt;/script&gt; [url=javascript:alert(1)]x[/url]
```

Custom codes: key is a regular expression as a string, value is the replacement.

```js
import BBCodeParser from 'js-bbcode-parser/parser';
import defaultCodes from 'js-bbcode-parser/codes';

const parser = new BBCodeParser({
    ...defaultCodes,
    '\\[hr\\]': '<hr>',
});
```

## Local development

```bash
npm ci
npm test
npm run build
```

The package itself runs on Node.js 22.13 or later. Building and testing need Node.js 22.18 or later.

## License

[MIT](LICENSE)
