---
title: Migration
description: What changed in js-bbcode-parser from version 3 to 4 and from 4 to 5, and which parts of your code you have to adjust when you update to the new major version.
order: 40
slug: migration
section: Reference
---

The API (`parse`, `add`, `setCodes`) and the imports from `src/` have stayed the same since version 3. Only the built
files in `dist/` changed. If you import `js-bbcode-parser` or `js-bbcode-parser/src/index.js`, there is nothing to do.

## From 4 to 5

Since 5.0.0 esbuild builds the files in `dist/`. They work the same, but:

- `dist/parser.js` and `dist/simple.js` are now minified themselves.
- `dist/parser.min.js` and `dist/simple.min.js` are gone. Use `dist/parser.js` or `dist/simple.js` instead.
- Source maps (`*.js.map`) are no longer shipped.

## From 3 to 4

Version 4.0.0 removed the builds for older browsers (UMD, ES5, Internet Explorer 11). Only ES modules remain, and the
former `.esm` files got the short names:

| Up to 3.x                | From 4.0             |
|--------------------------|----------------------|
| `dist/parser.esm.js`     | `dist/parser.js`     |
| `dist/parser.esm.min.js` | `dist/parser.min.js` |
| `dist/simple.esm.js`     | `dist/simple.js`     |
| `dist/simple.esm.min.js` | `dist/simple.min.js` |

The UMD files and the global variable `BBCode` are gone. If you loaded the parser via `<script>` without
`type="module"`, switch to an ES module, see [Installation](installation.md#what-you-can-import).
