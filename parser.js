'use strict';

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return factory();
        });

    } else if (typeof exports !== 'undefined') {
        root.BBCode = factory();

    } else {
        root.BBCode = factory();
    }
}(this, function () {
    /**
     * BBCode parser
     *
     * @param {Object} codes
     * @param {Object} [options]
     */
    function BBCode(codes, options) {
        this.codes = [];

        options = options || {};

        // copy options
        for (var optionName in options) {
            if (optionName === 'events') {
                continue;
            }
            this[optionName] = options[optionName];
        }

        this.setCodes(codes);
    }

    // prototype
    BBCode.prototype = Object.create(Object.prototype, {

        /**
         * all codes in structure.
         *
         * @var {Array}
         */
        codes: {
            value: null,
            enumerable: false,
            configurable: false,
            writable: true
        }
    });

    /**
     * parse
     *
     * @param {String} text
     * @returns {String}
     */
    BBCode.prototype.parse = function (text) {
        return this.codes.reduce(function (text, code) {
            return text.replace(code.regexp, code.replacement);
        }, text);
    };

    /**
     * add bb codes
     *
     * @param {String} regex
     * @param {String} replacement
     * @returns {BBCode}
     */
    BBCode.prototype.add = function (regex, replacement) {
        this.codes.push({
            regexp: new RegExp(regex, 'igm'),
            replacement: replacement
        });

        return this;
    };

    /**
     * set bb codes
     *
     * @param {Object} codes
     * @returns {BBCode}
     */
    BBCode.prototype.setCodes = function (codes) {
        this.codes = Object.keys(codes).map(function (regex) {
            var replacement = codes[regex];

            return {
                regexp: new RegExp(regex, 'igm'),
                replacement: replacement
            };
        }, this);

        return this;
    };

    // create the Default
    BBCode.default = new BBCode({
        '\\[br\\]': '<br>',

        '\\[b\\](.+)\\[/b\\]': '<strong>$1</strong>',
        '\\[i\\](.+)\\[/i\\]': '<em>$1</em>',
        '\\[u\\](.+)\\[/u\\]': '<u>$1</u>',

        '\\[h1\\](.+)\\[/h1\\]': '<h1><a href="$1" name="$1">$1</a></h1>',
        '\\[h2\\](.+)\\[/h2\\]': '<h2><a href="$1" name="$1">$1</a></h2>',
        '\\[h3\\](.+)\\[/h3\\]': '<h3><a href="$1" name="$1">$1</a></h3>',
        '\\[h4\\](.+)\\[/h4\\]': '<h4><a href="$1" name="$1">$1</a></h4>',
        '\\[h5\\](.+)\\[/h5\\]': '<h5><a href="$1" name="$1">$1</a></h5>',
        '\\[h6\\](.+)\\[/h6\\]': '<h6><a href="$1" name="$1">$1</a></h6>',

        '\\[p\\](.+)\\[/p\\]': '<p>$1</p>',

        '\\[color=(.+)\\](.+)\\[/color\\]': '<span style="color:$1">$2</span>',
        '\\[size=([0-9]+)\\](.+)\\[/size\\]': '<span style="font-size:$1px">$2</span>',

        '\\[img\\](.+)\\[/img\\]': '<img src="$1">',
        '\\[img=(.+)\\]': '<img src="$1">',

        '\\[email\\](.+)\\[/email\\]': '<a href="mailto:$1">$1</a>',
        '\\[email=(.+)\\](.+)\\[/email\\]': '<a href="mailto:$1">$2</a>',

        '\\[url\\](.+)\\[/url\\]': '<a href="$1">$1</a>',
        '\\[url=(.+)\\|onclick\\](.+)\[/url\]': '<a onclick="$1">$2</a>',
        '\\[url=(.+)\starget=(.+)\\](.+)\[/url\]': '<a href="$1" target="$2">$3</a>',
        '\\[url=(.+)\\](.+)\\[/url\\]': '<a href="$1">$2</a>',

        '\\[a=(.+)\\](.+)\\[/a\\]': '<a href="$1" name="$1">$2</a>',

        '\\[list\\](.+)\\[/list\\]': '<ul>$1</ul>',
        '\\[\*\\](.+)\\[/\\*\\]': '<li>$1</li>'
    });

    // define configuration function for default
    BBCode.setCodes = BBCode.default.setCodes.bind(BBCode.default);

    return BBCode;
}));
