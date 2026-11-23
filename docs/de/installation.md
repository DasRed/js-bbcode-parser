---
title: Installation
description: js-bbcode-parser per npm installieren, die Voraussetzungen prüfen und den passenden Import für Node.js, Bundler wie esbuild oder Vite oder den Browser wählen.
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

- **ES-Module:** Das Paket ist reines ESM. In Node.js brauchst du `import` (Datei `.mjs` oder `"type": "module"`).
- **ES2018:** Die Ausdrücke nutzen das Flag `s` (Punkt passt auch auf Zeilenumbrüche). Das können alle aktuellen
  Browser und jede Node.js-Version mit ESM-Unterstützung.

## Was du importieren kannst

| Import                               | Inhalt                                                     |
|--------------------------------------|------------------------------------------------------------|
| `js-bbcode-parser`                   | Fertiger Parser mit den Standard-BBCodes (Instanz)          |
| `js-bbcode-parser/src/index.js`      | Die Klasse, um einen eigenen Parser anzulegen              |
| `js-bbcode-parser/dist/simple.js`    | Fertiger Parser als einzelne, minifizierte Datei           |
| `js-bbcode-parser/dist/parser.js`    | Die Klasse als einzelne, minifizierte Datei                |

Mit npm und einem Bundler (esbuild, Vite, webpack) nimmst du die ersten beiden. Die Dateien aus `dist/` sind für den
Browser ohne Build-Schritt gedacht, etwa über ein CDN:

```html
<script type="module">
    import bbCodeParser from 'https://cdn.jsdelivr.net/npm/js-bbcode-parser@5/dist/simple.js';

    document.querySelector('#preview').innerHTML = bbCodeParser.parse('[b]Hallo[/b]');
</script>
```

> [!WARNING]
> Das Beispiel schreibt das Ergebnis direkt in die Seite. Bei Text von Nutzern musst du es vorher reinigen, siehe
> [Verwendung](usage.md#eingaben-von-nutzern-absichern).
