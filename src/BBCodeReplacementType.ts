type BBCodeReplacementType = string | ((match: string, ...groups: string[]) => string);

export default BBCodeReplacementType;
