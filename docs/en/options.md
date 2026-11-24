---
title: Options
description: Reference of js-bbcode-parser with constructor options, methods and all default BBCodes such as [b], [url] and [img], their checks and the known limitations.
order: 30
slug: options
section: Reference
---

## Constructor

```js
new BBCodeParser(codes, options)
```

| Name      | Type                                 | Default | Description                                                         |
|-----------|--------------------------------------|---------|---------------------------------------------------------------------|
| `codes`   | `Object<string, string \| Function>` | `{}`    | Key: regular expression as a string. Value: replacement for `replace` |
| `options` | `Object`                             | `{}`    | See below                                                           |

Every key becomes a `RegExp` with the flags `gims`:

| Flag | Effect                                                  |
|------|---------------------------------------------------------|
| `g`  | replace all occurrences                                 |
| `i`  | case-insensitive                                        |
| `m`  | `^` and `$` match per line                              |
| `s`  | `.` also matches line breaks (multi-line content)       |

### Options

| Name         | Type      | Default | Description                                                                         |
|--------------|-----------|---------|-------------------------------------------------------------------------------------|
| `escapeHTML` | `boolean` | `true`  | Escapes `&`, `<`, `>`, `"` and `'` in the input before the codes are applied        |
| `maxDepth`   | `number`  | `20`    | How often a code is applied at most, so nested tags are resolved from the inside out |

## Methods

| Method                    | Returns    | Description                                                                 |
|---------------------------|------------|-----------------------------------------------------------------------------|
| `parse(text)`             | `string`   | Escapes `text` and applies all codes, one after another                     |
| `add(regex, replacement)` | the parser | Appends a code, chainable. `regex` is a string or a `RegExp`                |
| `setCodes(codes)`         | the parser | Replaces all codes with `codes`, chainable                                  |

A `RegExp` passed to `add()` keeps its flags; the parser only adds `g` if it is missing.

## Default BBCodes

The default parser (`import bbCodeParser from 'js-bbcode-parser'`) and `js-bbcode-parser/codes` know these codes, in
this order:

| BBCode                                              | HTML                                                                          |
|-----------------------------------------------------|-------------------------------------------------------------------------------|
| `[br]`                                              | `<br>`                                                                        |
| `[b]text[/b]`                                       | `<strong>text</strong>`                                                       |
| `[i]text[/i]`                                       | `<em>text</em>`                                                               |
| `[u]text[/u]`                                       | `<u>text</u>`                                                                 |
| `[h1]text[/h1]` to `[h6]text[/h6]`                  | `<h1>text</h1>` to `<h6>text</h6>`                                            |
| `[p]text[/p]`                                       | `<p>text</p>`                                                                 |
| `[code]text[/code]`                                 | `<pre>text</pre>`                                                             |
| `[color=#FF0000]text[/color]`                       | `<span style="color:#FF0000">text</span>`                                     |
| `[size=9]text[/size]`                               | `<span style="font-size:9px">text</span>`                                     |
| `[img]https://example.com/a.jpg[/img]`              | `<img src="https://example.com/a.jpg" alt="">`                                |
| `[img=https://example.com/a.jpg]`                   | `<img src="https://example.com/a.jpg" alt="">`                                |
| `[email]info@example.com[/email]`                   | `<a href="mailto:info@example.com">info@example.com</a>`                      |
| `[email=info@example.com]text[/email]`              | `<a href="mailto:info@example.com">text</a>`                                  |
| `[url]https://example.com[/url]`                    | `<a href="https://example.com">https://example.com</a>`                       |
| `[url=https://example.com target=_blank]text[/url]` | `<a href="https://example.com" target="_blank" rel="noopener noreferrer">text</a>` |
| `[url=https://example.com]text[/url]`               | `<a href="https://example.com">text</a>`                                      |
| `[a=anchor]text[/a]`                                | `<a id="anchor" href="#anchor">text</a>`                                      |
| `[list]text[/list]`                                 | `<ul>text</ul>`                                                               |
| `[*]text[/*]`                                       | `<li>text</li>`                                                               |

## Checks of the default BBCodes

If a value fails its check, the BBCode stays unchanged as text.

| BBCode               | Accepted values                                                                  |
|----------------------|----------------------------------------------------------------------------------|
| `[url]`, `[url=…]`   | `http`, `https`, `mailto` or a relative address, without quotes and angle brackets |
| `[img]`, `[img=…]`   | `http`, `https` or a relative address, without quotes and angle brackets          |
| `target=…`           | `_blank`, `_self`, `_parent`, `_top` (any case)                                  |
| `[email]`, `[email=…]` | one `@`, no spaces, no quotes and angle brackets                               |
| `[color=…]`          | a color name (3 to 30 letters) or `#` with 3 to 8 hex digits                      |
| `[size=…]`           | a whole number from 1 to 999                                                      |
| `[a=…]`              | starts with a letter, then letters, digits, `_`, `-`, `.` or `:`                  |

## Limitations

- **No attributes.** `[b class="x"]text[/b]` or `[h1 data-value="1"]` are not converted and stay as text.
- **`[code]` does not protect its content.** BBCodes inside are still converted; HTML is escaped like everywhere else.
- **Unclosed tags** stay unchanged in the text.
- **No syntax tree.** Overlapping tags like `[b][i]x[/b][/i]` produce overlapping HTML.
- **Your own codes are not checked**, see [Usage](usage.md#safety).
