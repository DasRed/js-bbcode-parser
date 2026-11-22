# js-bbcode-parser

Lightweight BBCode parser for browsers and Node.js. It turns BBCode into HTML via regular expressions, ships a
ready-made parser with the usual codes and lets you define your own.

Documentation: https://www.marco-starker.de/en/projects/js-bbcode-parser/docs
(Deutsch: https://www.marco-starker.de/de/projekte/js-bbcode-parser/doku)

> [!CAUTION]
> js-bbcode-parser does not sanitize the input against XSS. Sanitize the output (e.g. with DOMPurify) before
> rendering text that comes from users.

## Quick start

```bash
npm i js-bbcode-parser
```

```js
import bbCodeParser from 'js-bbcode-parser';

bbCodeParser.parse('[b]Hello[/b] [url=https://example.com]world[/url]');
// <strong>Hello</strong> <a href="https://example.com">world</a>
```

Custom codes: key is a regular expression as a string, value is the replacement.

```js
import BBCodeParser from 'js-bbcode-parser/src/index.js';

const parser = new BBCodeParser({
    '\\[br\\]':             '<br>',
    '\\[b\\](.+?)\\[/b\\]': '<strong>$1</strong>',
});
```

## License

[MIT](LICENSE)
