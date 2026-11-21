---
title: Überblick
description: Schlanker BBCode-Parser für Browser und Node.js, der BBCode per regulären Ausdrücken in HTML umwandelt und eigene Codes erlaubt.
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

Jeder BBCode ist ein regulärer Ausdruck mit einer Ersetzung. `parse()` wendet alle Ausdrücke der Reihe nach auf den
Text an. Das hält den Parser klein und leicht erweiterbar, heißt aber auch: Es gibt keinen Syntaxbaum, keine Prüfung
auf korrekt geschlossene Tags und kein Escaping.

> [!CAUTION]
> Der Parser reinigt die Eingabe nicht gegen XSS. HTML im Text bleibt erhalten, und auch BBCodes wie `[url]` oder
> `[color]` lassen sich für Skripte missbrauchen. Reinige das Ergebnis vor der Ausgabe, wenn der Text von Nutzern
> kommt. Wie, steht unter [Verwendung](usage.md#eingaben-von-nutzern-absichern).

## Status

Version 5.1.0 von 2024. Der Parser ist seit 2016 im Einsatz und funktioniert stabil. Wer von Version 3 oder 4 kommt,
findet die Änderungen unter [Migration](migration.md).
