import type BBCodeCodesType from '@/BBCodeCodesType';
import BBCodeSanitizer from '@/BBCodeSanitizer';

const EMAIL         = /^[^\s@]+@[^\s@]+$/;
const IMAGE_SCHEMES = ['http', 'https'];
const LINK_SCHEMES  = ['http', 'https', 'mailto'];
const TARGETS       = ['_blank', '_parent', '_self', '_top'];

// an attribute ends at the next bracket, so a missing "]" cannot make the expression scan the rest of the text
const ATTRIBUTE          = '([^\\[\\]]+)';
const ATTRIBUTE_NO_SPACE = '([^\\[\\]\\s]+)';

// the content must not contain another opening tag of the same kind: this keeps matching linear
// and nested tags of the same kind are resolved from the inside out
function content(tag: string): string {
    return `((?:(?!\\[${tag}[\\]=\\s])[\\s\\S])+?)`;
}

function isSafeEmail(email: string): boolean {
    return EMAIL.test(email) && BBCodeSanitizer.isSafeURL(`mailto:${email}`, LINK_SCHEMES);
}

function tag(name: string, html: string): BBCodeCodesType {
    return {[`\\[${name}\\]${content(name)}\\[/${name}\\]`]: `<${html}>$1</${html}>`};
}

const defaultCodes: BBCodeCodesType = {
    '\\[br\\]': '<br>',

    ...tag('b', 'strong'),
    ...tag('i', 'em'),
    ...tag('u', 'u'),

    ...tag('h1', 'h1'),
    ...tag('h2', 'h2'),
    ...tag('h3', 'h3'),
    ...tag('h4', 'h4'),
    ...tag('h5', 'h5'),
    ...tag('h6', 'h6'),

    ...tag('p', 'p'),
    ...tag('code', 'pre'),

    [`\\[color=${ATTRIBUTE}\\]${content('color')}\\[/color\\]`]:   (match: string, color: string, text: string): string => BBCodeSanitizer.isSafeColor(color) ? `<span style="color:${color}">${text}</span>` : match,
    [`\\[size=([1-9][0-9]{0,2})\\]${content('size')}\\[/size\\]`]: '<span style="font-size:$1px">$2</span>',

    [`\\[img\\]${content('img')}\\[/img\\]`]: (match: string, src: string): string => BBCodeSanitizer.isSafeURL(src, IMAGE_SCHEMES) ? `<img src="${src}" alt="">` : match,
    [`\\[img=${ATTRIBUTE_NO_SPACE}\\]`]:      (match: string, src: string): string => BBCodeSanitizer.isSafeURL(src, IMAGE_SCHEMES) ? `<img src="${src}" alt="">` : match,

    [`\\[email\\]${content('email')}\\[/email\\]`]:                       (match: string, email: string): string => isSafeEmail(email) ? `<a href="mailto:${email}">${email}</a>` : match,
    [`\\[email=${ATTRIBUTE_NO_SPACE}\\]${content('email')}\\[/email\\]`]: (match: string, email: string, text: string): string => isSafeEmail(email) ? `<a href="mailto:${email}">${text}</a>` : match,

    [`\\[url\\]${content('url')}\\[/url\\]`]:                                                       (match: string, url: string): string => BBCodeSanitizer.isSafeURL(url, LINK_SCHEMES) ? `<a href="${url}">${url}</a>` : match,
    [`\\[url=${ATTRIBUTE_NO_SPACE}\\s+target=${ATTRIBUTE_NO_SPACE}\\]${content('url')}\\[/url\\]`]: (match: string, url: string, target: string, text: string): string => {
        if (BBCodeSanitizer.isSafeURL(url, LINK_SCHEMES) === false || TARGETS.includes(target.toLowerCase()) === false) {
            return match;
        }

        // a new window must not get access to this page via window.opener
        const rel = target.toLowerCase() === '_blank' ? ' rel="noopener noreferrer"' : '';

        return `<a href="${url}" target="${target.toLowerCase()}"${rel}>${text}</a>`;
    },
    [`\\[url=${ATTRIBUTE_NO_SPACE}\\]${content('url')}\\[/url\\]`]: (match: string, url: string, text: string): string => BBCodeSanitizer.isSafeURL(url, LINK_SCHEMES) ? `<a href="${url}">${text}</a>` : match,

    [`\\[a=${ATTRIBUTE_NO_SPACE}\\]${content('a')}\\[/a\\]`]: (match: string, name: string, text: string): string => BBCodeSanitizer.isSafeAnchor(name) ? `<a id="${name}" href="#${name}">${text}</a>` : match,

    ...tag('list', 'ul'),
    [`\\[\\*\\]${content('\\*')}\\[/\\*\\]`]: '<li>$1</li>',
};

export default defaultCodes;
