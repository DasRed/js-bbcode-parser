export default interface BBCodeParserOptionInterface {
    /** Escapes &, <, >, " and ' in the input before the codes are applied. Turn it off only for trusted input. */
    escapeHTML?: boolean;
    /** How often a code is applied to the text, so nested tags of the same kind are resolved from the inside out. */
    maxDepth?: number;
}
