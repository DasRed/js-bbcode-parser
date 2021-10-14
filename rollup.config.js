import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import clear from "rollup-plugin-clear";
import {terser} from "rollup-plugin-terser";

const babelOptionsES2018 = {
    runtimeHelpers:  false,
    externalHelpers: false,
    babelrc:         false,
    plugins:         [
        ["@babel/plugin-proposal-class-properties", {loose: true}],
        ["@babel/plugin-proposal-private-property-in-object", {loose: true}],
        ["@babel/plugin-proposal-private-methods", {loose: true}],
    ]
};

// https://rollupjs.org/guide/en#big-list-of-options
export default [
    // ES Modules Minified
    {
        input:   './src/index.js',
        output:  {
            file:      './dist/parser.min.js',
            format:    'esm',
            compact:   true,
            sourcemap: true,
        },
        plugins: [
            clear({targets: ['./dist']}),
            resolve(),
            babel(babelOptionsES2018),
            terser(),
        ]
    },
    // ES Modules None-Minified
    {
        input:   './src/index.js',
        output:  {
            file:      './dist/parser.js',
            format:    'esm',
            compact:   false,
            sourcemap: true,
        },
        plugins: [
            resolve(),
            babel(babelOptionsES2018),
        ]
    },
    // ES Modules Minified
    {
        input:   './src/simple.js',
        output:  {
            file:      './dist/simple.min.js',
            format:    'esm',
            compact:   true,
            sourcemap: true,
        },
        plugins: [
            resolve(),
            babel(babelOptionsES2018),
            terser(),
        ]
    },
    // ES Modules None-Minified
    {
        input:   './src/simple.js',
        output:  {
            file:      './dist/simple.js',
            format:    'esm',
            compact:   false,
            sourcemap: true,
        },
        plugins: [
            resolve(),
            babel(babelOptionsES2018),
        ]
    },
];
