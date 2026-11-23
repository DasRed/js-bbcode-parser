---
title: Verwendung
description: BBCode in HTML umwandeln mit js-bbcode-parser, mit Standard-Parser, eigenen BBCodes, Ersetzung als Funktion, Reihenfolge und abgesicherten Eingaben von Nutzern.
order: 20
slug: verwendung
section: Einstieg
---

## Standard-Parser

Der Default-Export ist ein fertiger Parser mit den üblichen BBCodes. Welche das sind, steht unter
[Optionen](options.md#standard-bbcodes).

```js
import bbCodeParser from 'js-bbcode-parser';

bbCodeParser.parse('Zeile eins[br][i]Zeile zwei[/i]');
// Zeile eins<br><em>Zeile zwei</em>
```

Groß- und Kleinschreibung der Tags ist egal (`[B]` wie `[b]`), und Inhalte dürfen über mehrere Zeilen gehen.
Verschachtelte Tags wie `[b][i]Text[/i][/b]` funktionieren auch.

## Eigener Parser

Für einen Parser nur mit deinen eigenen Codes legst du eine neue Instanz der Klasse an. Der Schlüssel ist ein
regulärer Ausdruck als String, der Wert die Ersetzung. Mit `$1`, `$2` … greifst du auf die Gruppen zu.

```js
import BBCodeParser from 'js-bbcode-parser/src/index.js';

const parser = new BBCodeParser({
    '\\[br\\]':                         '<br>',
    '\\[b\\](.+?)\\[/b\\]':             '<strong>$1</strong>',
    '\\[spoiler\\](.+?)\\[/spoiler\\]': '<details><summary>Spoiler</summary>$1</details>',
});

parser.parse('[spoiler]Er war es[/spoiler]');
// <details><summary>Spoiler</summary>Er war es</details>
```

> [!TIP]
> Weil die Ausdrücke als String übergeben werden, brauchst du doppelte Backslashes: `\\[b\\]` passt auf `[b]`.

## Den Parser erweitern

Mit `add()` hängst du einen Code an einen bestehenden Parser an, ohne die anderen zu verlieren:

```js
import bbCodeParser from 'js-bbcode-parser';

bbCodeParser
    .add('\\[hr\\]', '<hr>')
    .add('\\[s\\](.+?)\\[/s\\]', '<s>$1</s>');
```

> [!IMPORTANT]
> Der Standard-Parser ist eine einzige, gemeinsame Instanz. Was du dort mit `add()` oder `setCodes()` änderst, gilt
> überall in deiner Anwendung. Brauchst du an verschiedenen Stellen verschiedene Codes, leg jeweils einen eigenen
> Parser an.

`setCodes()` ersetzt dagegen **alle** Codes. Nach `bbCodeParser.setCodes({})` kennt der Standard-Parser keinen
einzigen BBCode mehr.

## Ersetzung als Funktion

Die Ersetzung wird an `String.prototype.replace` weitergegeben. Statt eines Strings geht deshalb auch eine Funktion:

```js
import BBCodeParser from 'js-bbcode-parser/src/index.js';

const parser = new BBCodeParser({
    '\\[upper\\](.+?)\\[/upper\\]': (match, text) => text.toUpperCase(),
});

parser.parse('[upper]laut[/upper]');
// LAUT
```

## Reihenfolge

Die Codes werden in der Reihenfolge angewendet, in der du sie angibst. Spezielle Varianten müssen deshalb vor den
allgemeinen stehen. Der Standard-Parser prüft zum Beispiel `[url=… target=…]` vor `[url=…]`, sonst würde der
allgemeine Ausdruck das `target` mit in die Adresse ziehen.

## Eingaben von Nutzern absichern

Der Parser lässt HTML im Text stehen und prüft keine Adressen oder Farben. Aus `[url=javascript:alert(1)]x[/url]`
wird ein funktionierender Skript-Link. Kommt der Text von Nutzern, reinige das Ergebnis vor der Ausgabe, zum Beispiel
mit [DOMPurify](https://github.com/cure53/DOMPurify):

```js
import bbCodeParser from 'js-bbcode-parser';
import DOMPurify from 'dompurify';

const html = DOMPurify.sanitize(bbCodeParser.parse(input));
```

> [!CAUTION]
> Der Standard-Parser enthält `[url=…|onclick]`, das beliebigen JavaScript-Code in ein `onclick` schreibt. Für Text von
> Nutzern solltest du diesen Code nicht anbieten: Leg einen eigenen Parser ohne ihn an.
