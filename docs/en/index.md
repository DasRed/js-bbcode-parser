---
title: Overview
description: Lightweight BBCode parser for browsers and Node.js that turns BBCode into safe HTML via regular expressions, escapes input by default and supports custom codes.
order: 0
section: Getting started
---

`js-bbcode-parser` turns BBCode like `[b]bold[/b]` or `[url=…]link[/url]` into HTML. It runs in the browser and in
Node.js, has no dependencies and ships a ready-made parser with the usual BBCodes. You define custom codes as a pair
of regular expression and replacement.

## Quick example

```js
import bbCodeParser from 'js-bbcode-parser';

bbCodeParser.parse('[b]Hello[/b] [url=https://example.com]world[/url]');
// <strong>Hello</strong> <a href="https://example.com">world</a>
```

## How it works

Every BBCode is a regular expression with a replacement. `parse()` first escapes HTML in the text and then applies all
expressions one after another. Nested tags, also of the same kind, are resolved from the inside out. That keeps the
parser small and easy to extend; there is no syntax tree and no check for properly closed tags.

## Safe by default

Since version 6 the parser is built for text from users:

- HTML in the text is escaped, `<script>` stays visible text.
- Links and images only accept `http`, `https` (links also `mailto`) and relative addresses, so
  `[url=javascript:…]` stays plain text.
- Values in attributes cannot break out of their quotes, colors only accept names and hex values.
- The default expressions run in linear time, so long or broken input cannot block the parser.

Details are listed under [Usage](usage.md#safety).

## Status

Version 6 from 2026, rewritten in TypeScript, with ES module and CommonJS builds and type definitions. The parser has
been in use since 2016. Coming from an older version? The changes are listed under [Migration](migration.md).
