---
title: Installation
description: Install js-bbcode-parser via npm and pick the right import for Node.js, bundlers or the browser.
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

- **ES modules:** The package is pure ESM. In Node.js you need `import` (a `.mjs` file or `"type": "module"`).
- **ES2018:** The expressions use the `s` flag (dot also matches line breaks). All current browsers support it, as
  does every Node.js version with ESM support.

## What you can import

| Import                            | Contents                                            |
|-----------------------------------|-----------------------------------------------------|
| `js-bbcode-parser`                | Ready-made parser with the default BBCodes (instance) |
| `js-bbcode-parser/src/index.js`   | The class to create your own parser                 |
| `js-bbcode-parser/dist/simple.js` | Ready-made parser as a single minified file         |
| `js-bbcode-parser/dist/parser.js` | The class as a single minified file                 |

With npm and a bundler (esbuild, Vite, webpack) use the first two. The files in `dist/` are meant for the browser
without a build step, e.g. via a CDN:

```html
<script type="module">
    import bbCodeParser from 'https://cdn.jsdelivr.net/npm/js-bbcode-parser@5/dist/simple.js';

    document.querySelector('#preview').innerHTML = bbCodeParser.parse('[b]Hello[/b]');
</script>
```

> [!WARNING]
> The example writes the result straight into the page. For user input, sanitize it first, see
> [Usage](usage.md#securing-user-input).
