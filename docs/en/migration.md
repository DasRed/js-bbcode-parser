---
title: Migration
description: What changed in js-bbcode-parser from version 3 up to 6: imports, escaping, checked BBCodes, removed onclick code and what you have to adjust in your code.
order: 40
slug: migration
section: Reference
---

The API (`parse`, `add`, `setCodes`) has stayed the same since version 3. Version 6 changes the imports, escapes the
input and checks the values of the default BBCodes.

## From 5 to 6

Version 6 is a rewrite in TypeScript with a focus on safety. For the default parser most texts produce the same HTML
as before, but some things changed.

### Imports

The source files are no longer shipped. Use the package exports instead:

| Up to 5.x                          | From 6.0                                   |
|------------------------------------|--------------------------------------------|
| `js-bbcode-parser`                 | `js-bbcode-parser` (unchanged)             |
| `js-bbcode-parser/src/index.js`    | `js-bbcode-parser/parser`                  |
| `js-bbcode-parser/src/simple.js`   | `js-bbcode-parser`                         |
| `js-bbcode-parser/dist/parser.js`  | `js-bbcode-parser/dist/parser.js` (unchanged) |
| `js-bbcode-parser/dist/simple.js`  | `js-bbcode-parser/dist/simple.js`, now loads further files from `dist/` |

New: `js-bbcode-parser/codes` with the default BBCodes, CommonJS via `require(…).default` and type definitions. The files
in `dist/` are built with tsdown now.

### Behaviour

| Topic                         | Up to 5.x                                  | From 6.0                                               |
|-------------------------------|--------------------------------------------|--------------------------------------------------------|
| HTML in the text              | passed through                             | escaped, configurable with `escapeHTML`                |
| `[url=…\|onclick]`            | `<a onclick="…">`                          | removed, no longer a code                              |
| `javascript:` and other schemes | turned into links and images              | stay text                                              |
| `target=_blank`               | without `rel`                              | with `rel="noopener noreferrer"`, other targets than `_blank`, `_self`, `_parent`, `_top` stay text |
| `[color=…]`                   | any value                                  | color name or hex value only                           |
| `[size=…]`                    | any number                                 | 1 to 999                                               |
| `[email]`                     | any value                                  | an address with one `@` and no spaces                  |
| `[img]`                       | `<img src="…">`                            | `<img src="…" alt="">`                                 |
| `[a=name]`                    | `<a href="name" name="name">`              | `<a id="name" href="#name">`                           |
| Nested tags of the same kind  | broken HTML                                | resolved from the inside out (`maxDepth`)              |
| Long or broken input          | could take minutes                         | linear time                                            |
| Node.js                       | any version with ESM                       | 22.13 or later                                          |

### What to check

- If your own codes rely on HTML in the input, pass `{escapeHTML: false}`, but only for trusted input.
- If you used `[url=…|onclick]`, add your own code with your own checks.
- If you style `[a=…]` anchors or link to them, they now use `id` and link to `#name`.
- Imports from `src/` have to move to the package exports listed above.

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
