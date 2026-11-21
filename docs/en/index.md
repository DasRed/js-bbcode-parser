---
title: Overview
description: Lightweight BBCode parser for browsers and Node.js that turns BBCode into HTML via regular expressions and supports custom codes.
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

Every BBCode is a regular expression with a replacement. `parse()` applies all expressions to the text one after
another. That keeps the parser small and easy to extend, but it also means: there is no syntax tree, no check for
properly closed tags and no escaping.

> [!CAUTION]
> The parser does not sanitize input against XSS. HTML in the text is kept, and BBCodes like `[url]` or `[color]` can
> be abused for scripts. Sanitize the result before output if the text comes from users. See
> [Usage](usage.md#securing-user-input) for how.

## Status

Version 5.1.0 from 2024. The parser has been in use since 2016 and is stable. Coming from version 3 or 4? The changes
are listed under [Migration](migration.md).
