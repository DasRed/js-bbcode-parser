import {defineConfig} from 'tsdown';

export default defineConfig({
    // CommonJS is built on purpose, no hint to switch to ESM only
    checks:         {legacyCjs: false},
    // keep exports.default in CommonJS, so the named type exports match the runtime
    cjsDefault:     false,
    dts:            true,
    entry:          {
        codes:  './src/defaultCodes.ts',
        parser: './src/parser.ts',
        simple: './src/simple.ts',
    },
    fixedExtension: false,
    format:         ['esm', 'cjs'],
    minify:         true,
    platform:       'neutral',
    target:         'es2018',
});
