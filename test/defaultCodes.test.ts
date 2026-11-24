import BBCodeParser from '@/BBCodeParser';
import defaultCodes from '@/defaultCodes';
import {describe, expect, it} from 'vitest';

const parser = new BBCodeParser(defaultCodes);

function parse(text: string): string {
    return parser.parse(text);
}

describe('defaultCodes', () => {
    describe('simple tags', () => {
        it.each([
            ['[br]', '<br>'],
            ['[b]text[/b]', '<strong>text</strong>'],
            ['[i]text[/i]', '<em>text</em>'],
            ['[u]text[/u]', '<u>text</u>'],
            ['[h1]text[/h1]', '<h1>text</h1>'],
            ['[h2]text[/h2]', '<h2>text</h2>'],
            ['[h3]text[/h3]', '<h3>text</h3>'],
            ['[h4]text[/h4]', '<h4>text</h4>'],
            ['[h5]text[/h5]', '<h5>text</h5>'],
            ['[h6]text[/h6]', '<h6>text</h6>'],
            ['[p]text[/p]', '<p>text</p>'],
            ['[code]text[/code]', '<pre>text</pre>'],
            ['[list][*]a[/*][*]b[/*][/list]', '<ul><li>a</li><li>b</li></ul>'],
        ])('%s', (input, output) => {
            expect(parse(input)).toBe(output);
        });

        it('ignores the case of tags', () => {
            expect(parse('[B]x[/b] [I]y[/I] [Url=https://example.com]z[/URL]')).toBe('<strong>x</strong> <em>y</em> <a href="https://example.com">z</a>');
        });

        it('keeps empty tags', () => {
            expect(parse('[b][/b]')).toBe('[b][/b]');
        });

        it('keeps unclosed tags', () => {
            expect(parse('[b]open [i]italic[/i]')).toBe('[b]open <em>italic</em>');
        });

        it('keeps unknown tags', () => {
            expect(parse('[blink]x[/blink] [b class="x"]y[/b]')).toBe('[blink]x[/blink] [b class=&quot;x&quot;]y[/b]');
        });

        it('converts multi-line content', () => {
            expect(parse('[b]\nmulti line\nbold text\n[/b]')).toBe('<strong>\nmulti line\nbold text\n</strong>');
        });
    });

    describe('nesting', () => {
        it('nests different tags', () => {
            expect(parse('[b][i]text[/i][/b]')).toBe('<strong><em>text</em></strong>');
        });

        it('nests tags of the same kind', () => {
            expect(parse('[b]a [b]b[/b] c[/b]')).toBe('<strong>a <strong>b</strong> c</strong>');
        });

        it('nests lists', () => {
            expect(parse('[list][*]a[list][*]b[/*][/list][/*][/list]')).toBe('<ul><li>a<ul><li>b</li></ul></li></ul>');
        });

        it('matches siblings separately', () => {
            expect(parse('[b]a[/b] and [b]b[/b]')).toBe('<strong>a</strong> and <strong>b</strong>');
        });
    });

    describe('color and size', () => {
        it.each([
            ['[color=red]x[/color]', '<span style="color:red">x</span>'],
            ['[color=#FF0000]x[/color]', '<span style="color:#FF0000">x</span>'],
            ['[color=#f00]x[/color]', '<span style="color:#f00">x</span>'],
            ['[size=9]x[/size]', '<span style="font-size:9px">x</span>'],
            ['[size=999]x[/size]', '<span style="font-size:999px">x</span>'],
        ])('%s', (input, output) => {
            expect(parse(input)).toBe(output);
        });

        it.each([
            '[color=red;background:url(https://evil.example)]x[/color]',
            '[color=expression(alert(1))]x[/color]',
            '[color=red" onclick="alert(1)]x[/color]',
            '[size=0]x[/size]',
            '[size=1000]x[/size]',
            '[size=big]x[/size]',
        ])('keeps %s as text', (input) => {
            expect(parse(input)).not.toContain('<span');
        });

        it('nests colors', () => {
            expect(parse('[color=red]a[color=blue]b[/color][/color]')).toBe('<span style="color:red">a<span style="color:blue">b</span></span>');
        });
    });

    describe('images', () => {
        it.each([
            ['[img]https://example.com/a.jpg[/img]', '<img src="https://example.com/a.jpg" alt="">'],
            ['[img=https://example.com/a.jpg]', '<img src="https://example.com/a.jpg" alt="">'],
            ['[img]/images/a.jpg[/img]', '<img src="/images/a.jpg" alt="">'],
        ])('%s', (input, output) => {
            expect(parse(input)).toBe(output);
        });

        it.each([
            '[img]javascript:alert(1)[/img]',
            '[img=javascript:alert(1)]',
            '[img]data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=[/img]',
            '[img]mailto:a@example.com[/img]',
        ])('keeps %s as text', (input) => {
            expect(parse(input)).not.toContain('<img');
        });
    });

    describe('email', () => {
        it.each([
            ['[email]info@example.com[/email]', '<a href="mailto:info@example.com">info@example.com</a>'],
            ['[email=info@example.com]write me[/email]', '<a href="mailto:info@example.com">write me</a>'],
        ])('%s', (input, output) => {
            expect(parse(input)).toBe(output);
        });

        it.each(['[email]no address[/email]', '[email]a b@example.com[/email]', '[email=javascript]x[/email]', '[email=a@b@c]x[/email]'])('keeps %s as text', (input) => {
            expect(parse(input)).not.toContain('<a');
        });

        it('keeps an email address with nested markup as text', () => {
            expect(parse('[email=a@example.com]x[/email]')).toBe('<a href="mailto:a@example.com">x</a>');
            expect(parse('[email][b]a@example.com[/b][/email]')).toBe('[email]<strong>a@example.com</strong>[/email]');
        });
    });

    describe('links', () => {
        it.each([
            ['[url]https://example.com[/url]', '<a href="https://example.com">https://example.com</a>'],
            ['[url=https://example.com]text[/url]', '<a href="https://example.com">text</a>'],
            ['[url=/relative]text[/url]', '<a href="/relative">text</a>'],
            ['[url=mailto:info@example.com]text[/url]', '<a href="mailto:info@example.com">text</a>'],
            ['[url=https://example.com?a=1&b=2]text[/url]', '<a href="https://example.com?a=1&amp;b=2">text</a>'],
            ['[url=https://example.com target=_blank]text[/url]', '<a href="https://example.com" target="_blank" rel="noopener noreferrer">text</a>'],
            ['[url=https://example.com target=_BLANK]text[/url]', '<a href="https://example.com" target="_blank" rel="noopener noreferrer">text</a>'],
            ['[url=https://example.com target=_self]text[/url]', '<a href="https://example.com" target="_self">text</a>'],
            ['[url=https://example.com target=_parent]text[/url]', '<a href="https://example.com" target="_parent">text</a>'],
            ['[url=https://example.com target=_top]text[/url]', '<a href="https://example.com" target="_top">text</a>'],
            ['[url=https://example.com][b]bold[/b][/url]', '<a href="https://example.com"><strong>bold</strong></a>'],
        ])('%s', (input, output) => {
            expect(parse(input)).toBe(output);
        });

        it.each([
            '[url]javascript:alert(1)[/url]',
            '[url=javascript:alert(1)]x[/url]',
            '[url=JaVaScRiPt:alert(1)]x[/url]',
            '[url=javascript&colon;alert(1)]x[/url]',
            '[url=javascript&#58;alert(1)]x[/url]',
            '[url=java&#x09;script:alert(1)]x[/url]',
            '[url=data:text/html,<script>alert(1)</script>]x[/url]',
            '[url=vbscript:msgbox(1)]x[/url]',
            '[url=javascript:alert(1) target=_blank]x[/url]',
            '[url=https://example.com target=evil]x[/url]',
            '[url=https://example.com target=_blank" onclick="alert(1)]x[/url]',
        ])('keeps %s as text', (input) => {
            expect(parse(input)).not.toMatch(/<a /);
        });

        it('has no onclick code anymore', () => {
            expect(parse('[url=alert(1)|onclick]x[/url]')).toBe('<a href="alert(1)|onclick">x</a>');
        });

        it('does not put the HTML of a nested code into an attribute', () => {
            expect(parse('[url][img]https://a.example/ onmouseover=alert(1)//[/img][/url]')).toBe('[url]<img src="https://a.example/ onmouseover=alert(1)//" alt="">[/url]');
            expect(parse('[url][color=red]x[/color][/url]')).toBe('[url]<span style="color:red">x</span>[/url]');
        });

        it('nests a link in a link from the inside out', () => {
            expect(parse('[url=https://a.example]a [url=https://b.example]b[/url][/url]')).toBe('<a href="https://a.example">a <a href="https://b.example">b</a></a>');
        });
    });

    describe('anchors', () => {
        it('creates an anchor that links to itself', () => {
            expect(parse('[a=top]Top[/a]')).toBe('<a id="top" href="#top">Top</a>');
        });

        it.each(['[a=javascript:alert(1)]x[/a]', '[a=1abc]x[/a]', '[a=a" onclick="x]x[/a]'])('keeps %s as text', (input) => {
            expect(parse(input)).not.toContain('<a ');
        });
    });

    describe('attribute breakout', () => {
        it.each([
            '[url=x" onmouseover="alert(1)]x[/url]',
            '[url=x"onmouseover="alert(1)]x[/url]',
            '[url=x\'onmouseover=\'alert(1)]x[/url]',
            '[url]x" onmouseover="alert(1)[/url]',
            '[img]x" onerror="alert(1)[/img]',
            '[img=x"onerror="alert(1)]',
            '[email]a"onmouseover="alert(1)@example.com[/email]',
            '[email=a"onmouseover="alert(1)@example.com]x[/email]',
            '[color=red" onclick="alert(1)]x[/color]',
            '[a=a" onclick="x]x[/a]',
            '[url=https://example.com target=_blank"onclick="alert(1)]x[/url]',
        ])('keeps quotes escaped in %s', (input) => {
            expect(parse(input)).not.toMatch(/["']\s*on[a-z]+=/i);
        });
    });

    describe('cross-site scripting', () => {
        it.each([
            '<script>alert(1)</script>',
            '<img src=x onerror=alert(1)>',
            '[b]<svg onload=alert(1)>[/b]',
            '[code]<script>alert(1)</script>[/code]',
            '[url=https://example.com]<img src=x onerror=alert(1)>[/url]',
            '[p]</p><script>alert(1)</script>[/p]',
        ])('escapes HTML in %s', (input) => {
            const output = parse(input);

            expect(output).not.toMatch(/<(script|img src=x|svg)/i);
            expect(output).toContain('&lt;');
        });
    });

    describe('performance', () => {
        it.each([
            ['unclosed tags', '[b]'.repeat(100000)],
            ['unclosed links with target', '[url=a target=b'.repeat(20000)],
            ['unclosed links', '[url=https://example.com]'.repeat(20000)],
            ['unclosed colors', '[color=red'.repeat(30000)],
            ['unclosed list items', '[*]'.repeat(100000)],
            ['opening and closing tags', '[b]x'.repeat(50000) + '[/b]'.repeat(50000)],
            ['long text', 'lorem ipsum [b]dolor[/b] sit amet '.repeat(20000)],
        ])('parses %s in linear time', (name, input) => {
            const start = performance.now();
            parse(input);

            expect(performance.now() - start).toBeLessThan(2000);
        });
    });

    it('can be extended with own codes', () => {
        const extended = new BBCodeParser({...defaultCodes, '\\[hr\\]': '<hr>'});

        expect(extended.parse('[b]x[/b][hr]')).toBe('<strong>x</strong><hr>');
    });
});
