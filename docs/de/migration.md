---
title: Migration
description: Was sich bei js-bbcode-parser von Version 3 bis 6 geändert hat: Imports, Escaping, geprüfte BBCodes, entfernter onclick-Code und was du in deinem Code anpasst.
order: 40
slug: migration
section: Referenz
---

Die API (`parse`, `add`, `setCodes`) ist seit Version 3 gleich geblieben. Version 6 ändert die Imports, escaped die
Eingabe und prüft die Werte der Standard-BBCodes.

## Von 5 auf 6

Version 6 ist in TypeScript neu geschrieben, mit Schwerpunkt auf Sicherheit. Beim Standard-Parser ergeben die meisten
Texte dasselbe HTML wie vorher, einiges hat sich aber geändert.

### Imports

Die Quelldateien werden nicht mehr mitgeliefert. Nimm stattdessen die Exporte des Pakets:

| Bis 5.x                            | Ab 6.0                                     |
|------------------------------------|--------------------------------------------|
| `js-bbcode-parser`                 | `js-bbcode-parser` (unverändert)           |
| `js-bbcode-parser/src/index.js`    | `js-bbcode-parser/parser`                  |
| `js-bbcode-parser/src/simple.js`   | `js-bbcode-parser`                         |
| `js-bbcode-parser/dist/parser.js`  | `js-bbcode-parser/dist/parser.js` (unverändert) |
| `js-bbcode-parser/dist/simple.js`  | `js-bbcode-parser/dist/simple.js`, lädt jetzt weitere Dateien aus `dist/` |

Neu: `js-bbcode-parser/codes` mit den Standard-BBCodes, CommonJS über `require(…).default` und Typdefinitionen. Die
Dateien in `dist/` baut jetzt tsdown.

### Verhalten

| Thema                          | Bis 5.x                                    | Ab 6.0                                                 |
|--------------------------------|--------------------------------------------|--------------------------------------------------------|
| HTML im Text                   | wird durchgereicht                         | wird escaped, abschaltbar über `escapeHTML`            |
| `[url=…\|onclick]`             | `<a onclick="…">`                          | entfernt, kein Code mehr                               |
| `javascript:` und andere Schemata | werden zu Links und Bildern             | bleiben Text                                           |
| `target=_blank`                | ohne `rel`                                 | mit `rel="noopener noreferrer"`, andere Ziele als `_blank`, `_self`, `_parent`, `_top` bleiben Text |
| `[color=…]`                    | jeder Wert                                 | nur Farbname oder Hex-Wert                             |
| `[size=…]`                     | jede Zahl                                  | 1 bis 999                                              |
| `[email]`                      | jeder Wert                                 | eine Adresse mit genau einem `@` und ohne Leerzeichen  |
| `[img]`                        | `<img src="…">`                            | `<img src="…" alt="">`                                 |
| `[a=name]`                     | `<a href="name" name="name">`              | `<a id="name" href="#name">`                           |
| Gleiche Tags ineinander        | kaputtes HTML                              | von innen nach außen aufgelöst (`maxDepth`)            |
| Lange oder kaputte Eingaben    | konnten Minuten dauern                     | lineare Laufzeit                                       |
| Node.js                        | jede Version mit ESM                       | ab 22.13                                               |

### Was du prüfen solltest

- Bauen deine eigenen Codes auf HTML in der Eingabe, übergib `{escapeHTML: false}`, aber nur bei vertrauenswürdiger
  Eingabe.
- Hast du `[url=…|onclick]` genutzt, leg dafür einen eigenen Code mit eigenen Prüfungen an.
- Gestaltest du `[a=…]`-Anker oder verlinkst auf sie: Sie nutzen jetzt `id` und verlinken auf `#name`.
- Imports aus `src/` müssen auf die oben genannten Exporte umziehen.

## Von 4 auf 5

Seit 5.0.0 baut esbuild die Dateien in `dist/`. Die Funktion ist dieselbe, aber:

- `dist/parser.js` und `dist/simple.js` sind jetzt selbst minifiziert.
- `dist/parser.min.js` und `dist/simple.min.js` gibt es nicht mehr. Nimm stattdessen `dist/parser.js` bzw.
  `dist/simple.js`.
- Source Maps (`*.js.map`) werden nicht mehr mitgeliefert.

## Von 3 auf 4

Version 4.0.0 hat die Builds für ältere Browser (UMD, ES5, Internet Explorer 11) entfernt. Es gibt nur noch ES-Module,
die bisherigen `.esm`-Dateien haben die kurzen Namen bekommen:

| Bis 3.x                  | Ab 4.0               |
|--------------------------|----------------------|
| `dist/parser.esm.js`     | `dist/parser.js`     |
| `dist/parser.esm.min.js` | `dist/parser.min.js` |
| `dist/simple.esm.js`     | `dist/simple.js`     |
| `dist/simple.esm.min.js` | `dist/simple.min.js` |

Die UMD-Dateien und die globale Variable `BBCode` sind weggefallen. Hast du den Parser per `<script>` ohne
`type="module"` geladen, stell auf ein ES-Modul um, siehe [Installation](installation.md#was-du-importieren-kannst).
