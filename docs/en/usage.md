---
title: Usage
description: Convert BBCode to safe HTML with js-bbcode-parser: default parser, custom BBCodes, extending the defaults, replacement functions, ordering, nesting and safety.
order: 20
slug: usage
section: Getting started
---

## Default parser

The default export is a ready-made parser with the usual BBCodes. They are listed under
[Options](options.md#default-bbcodes).

```js
import bbCodeParser from 'js-bbcode-parser';

bbCodeParser.parse('Line one[br][i]line two[/i]');
// Line one<br><em>line two</em>
```

Tags are case-insensitive (`[B]` works like `[b]`), and content may span several lines. Nested tags like
`[b][i]text[/i][/b]` or `[list][*]a[list][*]b[/*][/list][/*][/list]` work too.

## Custom parser

For a parser with only your own codes, create a new instance of the class. The key is a regular expression as a
string, the value is the replacement. Use `$1`, `$2` … to access the groups.

```js
import BBCodeParser from 'js-bbcode-parser/parser';

const parser = new BBCodeParser({
    '\\[br\\]':                         '<br>',
    '\\[b\\](.+?)\\[/b\\]':             '<strong>$1</strong>',
    '\\[spoiler\\](.+?)\\[/spoiler\\]': '<details><summary>Spoiler</summary>$1</details>',
});

parser.parse('[spoiler]The butler did it[/spoiler]');
// <details><summary>Spoiler</summary>The butler did it</details>
```

> [!TIP]
> Because the expressions are passed as strings, you need double backslashes: `\\[b\\]` matches `[b]`. `add()` also
> takes a `RegExp` directly.

## Extending the defaults

`js-bbcode-parser/codes` contains the default BBCodes as an object. Spread them into your own parser and add your
codes:

```js
import BBCodeParser from 'js-bbcode-parser/parser';
import defaultCodes from 'js-bbcode-parser/codes';

const parser = new BBCodeParser({
    ...defaultCodes,
    '\\[hr\\]': '<hr>',
});
```

`add()` appends a code to an existing parser without losing the others:

```js
parser
    .add('\\[hr\\]', '<hr>')
    .add(/\[s\](.+?)\[\/s\]/i, '<s>$1</s>');
```

> [!IMPORTANT]
> The default parser is a single shared instance. Whatever you change there with `add()` or `setCodes()` applies
> everywhere in your application. If different places need different codes, create a separate parser for each.

`setCodes()` on the other hand replaces **all** codes. After `parser.setCodes({})` the parser no longer knows any
BBCode.

## Replacement as a function

The replacement is passed on to `String.prototype.replace`, so a function works as well as a string:

```js
const parser = new BBCodeParser({
    '\\[upper\\](.+?)\\[/upper\\]': (match, text) => text.toUpperCase(),
});

parser.parse('[upper]loud[/upper]');
// LOUD
```

Return `match` to leave a code unchanged, e.g. if a value fails your own check.

## Order and nesting

Codes are applied in the order you define them. Specific variants therefore have to come before general ones. The
default parser, for example, checks `[url=… target=…]` before `[url=…]`.

Every code is applied repeatedly until the text no longer changes, at most `maxDepth` times (default 20). That way
nested tags of the same kind are resolved from the inside out, as long as the expression does not match across an
opening tag of the same kind. The default codes do exactly that.

## Safety

The parser is meant for text from users and protects against cross-site scripting by default:

| Protection          | What happens                                                                                  |
|---------------------|-----------------------------------------------------------------------------------------------|
| HTML in the text    | `&`, `<`, `>`, `"` and `'` are escaped before any code is applied                              |
| Links               | only `http`, `https`, `mailto` and relative addresses; `javascript:` and similar stay text, even with entities or control characters |
| Images              | only `http`, `https` and relative addresses                                                   |
| Attributes          | values with quotes or angle brackets are refused, so nothing can break out of an attribute    |
| `target`            | only `_blank`, `_self`, `_parent`, `_top`; `_blank` also gets `rel="noopener noreferrer"`     |
| Colors and sizes    | colors as name or hex value, sizes from 1 to 999                                              |
| Long input          | the default expressions run in linear time, even for broken input                             |

A code that fails a check stays unchanged as text.

> [!CAUTION]
> Your own codes are your responsibility. Check values that end up in attributes, e.g. with a replacement function,
> and avoid expressions like `(.+?)` combined several times in one code: they can take very long on broken input.
> `escapeHTML: false` turns off the escaping and should only be used for trusted input.
