const ENTITIES: Record<string, string> = {
    '"': '&quot;',
    '&': '&amp;',
    '\'': '&#39;',
    '<': '&lt;',
    '>': '&gt;',
};

const NAMED_ENTITIES: Record<string, string> = {
    colon:   ':',
    newline: '\n',
    tab:     '\t',
};

export default class BBCodeSanitizer {
    static escapeHTML(text: string): string {
        return text.replace(/[&<>"']/g, (character: string): string => ENTITIES[character]);
    }

    static isSafeAnchor(name: string): boolean {
        return /^[a-z][\w:.-]*$/i.test(name);
    }

    static isSafeColor(color: string): boolean {
        return /^(#[0-9a-f]{3,8}|[a-z]{3,30})$/i.test(color);
    }

    static isSafeURL(url: string, schemes: string[]): boolean {
        // the input is escaped, so quotes or angle brackets can only come from the replacement of a nested code
        // or from unescaped input; both would break out of the attribute
        if (/["'<>]/.test(url)) {
            return false;
        }

        // browsers decode entities and drop control characters and whitespace, so "java&#x09;script:" is still a scheme
        const normalized = BBCodeSanitizer.unescapeHTML(url)
                                          .replace(/&#x([0-9a-f]+);?/gi, (match: string, hex: string): string => String.fromCodePoint(Math.min(Number.parseInt(hex, 16), 0x10FFFF)))
                                          .replace(/&#(\d+);?/g, (match: string, decimal: string): string => String.fromCodePoint(Math.min(Number.parseInt(decimal, 10), 0x10FFFF)))
                                          .replace(/&(colon|newline|tab);/gi, (match: string, name: string): string => NAMED_ENTITIES[name.toLowerCase()])
                                          .replace(/[\u0000- \u007F-\u009F]/g, '');

        if (normalized === '') {
            return false;
        }

        const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(normalized);
        if (scheme === null) {
            return true;
        }

        return schemes.includes(scheme[1].toLowerCase());
    }

    static unescapeHTML(text: string): string {
        return text.replace(/&quot;/g, '"')
                   .replace(/&#39;/g, '\'')
                   .replace(/&lt;/g, '<')
                   .replace(/&gt;/g, '>')
                   .replace(/&amp;/g, '&');
    }
}
