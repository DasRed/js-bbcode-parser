---
title: Installation
description: Install js-bbcode-parser via npm, check the requirements and pick the right import for ES modules, CommonJS, TypeScript, bundlers or the browser via a CDN.
order: 10
slug: installation
section: Getting started
---

## Install the package

```bash
npm i js-bbcode-parser
```

The package has no dependencies.

## Requirements

| What    | Version          | Why                                                         |
|---------|------------------|-------------------------------------------------------------|
| Node.js | 22.13 or later   | Minimum in `engines`, the oldest supported LTS line         |
| Browser | ES2018           | The builds target ES2018, which every current browser supports |

## What you can import

| Import                    | Contents                                                       |
|---------------------------|----------------------------------------------------------------|
| `js-bbcode-parser`        | Ready-made parser with the default BBCodes (instance)          |
| `js-bbcode-parser/parser` | The class `BBCodeParser` to create your own parser             |
| `js-bbcode-parser/codes`  | The default BBCodes as an object, to extend them               |

Every import exists as ES module and as CommonJS:

```js
import bbCodeParser from 'js-bbcode-parser';
import BBCodeParser from 'js-bbcode-parser/parser';
import defaultCodes from 'js-bbcode-parser/codes';
```

```js
const bbCodeParser = require('js-bbcode-parser').default;
const BBCodeParser = require('js-bbcode-parser/parser').default;
const defaultCodes = require('js-bbcode-parser/codes').default;
```

In CommonJS the default export sits in `.default`, next to the type exports. TypeScript and bundlers handle
`import … from` for you.

## TypeScript

Type definitions are included. The types for codes and options are available as named type exports:

```ts
import BBCodeParser, {type BBCodeCodesType, type BBCodeParserOptionInterface} from 'js-bbcode-parser/parser';

const codes: BBCodeCodesType               = {'\\[hr\\]': '<hr>'};
const options: BBCodeParserOptionInterface = {maxDepth: 10};
const parser                               = new BBCodeParser(codes, options);
```

## In the browser

The files in `dist/` are minified ES modules and also work without a build step, e.g. via a CDN:

```html
<script type="module">
    import bbCodeParser from 'https://cdn.jsdelivr.net/npm/js-bbcode-parser@6/dist/simple.js';

    document.querySelector('#preview').innerHTML = bbCodeParser.parse('[b]Hello[/b]');
</script>
```

`dist/simple.js` loads `dist/codes.js` and shared files with a hash in their name from the same folder.
