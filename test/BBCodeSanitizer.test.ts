import BBCodeSanitizer from '@/BBCodeSanitizer';
import {describe, expect, it} from 'vitest';

describe('BBCodeSanitizer', () => {
    describe('escapeHTML', () => {
        it('escapes the five special characters', () => {
            expect(BBCodeSanitizer.escapeHTML('<a href="x" title=\'y\'>&</a>')).toBe('&lt;a href=&quot;x&quot; title=&#39;y&#39;&gt;&amp;&lt;/a&gt;');
        });

        it('keeps text without special characters', () => {
            expect(BBCodeSanitizer.escapeHTML('[b]text[/b]')).toBe('[b]text[/b]');
        });

        it('escapes entities again', () => {
            expect(BBCodeSanitizer.escapeHTML('&amp;')).toBe('&amp;amp;');
        });
    });

    describe('unescapeHTML', () => {
        it('reverts escapeHTML', () => {
            const text = '<a href="x" title=\'y\'>&amp;</a>';

            expect(BBCodeSanitizer.unescapeHTML(BBCodeSanitizer.escapeHTML(text))).toBe(text);
        });

        it('decodes &amp; last', () => {
            expect(BBCodeSanitizer.unescapeHTML('&amp;lt;')).toBe('&lt;');
        });
    });

    describe('isSafeAnchor', () => {
        it.each(['top', 'section-1', 'a.b', 'a:b', 'A_b'])('accepts %s', (name) => {
            expect(BBCodeSanitizer.isSafeAnchor(name)).toBe(true);
        });

        it.each(['', '1top', '#top', 'a b', 'a&quot;b', 'javascript:alert(1)//x y'])('rejects %s', (name) => {
            expect(BBCodeSanitizer.isSafeAnchor(name)).toBe(false);
        });
    });

    describe('isSafeColor', () => {
        it.each(['red', 'RebeccaPurple', '#fff', '#FF0000', '#ff000080'])('accepts %s', (color) => {
            expect(BBCodeSanitizer.isSafeColor(color)).toBe(true);
        });

        it.each(['', 're', '#ff', '#fffffffff', 'red;background:url(x)', 'rgb(0,0,0)', 'expression(alert(1))', 'red&quot;'])('rejects %s', (color) => {
            expect(BBCodeSanitizer.isSafeColor(color)).toBe(false);
        });
    });

    describe('isSafeURL', () => {
        const schemes = ['http', 'https', 'mailto'];

        it.each([
            'https://example.com',
            'HTTP://example.com',
            'http://example.com/path?a=1&amp;b=2#hash',
            'mailto:info@example.com',
            '//example.com/image.png',
            '/relative/path',
            './relative',
            'relative/path:with-colon',
            '#anchor',
            '?query=1',
            'image.png',
        ])('accepts %s', (url) => {
            expect(BBCodeSanitizer.isSafeURL(url, schemes)).toBe(true);
        });

        it.each([
            '',
            ' ',
            'javascript:alert(1)',
            'JavaScript:alert(1)',
            ' javascript:alert(1)',
            'java\tscript:alert(1)',
            'java\nscript:alert(1)',
            'java\u0000script:alert(1)',
            'javascript&colon;alert(1)',
            'javascript&#58;alert(1)',
            'javascript&#058alert(1)',
            'javascript&#x3a;alert(1)',
            'java&#x09;script:alert(1)',
            'java&Tab;script:alert(1)',
            'java&NewLine;script:alert(1)',
            'jav&#x61;script:alert(1)',
            'javascript&amp;colon;alert(1)',
            'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
            'vbscript:msgbox(1)',
            'file:///etc/passwd',
            'x" onmouseover="alert(1)',
            'x\' onmouseover=\'alert(1)',
            '<strong>x</strong>',
            'https://example.com/>',
        ])('rejects %j', (url) => {
            expect(BBCodeSanitizer.isSafeURL(url, schemes)).toBe(false);
        });

        it('decodes a huge code point without throwing', () => {
            expect(BBCodeSanitizer.isSafeURL('a&#x110000;b', schemes)).toBe(true);
        });

        it('only allows the given schemes', () => {
            expect(BBCodeSanitizer.isSafeURL('mailto:info@example.com', ['http', 'https'])).toBe(false);
            expect(BBCodeSanitizer.isSafeURL('ftp://example.com', ['ftp'])).toBe(true);
        });
    });
});
