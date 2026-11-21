---
title: Migration
description: Was sich beim Wechsel auf Version 4 und 5 von js-bbcode-parser geändert hat.
order: 40
slug: migration
section: Referenz
---

Die API (`parse`, `add`, `setCodes`) und die Imports aus `src/` sind seit Version 3 gleich geblieben. Geändert haben sich
nur die gebauten Dateien in `dist/`. Importierst du `js-bbcode-parser` oder `js-bbcode-parser/src/index.js`, musst du
nichts tun.

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
