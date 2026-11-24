import BBCodeParser from '@/BBCodeParser';
import simple from '@/simple';
import {describe, expect, it} from 'vitest';

describe('simple', () => {
    it('is a parser instance', () => {
        expect(simple).toBeInstanceOf(BBCodeParser);
    });

    it.each([
        [ // #10 https://github.com/DasRed/js-bbcode-parser/issues/10
            '[list]\n[*]item 1[/*]\n[*]item 2[/*]\n[/list]\n\n[b]\nmulti line\nbold text\n[/b]',
            '<ul>\n<li>item 1</li>\n<li>item 2</li>\n</ul>\n\n<strong>\nmulti line\nbold text\n</strong>',
        ],
        [ // #20 https://github.com/DasRed/js-bbcode-parser/issues/20
            '[code]nuff nuff nuff[/code] rofl copter [p]lalalaalalal[/p]',
            '<pre>nuff nuff nuff</pre> rofl copter <p>lalalaalalal</p>',
        ],
        [
            '[b]Hello[/b] [url=https://example.com]world[/url]',
            '<strong>Hello</strong> <a href="https://example.com">world</a>',
        ],
    ])('parses %j', (input, output) => {
        expect(simple.parse(input)).toBe(output);
    });

    it('escapes HTML', () => {
        expect(simple.parse('<b>x</b>')).toBe('&lt;b&gt;x&lt;/b&gt;');
    });
});
