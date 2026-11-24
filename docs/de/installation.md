---
title: Installation
description: js-bbcode-parser per npm installieren, die Voraussetzungen prüfen und den passenden Import für ES-Module, CommonJS, TypeScript, Bundler oder den Browser wählen.
order: 10
slug: installation
section: Einstieg
---

## Paket installieren

```bash
npm i js-bbcode-parser
```

Das Paket hat keine Abhängigkeiten.

## Voraussetzungen

| Was     | Version     | Warum                                                          |
|---------|-------------|----------------------------------------------------------------|
| Node.js | ab 22.13    | Mindestversion in `engines`, älteste unterstützte LTS-Linie    |
| Browser | ES2018      | Die Builds zielen auf ES2018, das jeder aktuelle Browser kann  |

## Was du importieren kannst

| Import                    | Inhalt                                                         |
|---------------------------|----------------------------------------------------------------|
| `js-bbcode-parser`        | Fertiger Parser mit den Standard-BBCodes (Instanz)             |
| `js-bbcode-parser/parser` | Die Klasse `BBCodeParser`, um einen eigenen Parser anzulegen   |
| `js-bbcode-parser/codes`  | Die Standard-BBCodes als Objekt, um sie zu erweitern           |

Jeden Import gibt es als ES-Modul und als CommonJS:

```js
import bbCodeParser from 'js-bbcode-parser';
import BBCodeParser from 'js-bbcode-parser/parser';
import defaultCodes from 'js-bbcode-parser/codes';
```

```js
const bbCodeParser = require('js-bbcode-parser').default;
const BBCodeParser = require('js-bbcode-parser/parser').default;
const defaultCodes = require('js-bbcode-parser/codes').default;
```

In CommonJS liegt der Default-Export unter `.default`, neben den Typ-Exporten. TypeScript und Bundler erledigen
das bei `import … from` für dich.

## TypeScript

Typdefinitionen sind dabei. Die Typen für Codes und Optionen bekommst du als benannte Typ-Exporte:

```ts
import BBCodeParser, {type BBCodeCodesType, type BBCodeParserOptionInterface} from 'js-bbcode-parser/parser';

const codes: BBCodeCodesType               = {'\\[hr\\]': '<hr>'};
const options: BBCodeParserOptionInterface = {maxDepth: 10};
const parser                               = new BBCodeParser(codes, options);
```

## Im Browser

Die Dateien in `dist/` sind minifizierte ES-Module und funktionieren auch ohne Build-Schritt, etwa über ein CDN:

```html
<script type="module">
    import bbCodeParser from 'https://cdn.jsdelivr.net/npm/js-bbcode-parser@6/dist/simple.js';

    document.querySelector('#preview').innerHTML = bbCodeParser.parse('[b]Hallo[/b]');
</script>
```

`dist/simple.js` lädt `dist/codes.js` und gemeinsame Dateien mit einem Hash im Namen aus demselben Ordner.
