## [6.0.0](https://github.com/DasRed/js-bbcode-parser/compare/v5.1.3...v6.0.0) (2026-11-24)

### ⚠ BREAKING CHANGES

* input HTML is escaped, unsafe BBCodes stay text, the onclick code is removed, [a=name] renders id and href="[#name](https://github.com/DasRed/js-bbcode-parser/issues/name)", src/ is no longer shipped (use js-bbcode-parser/parser and js-bbcode-parser/codes), CommonJS exposes the default export as require(…).default and Node.js >=22.13.0 is required.

### Features

* rewrite in TypeScript, fix XSS and ReDoS vulnerabilities ([d4a50a6](https://github.com/DasRed/js-bbcode-parser/commit/d4a50a6986dc483117cfc3af4e2cecc166b3a58a))

## [5.1.3](https://github.com/DasRed/js-bbcode-parser/compare/v5.1.2...v5.1.3) (2026-11-24)

### Bug Fixes

* homepage fixed ([fe53e9c](https://github.com/DasRed/js-bbcode-parser/commit/fe53e9c9c93abf21346c451c520ef18c261f2ba7))

## [5.1.2](https://github.com/DasRed/js-bbcode-parser/compare/v5.1.1...v5.1.2) (2026-11-24)

### Bug Fixes

* update deps ([9457795](https://github.com/DasRed/js-bbcode-parser/commit/9457795f1731897ac28649e2848fa27e9c78b65a))

## [5.1.1](https://github.com/DasRed/js-bbcode-parser/compare/v5.1.0...v5.1.1) (2026-11-24)

### Bug Fixes

* update deps ([e57575a](https://github.com/DasRed/js-bbcode-parser/commit/e57575a168c0e297f57ed754fe5a2c8cd867cff7))
* update github workflows ([c13a206](https://github.com/DasRed/js-bbcode-parser/commit/c13a206941148d4be3de4b86f54bfe718dbdf0de))

### Documentation

* adding docs for website ([3ac95fb](https://github.com/DasRed/js-bbcode-parser/commit/3ac95fb1aa5b497e31528f1a536489bdc1430565))
* adding docs for website ([78fa9a4](https://github.com/DasRed/js-bbcode-parser/commit/78fa9a4dc822d5f41f9c695b664c79243ea8fdbd))
* fixing description length ([d996391](https://github.com/DasRed/js-bbcode-parser/commit/d996391be07fda4128da1bc7e3f312452bde7065))
