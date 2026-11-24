---
title: Verwendung
description: BBCode mit js-bbcode-parser in sicheres HTML umwandeln: Standard-Parser, eigene BBCodes, Standard erweitern, Ersetzung als Funktion, Reihenfolge und Sicherheit.
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
Verschachtelte Tags wie `[b][i]Text[/i][/b]` oder `[list][*]a[list][*]b[/*][/list][/*][/list]` funktionieren auch.

## Eigener Parser

Für einen Parser nur mit deinen eigenen Codes legst du eine neue Instanz der Klasse an. Der Schlüssel ist ein
regulärer Ausdruck als String, der Wert die Ersetzung. Mit `$1`, `$2` … greifst du auf die Gruppen zu.

```js
import BBCodeParser from 'js-bbcode-parser/parser';

const parser = new BBCodeParser({
    '\\[br\\]':                         '<br>',
    '\\[b\\](.+?)\\[/b\\]':             '<strong>$1</strong>',
    '\\[spoiler\\](.+?)\\[/spoiler\\]': '<details><summary>Spoiler</summary>$1</details>',
});

parser.parse('[spoiler]Er war es[/spoiler]');
// <details><summary>Spoiler</summary>Er war es</details>
```

> [!TIP]
> Weil die Ausdrücke als String übergeben werden, brauchst du doppelte Backslashes: `\\[b\\]` passt auf `[b]`. `add()`
> nimmt auch direkt ein `RegExp`.

## Den Standard erweitern

`js-bbcode-parser/codes` enthält die Standard-BBCodes als Objekt. Verteil sie in deinen eigenen Parser und ergänze
deine Codes:

```js
import BBCodeParser from 'js-bbcode-parser/parser';
import defaultCodes from 'js-bbcode-parser/codes';

const parser = new BBCodeParser({
    ...defaultCodes,
    '\\[hr\\]': '<hr>',
});
```

Mit `add()` hängst du einen Code an einen bestehenden Parser an, ohne die anderen zu verlieren:

```js
parser
    .add('\\[hr\\]', '<hr>')
    .add(/\[s\](.+?)\[\/s\]/i, '<s>$1</s>');
```

> [!IMPORTANT]
> Der Standard-Parser ist eine einzige, gemeinsame Instanz. Was du dort mit `add()` oder `setCodes()` änderst, gilt
> überall in deiner Anwendung. Brauchst du an verschiedenen Stellen verschiedene Codes, leg jeweils einen eigenen
> Parser an.

`setCodes()` ersetzt dagegen **alle** Codes. Nach `parser.setCodes({})` kennt der Parser keinen einzigen BBCode mehr.

## Ersetzung als Funktion

Die Ersetzung wird an `String.prototype.replace` weitergegeben. Statt eines Strings geht deshalb auch eine Funktion:

```js
const parser = new BBCodeParser({
    '\\[upper\\](.+?)\\[/upper\\]': (match, text) => text.toUpperCase(),
});

parser.parse('[upper]laut[/upper]');
// LAUT
```

Gib `match` zurück, um einen Code unverändert zu lassen, etwa wenn ein Wert deine eigene Prüfung nicht besteht.

## Reihenfolge und Verschachtelung

Die Codes werden in der Reihenfolge angewendet, in der du sie angibst. Spezielle Varianten müssen deshalb vor den
allgemeinen stehen. Der Standard-Parser prüft zum Beispiel `[url=… target=…]` vor `[url=…]`.

Jeder Code wird so lange wiederholt, bis sich der Text nicht mehr ändert, höchstens `maxDepth`-mal (Standard 20). So
werden auch gleiche Tags ineinander von innen nach außen aufgelöst, solange der Ausdruck nicht über ein öffnendes Tag
derselben Art hinweg passt. Die Standard-Codes machen genau das.

## Sicherheit

Der Parser ist für Text von Nutzern gedacht und schützt von Haus aus vor Cross-Site-Scripting:

| Schutz              | Was passiert                                                                                   |
|---------------------|------------------------------------------------------------------------------------------------|
| HTML im Text        | `&`, `<`, `>`, `"` und `'` werden escaped, bevor ein Code angewendet wird                       |
| Links               | nur `http`, `https`, `mailto` und relative Adressen; `javascript:` und Ähnliches bleibt Text, auch mit Entities oder Steuerzeichen |
| Bilder              | nur `http`, `https` und relative Adressen                                                      |
| Attribute           | Werte mit Anführungszeichen oder spitzen Klammern werden abgelehnt, nichts kann aus einem Attribut ausbrechen |
| `target`            | nur `_blank`, `_self`, `_parent`, `_top`; `_blank` bekommt zusätzlich `rel="noopener noreferrer"` |
| Farben und Größen   | Farben als Name oder Hex-Wert, Größen von 1 bis 999                                            |
| Lange Eingaben      | die Standard-Ausdrücke laufen in linearer Zeit, auch bei kaputter Eingabe                       |

Ein Code, der eine Prüfung nicht besteht, bleibt unverändert als Text stehen.

> [!CAUTION]
> Für deine eigenen Codes bist du selbst verantwortlich. Prüf Werte, die in Attributen landen, etwa mit einer
> Ersetzung als Funktion, und vermeide Ausdrücke wie `(.+?)` mehrfach in einem Code: Bei kaputter Eingabe können sie
> sehr lange brauchen. `escapeHTML: false` schaltet das Escaping ab und ist nur für vertrauenswürdige Eingaben gedacht.
