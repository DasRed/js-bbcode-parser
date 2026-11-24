---
title: Optionen
description: Referenz von js-bbcode-parser mit Konstruktor-Optionen, Methoden und allen Standard-BBCodes wie [b], [url] und [img], ihre Prüfungen und die Einschränkungen.
order: 30
slug: optionen
section: Referenz
---

## Konstruktor

```js
new BBCodeParser(codes, options)
```

| Name      | Typ                                  | Standard | Beschreibung                                                          |
|-----------|--------------------------------------|----------|-----------------------------------------------------------------------|
| `codes`   | `Object<string, string \| Function>` | `{}`     | Schlüssel: regulärer Ausdruck als String. Wert: Ersetzung für `replace` |
| `options` | `Object`                             | `{}`     | Siehe unten                                                           |

Aus jedem Schlüssel wird ein `RegExp` mit den Flags `gims`:

| Flag | Wirkung                                                    |
|------|------------------------------------------------------------|
| `g`  | alle Vorkommen ersetzen                                    |
| `i`  | Groß- und Kleinschreibung egal                             |
| `m`  | `^` und `$` gelten je Zeile                                |
| `s`  | `.` passt auch auf Zeilenumbrüche (mehrzeilige Inhalte)     |

### Optionen

| Name         | Typ       | Standard | Beschreibung                                                                          |
|--------------|-----------|----------|---------------------------------------------------------------------------------------|
| `escapeHTML` | `boolean` | `true`   | Escaped `&`, `<`, `>`, `"` und `'` in der Eingabe, bevor die Codes angewendet werden   |
| `maxDepth`   | `number`  | `20`     | Wie oft ein Code höchstens angewendet wird, damit Verschachtelungen aufgelöst werden  |

## Methoden

| Methode                     | Rückgabe       | Beschreibung                                                          |
|-----------------------------|----------------|-----------------------------------------------------------------------|
| `parse(text)`               | `string`       | Escaped `text` und wendet alle Codes nacheinander an                  |
| `add(regex, replacement)`   | der Parser     | Hängt einen Code hinten an, verkettbar. `regex` ist String oder `RegExp` |
| `setCodes(codes)`           | der Parser     | Ersetzt alle Codes durch `codes`, verkettbar                          |

Ein `RegExp` für `add()` behält seine Flags; der Parser ergänzt nur `g`, falls es fehlt.

## Standard-BBCodes

Diese Codes kennen der Standard-Parser (`import bbCodeParser from 'js-bbcode-parser'`) und `js-bbcode-parser/codes`,
in dieser Reihenfolge:

| BBCode                                              | HTML                                                                          |
|-----------------------------------------------------|-------------------------------------------------------------------------------|
| `[br]`                                              | `<br>`                                                                        |
| `[b]text[/b]`                                       | `<strong>text</strong>`                                                       |
| `[i]text[/i]`                                       | `<em>text</em>`                                                               |
| `[u]text[/u]`                                       | `<u>text</u>`                                                                 |
| `[h1]text[/h1]` bis `[h6]text[/h6]`                 | `<h1>text</h1>` bis `<h6>text</h6>`                                           |
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
| `[a=anker]text[/a]`                                 | `<a id="anker" href="#anker">text</a>`                                        |
| `[list]text[/list]`                                 | `<ul>text</ul>`                                                               |
| `[*]text[/*]`                                       | `<li>text</li>`                                                               |

## Prüfungen der Standard-BBCodes

Besteht ein Wert seine Prüfung nicht, bleibt der BBCode unverändert als Text stehen.

| BBCode                 | Erlaubte Werte                                                                        |
|------------------------|---------------------------------------------------------------------------------------|
| `[url]`, `[url=…]`     | `http`, `https`, `mailto` oder eine relative Adresse, ohne Anführungszeichen und spitze Klammern |
| `[img]`, `[img=…]`     | `http`, `https` oder eine relative Adresse, ohne Anführungszeichen und spitze Klammern  |
| `target=…`             | `_blank`, `_self`, `_parent`, `_top` (Schreibweise egal)                              |
| `[email]`, `[email=…]` | genau ein `@`, keine Leerzeichen, keine Anführungszeichen und spitzen Klammern        |
| `[color=…]`            | ein Farbname (3 bis 30 Buchstaben) oder `#` mit 3 bis 8 Hex-Ziffern                    |
| `[size=…]`             | eine ganze Zahl von 1 bis 999                                                          |
| `[a=…]`                | beginnt mit einem Buchstaben, danach Buchstaben, Ziffern, `_`, `-`, `.` oder `:`       |

## Einschränkungen

- **Keine Attribute.** `[b class="x"]text[/b]` oder `[h1 data-value="1"]` werden nicht umgewandelt und bleiben als Text
  stehen.
- **`[code]` schützt seinen Inhalt nicht.** BBCodes darin werden trotzdem umgewandelt; HTML wird wie überall escaped.
- **Nicht geschlossene Tags** bleiben unverändert im Text stehen.
- **Kein Syntaxbaum.** Überlappende Tags wie `[b][i]x[/b][/i]` ergeben überlappendes HTML.
- **Deine eigenen Codes prüft der Parser nicht**, siehe [Verwendung](usage.md#sicherheit).
