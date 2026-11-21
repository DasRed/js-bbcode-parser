---
title: Usage
description: Use the default parser, define custom BBCodes, extend the parser and secure user input.
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
`[b][i]text[/i][/b]` work too.

## Custom parser

For a parser with only your own codes, create a new instance of the class. The key is a regular expression as a
string, the value is the replacement. Use `$1`, `$2` … to access the groups.

```js
import BBCodeParser from 'js-bbcode-parser/src/index.js';

const parser = new BBCodeParser({
    '\\[br\\]':                         '<br>',
    '\\[b\\](.+?)\\[/b\\]':             '<strong>$1</strong>',
    '\\[spoiler\\](.+?)\\[/spoiler\\]': '<details><summary>Spoiler</summary>$1</details>',
});

parser.parse('[spoiler]The butler did it[/spoiler]');
// <details><summary>Spoiler</summary>The butler did it</details>
```

> [!TIP]
> Because the expressions are passed as strings, you need double backslashes: `\\[b\\]` matches `[b]`.

## Extending a parser

`add()` appends a code to an existing parser without losing the others:

```js
import bbCodeParser from 'js-bbcode-parser';

bbCodeParser
    .add('\\[hr\\]', '<hr>')
    .add('\\[s\\](.+?)\\[/s\\]', '<s>$1</s>');
```

> [!IMPORTANT]
> The default parser is a single shared instance. Whatever you change there with `add()` or `setCodes()` applies
> everywhere in your application. If different places need different codes, create a separate parser for each.

`setCodes()` on the other hand replaces **all** codes. After `bbCodeParser.setCodes({})` the default parser no longer
knows any BBCode.

## Replacement as a function

The replacement is passed on to `String.prototype.replace`, so a function works as well as a string:

```js
import BBCodeParser from 'js-bbcode-parser/src/index.js';

const parser = new BBCodeParser({
    '\\[upper\\](.+?)\\[/upper\\]': (match, text) => text.toUpperCase(),
});

parser.parse('[upper]loud[/upper]');
// LOUD
```

## Order

Codes are applied in the order you define them. Specific variants therefore have to come before general ones. The
default parser, for example, checks `[url=… target=…]` before `[url=…]`, otherwise the general expression would pull
the `target` into the address.

## Securing user input

The parser keeps HTML in the text and does not check addresses or colours. `[url=javascript:alert(1)]x[/url]` becomes a
working script link. If the text comes from users, sanitize the result before output, e.g. with
[DOMPurify](https://github.com/cure53/DOMPurify):

```js
import bbCodeParser from 'js-bbcode-parser';
import DOMPurify from 'dompurify';

const html = DOMPurify.sanitize(bbCodeParser.parse(input));
```

> [!CAUTION]
> The default parser contains `[url=…|onclick]`, which writes arbitrary JavaScript into an `onclick`. Do not offer this
> code for user input: create your own parser without it.
