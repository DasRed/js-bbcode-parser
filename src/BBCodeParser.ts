import type BBCodeCodesType from '@/BBCodeCodesType';
import type BBCodeParserOptionInterface from '@/BBCodeParserOptionInterface';
import type BBCodeReplacementType from '@/BBCodeReplacementType';
import BBCodeSanitizer from '@/BBCodeSanitizer';

interface BBCodeParserCodeInterface {
    regexp: RegExp;
    replacement: BBCodeReplacementType;
}

export default class BBCodeParser {
    protected codes: BBCodeParserCodeInterface[];
    protected readonly escapeHTML: boolean;
    protected readonly maxDepth: number;

    constructor(codes: BBCodeCodesType = {}, {escapeHTML = true, maxDepth = 20}: BBCodeParserOptionInterface = {}) {
        this.codes      = [];
        this.escapeHTML = escapeHTML;
        this.maxDepth   = Math.max(1, Math.floor(maxDepth));

        this.setCodes(codes);
    }

    add(regex: RegExp | string, replacement: BBCodeReplacementType): this {
        this.codes.push(BBCodeParser.createCode(regex, replacement));

        return this;
    }

    protected apply(text: string, {regexp, replacement}: BBCodeParserCodeInterface): string {
        let result = text;

        for (let depth = 0; depth < this.maxDepth; depth++) {
            const replaced = typeof replacement === 'string' ? result.replace(regexp, replacement) : result.replace(regexp, replacement);
            if (replaced === result) {
                return result;
            }

            result = replaced;
        }

        return result;
    }

    protected static createCode(regex: RegExp | string, replacement: BBCodeReplacementType): BBCodeParserCodeInterface {
        if (typeof regex === 'string') {
            return {regexp: new RegExp(regex, 'gims'), replacement};
        }

        // without the global flag only the first match would be replaced
        return {regexp: regex.global ? regex : new RegExp(regex.source, `${regex.flags}g`), replacement};
    }

    parse(text: string): string {
        const input = this.escapeHTML === true ? BBCodeSanitizer.escapeHTML(String(text)) : String(text);

        return this.codes.reduce((result: string, code: BBCodeParserCodeInterface): string => this.apply(result, code), input);
    }

    setCodes(codes: BBCodeCodesType): this {
        this.codes = Object.entries(codes).map(([regex, replacement]: [string, BBCodeReplacementType]): BBCodeParserCodeInterface => BBCodeParser.createCode(regex, replacement));

        return this;
    }
}
