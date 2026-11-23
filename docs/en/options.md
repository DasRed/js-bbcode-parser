---
title: Options
description: Reference of js-bbcode-parser with constructor, methods and all default BBCodes such as [b], [url] and [img], plus the known limitations of the parser.
order: 30
slug: options
section: Reference
---

## Constructor

```js
new BBCodeParser(codes)
```

| Name    | Type                                 | Default  | Description                                                       |
|---------|--------------------------------------|----------|-------------------------------------------------------------------|
| `codes` | `Object<string, string \| Function>` | required | Key: regular expression as a string. Value: replacement for `replace` |

Every key becomes a `RegExp` with the flags `igms`:

| Flag | Effect                                                  |
|------|---------------------------------------------------------|
| `i`  | case-insensitive                                        |
| `g`  | replace all occurrences                                 |
| `m`  | `^` and `$` match per line                              |
| `s`  | `.` also matches line breaks (multi-line content)       |

## Methods

| Method                    | Returns    | Description                                       |
|---------------------------|------------|---------------------------------------------------|
| `parse(text)`             | `string`   | Applies all codes to `text`, one after another    |
| `add(regex, replacement)` | the parser | Appends a code, chainable                         |
| `setCodes(codes)`         | the parser | Replaces all codes with `codes`, chainable        |

## Default BBCodes

The default parser (`import bbCodeParser from 'js-bbcode-parser'`) knows these codes, in this order:

| BBCode                                              | HTML                                                       |
|-----------------------------------------------------|------------------------------------------------------------|
| `[br]`                                              | `<br>`                                                     |
| `[b]text[/b]`                                       | `<strong>text</strong>`                                    |
| `[i]text[/i]`                                       | `<em>text</em>`                                            |
| `[u]text[/u]`                                       | `<u>text</u>`                                              |
| `[h1]text[/h1]` to `[h6]text[/h6]`                  | `<h1>text</h1>` to `<h6>text</h6>`                         |
| `[p]text[/p]`                                       | `<p>text</p>`                                              |
| `[code]text[/code]`                                 | `<pre>text</pre>`                                          |
| `[color=#FF0000]text[/color]`                       | `<span style="color:#FF0000">text</span>`                  |
| `[size=9]text[/size]`                               | `<span style="font-size:9px">text</span>`                  |
| `[img]https://example.com/a.jpg[/img]`              | `<img src="https://example.com/a.jpg">`                    |
| `[img=https://example.com/a.jpg]`                   | `<img src="https://example.com/a.jpg">`                    |
| `[email]info@example.com[/email]`                   | `<a href="mailto:info@example.com">info@example.com</a>`   |
| `[email=info@example.com]text[/email]`              | `<a href="mailto:info@example.com">text</a>`               |
| `[url]https://example.com[/url]`                    | `<a href="https://example.com">https://example.com</a>`    |
| `[url=alert('hi')\|onclick]text[/url]`              | `<a onclick="alert('hi')">text</a>`                        |
| `[url=https://example.com target=_blank]text[/url]` | `<a href="https://example.com" target="_blank">text</a>`   |
| `[url=https://example.com]text[/url]`               | `<a href="https://example.com">text</a>`                   |
| `[a=anchor]text[/a]`                                | `<a href="anchor" name="anchor">text</a>`                  |
| `[list]text[/list]`                                 | `<ul>text</ul>`                                            |
| `[*]text[/*]`                                       | `<li>text</li>`                                            |

`[size=…]` expects a number (pixels). Other values stay in the text as BBCode.

## Limitations

- **No attributes.** `[b class="x"]text[/b]` or `[h1 data-value="1"]` are not converted and stay as text.
- **`[code]` does not protect its content.** BBCodes and HTML inside are still converted or output.
- **`[a=anchor]` sets `href="anchor"`**, not `#anchor`. For in-page anchors you need your own parser with a matching
  code. `add()` is not enough here, because the default `[a=…]` code matches first.
- **Unclosed tags** stay unchanged in the text.
- **No escaping, no XSS check**, see [Usage](usage.md#securing-user-input).
