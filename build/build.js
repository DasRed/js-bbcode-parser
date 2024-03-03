import esbuild from 'esbuild';
import clear from 'esbuild-plugin-clear';
import time from 'esbuild-plugin-time';
import {dirname} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));


esbuild.build({
    entryPoints:   ['./src/index.js'],
    bundle:        true,
    minify:        true,
    sourcemap:     false,
    target:        ['esnext'],
    format:        'esm',
    legalComments: 'none',
    outfile:        './dist/parser.js',
    plugins:       [
        clear('./dist'),
        time(),
    ],
});

esbuild.build({
    entryPoints:    ['./src/simple.js'],
    bundle:        true,
    minify:        true,
    sourcemap:     false,
    target:        ['esnext'],
    format:        'esm',
    legalComments: 'none',
    outfile:        './dist/simple.js',
    plugins:       [
        time(),
    ],
});
