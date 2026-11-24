import BBCodeParser from '@/BBCodeParser';
import {describe, expect, it, vi} from 'vitest';

describe('BBCodeParser', () => {
    it('parses nothing without codes', () => {
        expect(new BBCodeParser().parse('[b]text[/b]')).toBe('[b]text[/b]');
    });

    it('applies codes given as object', () => {
        const parser = new BBCodeParser({
            '\\[br\\]':             '<br>',
            '\\[b\\](.+?)\\[/b\\]': '<strong>$1</strong>',
        });

        expect(parser.parse('a[br][b]b[/b]')).toBe('a<br><strong>b</strong>');
    });

    it('compiles string codes case-insensitive, global, multi-line and dot-all', () => {
        const parser = new BBCodeParser({'^\\[b\\](.+?)\\[/b\\]$': '<strong>$1</strong>'});

        expect(parser.parse('[B]a\nb[/b]\n[b]c[/B]')).toBe('<strong>a\nb</strong>\n<strong>c</strong>');
    });

    it('applies codes in the given order', () => {
        const parser = new BBCodeParser({
            '\\[a\\]': '[b]',
            '\\[b\\]': 'B',
        });

        expect(parser.parse('[a]')).toBe('B');
        expect(new BBCodeParser({'\\[b\\]': 'B', '\\[a\\]': '[b]'}).parse('[a]')).toBe('[b]');
    });

    it('accepts a replacement function', () => {
        const parser = new BBCodeParser({'\\[upper\\](.+?)\\[/upper\\]': (match: string, text: string): string => text.toUpperCase()});

        expect(parser.parse('[upper]loud[/upper] and [upper]louder[/upper]')).toBe('LOUD and LOUDER');
    });

    describe('add', () => {
        it('appends a code and returns the parser', () => {
            const parser = new BBCodeParser({'\\[b\\](.+?)\\[/b\\]': '<strong>$1</strong>'});

            expect(parser.add('\\[hr\\]', '<hr>')).toBe(parser);
            expect(parser.parse('[b]x[/b][hr]')).toBe('<strong>x</strong><hr>');
        });

        it('accepts a regular expression with the global flag as it is', () => {
            const parser = new BBCodeParser().add(/\[x\]/g, 'X');

            expect(parser.parse('[x][X]')).toBe('X[X]');
        });

        it('adds the global flag to a regular expression without it', () => {
            const parser = new BBCodeParser().add(/\[x\]/i, 'X');

            expect(parser.parse('[x][X]')).toBe('XX');
        });

        it('accepts a replacement function', () => {
            const parser = new BBCodeParser().add('\\[n=(\\d+)\\]', (match: string, value: string): string => String(Number(value) * 2));

            expect(parser.parse('[n=21]')).toBe('42');
        });
    });

    describe('setCodes', () => {
        it('replaces all codes and returns the parser', () => {
            const parser = new BBCodeParser({'\\[b\\]': 'B'});

            expect(parser.setCodes({'\\[i\\]': 'I'})).toBe(parser);
            expect(parser.parse('[b][i]')).toBe('[b]I');
        });

        it('removes all codes with an empty object', () => {
            const parser = new BBCodeParser({'\\[b\\]': 'B'}).setCodes({});

            expect(parser.parse('[b]')).toBe('[b]');
        });
    });

    describe('escapeHTML', () => {
        it('escapes the input by default', () => {
            const parser = new BBCodeParser({'\\[b\\](.+?)\\[/b\\]': '<strong>$1</strong>'});

            expect(parser.parse('<script>alert("x")</script> & [b]\'y\'[/b]')).toBe('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; <strong>&#39;y&#39;</strong>');
        });

        it('does not escape the replacement', () => {
            expect(new BBCodeParser({'\\[x\\]': '<x a="1">'}).parse('[x]')).toBe('<x a="1">');
        });

        it('keeps HTML with escapeHTML false', () => {
            const parser = new BBCodeParser({'\\[b\\](.+?)\\[/b\\]': '<strong>$1</strong>'}, {escapeHTML: false});

            expect(parser.parse('<em>[b]x[/b]</em>')).toBe('<em><strong>x</strong></em>');
        });
    });

    describe('maxDepth', () => {
        const nested = '\\[b\\]((?:(?!\\[b\\])[\\s\\S])+?)\\[/b\\]';

        it('resolves nested tags of the same kind', () => {
            expect(new BBCodeParser({[nested]: '<b>$1</b>'}).parse('[b]1[b]2[b]3[/b][/b][/b]')).toBe('<b>1<b>2<b>3</b></b></b>');
        });

        it('stops after maxDepth passes', () => {
            expect(new BBCodeParser({[nested]: '<b>$1</b>'}, {maxDepth: 2}).parse('[b]1[b]2[b]3[/b][/b][/b]')).toBe('[b]1<b>2<b>3</b></b>[/b]');
        });

        it('stops a code that creates its own match', () => {
            const replacement = vi.fn((): string => '[loop]');
            const parser      = new BBCodeParser({'\\[loop\\]': replacement}, {maxDepth: 5});

            expect(parser.parse('[loop]')).toBe('[loop]');
            expect(replacement).toHaveBeenCalledTimes(1);
        });

        it('stops a growing code after maxDepth passes', () => {
            const replacement = vi.fn((): string => '[grow][grow]');
            const parser      = new BBCodeParser({'\\[grow\\]': replacement}, {maxDepth: 3});

            expect(parser.parse('[grow]')).toBe('[grow]'.repeat(8));
            expect(replacement).toHaveBeenCalledTimes(7);
        });

        it.each([0, -5, 0.5])('applies a code at least once with maxDepth %s', (maxDepth) => {
            expect(new BBCodeParser({[nested]: '<b>$1</b>'}, {maxDepth}).parse('[b]1[b]2[/b][/b]')).toBe('[b]1<b>2</b>[/b]');
        });

        it('rounds maxDepth down', () => {
            expect(new BBCodeParser({[nested]: '<b>$1</b>'}, {maxDepth: 1.9}).parse('[b]1[b]2[/b][/b]')).toBe('[b]1<b>2</b>[/b]');
        });
    });

    it('converts a non string input to a string', () => {
        expect(new BBCodeParser().parse(42 as unknown as string)).toBe('42');
    });

    it('keeps the codes of separate parsers apart', () => {
        const first  = new BBCodeParser({'\\[x\\]': '1'});
        const second = new BBCodeParser({'\\[x\\]': '2'});

        first.add('\\[y\\]', 'Y');

        expect(first.parse('[x][y]')).toBe('1Y');
        expect(second.parse('[x][y]')).toBe('2[y]');
    });
});
