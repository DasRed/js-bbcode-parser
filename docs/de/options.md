---
title: Optionen
description: Referenz von js-bbcode-parser mit Konstruktor, Methoden und allen Standard-BBCodes wie [b], [url] und [img], dazu die bekannten Einschränkungen des Parsers.
order: 30
slug: optionen
section: Referenz
---

## Konstruktor

```js
new BBCodeParser(codes)
```

| Name    | Typ                                  | Standard | Beschreibung                                                          |
|---------|--------------------------------------|----------|-----------------------------------------------------------------------|
| `codes` | `Object<string, string \| Function>` | Pflicht  | Schlüssel: regulärer Ausdruck als String. Wert: Ersetzung für `replace` |

Aus jedem Schlüssel wird ein `RegExp` mit den Flags `igms`:

| Flag | Wirkung                                                    |
|------|------------------------------------------------------------|
| `i`  | Groß- und Kleinschreibung egal                             |
| `g`  | alle Vorkommen ersetzen                                    |
| `m`  | `^` und `$` gelten je Zeile                                |
| `s`  | `.` passt auch auf Zeilenumbrüche (mehrzeilige Inhalte)     |

## Methoden

| Methode                     | Rückgabe       | Beschreibung                                                   |
|-----------------------------|----------------|----------------------------------------------------------------|
| `parse(text)`               | `string`       | Wendet alle Codes nacheinander auf `text` an                   |
| `add(regex, replacement)`   | der Parser     | Hängt einen Code hinten an, verkettbar                         |
| `setCodes(codes)`           | der Parser     | Ersetzt alle Codes durch `codes`, verkettbar                   |

## Standard-BBCodes

Diese Codes kennt der Standard-Parser (`import bbCodeParser from 'js-bbcode-parser'`), in dieser Reihenfolge:

| BBCode                                         | HTML                                                   |
|------------------------------------------------|--------------------------------------------------------|
| `[br]`                                         | `<br>`                                                 |
| `[b]text[/b]`                                  | `<strong>text</strong>`                                |
| `[i]text[/i]`                                  | `<em>text</em>`                                        |
| `[u]text[/u]`                                  | `<u>text</u>`                                          |
| `[h1]text[/h1]` bis `[h6]text[/h6]`            | `<h1>text</h1>` bis `<h6>text</h6>`                    |
| `[p]text[/p]`                                  | `<p>text</p>`                                          |
| `[code]text[/code]`                            | `<pre>text</pre>`                                      |
| `[color=#FF0000]text[/color]`                  | `<span style="color:#FF0000">text</span>`              |
| `[size=9]text[/size]`                          | `<span style="font-size:9px">text</span>`              |
| `[img]https://example.com/a.jpg[/img]`         | `<img src="https://example.com/a.jpg">`                |
| `[img=https://example.com/a.jpg]`              | `<img src="https://example.com/a.jpg">`                |
| `[email]info@example.com[/email]`              | `<a href="mailto:info@example.com">info@example.com</a>` |
| `[email=info@example.com]text[/email]`         | `<a href="mailto:info@example.com">text</a>`           |
| `[url]https://example.com[/url]`               | `<a href="https://example.com">https://example.com</a>` |
| `[url=alert('hi')\|onclick]text[/url]`         | `<a onclick="alert('hi')">text</a>`                    |
| `[url=https://example.com target=_blank]text[/url]` | `<a href="https://example.com" target="_blank">text</a>` |
| `[url=https://example.com]text[/url]`          | `<a href="https://example.com">text</a>`               |
| `[a=anker]text[/a]`                            | `<a href="anker" name="anker">text</a>`                |
| `[list]text[/list]`                            | `<ul>text</ul>`                                        |
| `[*]text[/*]`                                  | `<li>text</li>`                                        |

`[size=…]` erwartet eine Zahl (Pixel). Andere Werte bleiben als BBCode im Text stehen.

## Einschränkungen

- **Keine Attribute.** `[b class="x"]text[/b]` oder `[h1 data-value="1"]` werden nicht umgewandelt und bleiben als Text
  stehen.
- **`[code]` schützt seinen Inhalt nicht.** BBCodes und HTML darin werden trotzdem umgewandelt bzw. ausgegeben.
- **`[a=anker]` setzt `href="anker"`**, nicht `#anker`. Für Sprungmarken innerhalb der Seite brauchst du einen eigenen
  Parser mit passendem Code. `add()` reicht hier nicht, weil der Standard-Code `[a=…]` vorher greift.
- **Nicht geschlossene Tags** bleiben unverändert im Text stehen.
- **Kein Escaping, keine XSS-Prüfung**, siehe [Verwendung](usage.md#eingaben-von-nutzern-absichern).
