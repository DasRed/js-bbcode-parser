---
title: Überblick
description: Schlanker BBCode-Parser für Browser und Node.js, der BBCode per regulären Ausdrücken in sicheres HTML umwandelt, Eingaben escaped und eigene Codes erlaubt.
order: 0
section: Einstieg
---

`js-bbcode-parser` wandelt BBCode wie `[b]fett[/b]` oder `[url=…]Link[/url]` in HTML um. Er läuft im Browser und in
Node.js, hat keine Abhängigkeiten und bringt einen fertigen Parser mit den üblichen BBCodes mit. Eigene Codes legst du
als Paar aus regulärem Ausdruck und Ersetzung an.

## Kurzbeispiel

```js
import bbCodeParser from 'js-bbcode-parser';

bbCodeParser.parse('[b]Hallo[/b] [url=https://example.com]Welt[/url]');
// <strong>Hallo</strong> <a href="https://example.com">Welt</a>
```

## So funktioniert er

Jeder BBCode ist ein regulärer Ausdruck mit einer Ersetzung. `parse()` escaped zuerst HTML im Text und wendet dann
alle Ausdrücke der Reihe nach an. Verschachtelte Tags, auch gleiche, werden von innen nach außen aufgelöst. Das hält
den Parser klein und leicht erweiterbar; einen Syntaxbaum und eine Prüfung auf korrekt geschlossene Tags gibt es nicht.

## Von Haus aus sicher

Seit Version 6 ist der Parser für Text von Nutzern gebaut:

- HTML im Text wird escaped, `<script>` bleibt sichtbarer Text.
- Links und Bilder nehmen nur `http`, `https` (Links auch `mailto`) und relative Adressen an.
  `[url=javascript:…]` bleibt deshalb normaler Text.
- Werte in Attributen können nicht aus ihren Anführungszeichen ausbrechen, Farben nehmen nur Namen und Hex-Werte an.
- Die Standard-Ausdrücke laufen in linearer Zeit. Lange oder kaputte Eingaben können den Parser nicht blockieren.

Die Einzelheiten stehen unter [Verwendung](usage.md#sicherheit).

## Status

Version 6 von 2026, in TypeScript neu geschrieben, mit Builds als ES-Modul und CommonJS und mit Typdefinitionen. Der
Parser ist seit 2016 im Einsatz. Du kommst von einer älteren Version? Die Änderungen stehen unter
[Migration](migration.md).
