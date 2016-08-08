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
     * @param {Object} options
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
    BBCode.prototype = Object.create(Base.prototype, {

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
        },

        /**
         * parse
         *
         * @param {String} text
         * @returns {String}
         */
        parse: {
            value: function (text) {
                return this.codes.reduce(function (text, code) {
                    return text.replace(code.regexp, code.replacement);
                }, text);
            },
            enumerable: false,
            configurable: false,
            writable: true
        },

        /**
         * set bb codes
         *
         * @param {Object} codes
         * @returns {BBCode}
         */
        setCodes: {
            value: function (codes) {
                this.codes = Object.keys(this.code).map(function (replacement) {
                    var regex = this.code[replacement];

                    return {
                        regexp: new RegExp(regex.slice(1, regex.lastIndexOf('#')), 'igm'),
                        replacement: replacement
                    };
                }, this);

                return this;
            },
            enumerable: false,
            configurable: false,
            writable: true
        }
    });

    // create the Default
    BBCode.default = new BBCode({
        '#\[br\]#i': '<br>',

        '#\[b\](.+)\[/b\]#isU': '<strong>$1</strong>',
        '#\[i\](.+)\[/i\]#isU': '<em>$1</em>',
        '#\[u\](.+)\[/u\]#isU': '<u>$1</u>',

        '#\[h1\](.+)\[/h1\]#isU': '<h1><a href="#$1" name="$1">$1</a></h1>',
        '#\[h2\](.+)\[/h2\]#isU': '<h2><a href="#$1" name="$1">$1</a></h2>',
        '#\[h3\](.+)\[/h3\]#isU': '<h3><a href="#$1" name="$1">$1</a></h3>',
        '#\[h4\](.+)\[/h4\]#isU': '<h4><a href="#$1" name="$1">$1</a></h4>',
        '#\[h5\](.+)\[/h5\]#isU': '<h5><a href="#$1" name="$1">$1</a></h5>',
        '#\[h6\](.+)\[/h6\]#isU': '<h6><a href="#$1" name="$1">$1</a></h6>',

        '#\[p\](.+)\[/p\]#isU': '<p>$1</p>',

        '#\[color=(.+)\](.+)\[/color\]#isU': '<span style="color:$1">$2</span>',
        '#\[size=([0-9]+)\](.+)\[/size\]#isU': '<span style="font-size:$1px">$2</span>',

        '#\[img\](.+)\[/img\]#isU': '<img src="$1">',
        '#\[img=(.+)\]#isU': '<img src="$1">',

        '#\[email\](.+)\[/email\]#isU': '<a href="mailto:$1">$1</a>',
        '#\[email=(.+)\](.+)\[/email\]#isU': '<a href="mailto:$1">$2</a>',

        '#\[url\](.+)\[/url\]#isU': '<a href="$1">$1</a>',
        '#\[url=(.+)\|onclick\](.+)\[/url\]#isU': '<a onclick="$1">$2</a>',
        '#\[url=(.+)\starget=(.+)\](.+)\[/url\]#isU': '<a href="$1" target="$2">$3</a>',
        '#\[url=(.+)\](.+)\[/url\]#isU': '<a href="$1">$2</a>',

        '#\[a=(.+)\](.+)\[/a\]#isU': '<a href="#$1" name="$1">$2</a>',

        '#\[list\](.+)\[/list\]#isU': '<ul>$1</ul>',
        '#\[\*\](.+)\[/\*\]#isU': '<li>$1</li>',

        '#\[table\](.+)\[/table\]#isU': '<table class="bbCodeTable">$1</table>',
        '#\[table width=(.+)\](.+)\[/table\]#isU': '<table class="bbCodeTable" style="width: $1;">$2</table>',
        '#\[thead\](.+)\[/thead\]#isU': '<thead>$1</thead>',
        '#\[tbody\](.+)\[/tbody\]#isU': '<tbody>$1</tbody>',
        '#\[tfoot\](.+)\[/tfoot\]#isU': '<tfoot>$1</tfoot>',
        '#\[tr\](.+)\[/tr\]#isU': '<tr>$1</tr>',
        '#\[th\](.+)\[/th\]#isU': '<th>$1</th>',
        '#\[th align=(.+)\](.+)\[/th\]#isU': '<th style="text-align: $1;">$2</th>',
        '#\[td\](.+)\[/td\]#isU': '<td>$1</td>',
        '#\[td align=(.+)\](.+)\[/td\]#isU': '<td style="text-align: $1;">$2</td>'
    });

    // define configuration function for default
    BBCode.setCodes = BBCode.default.setCodes.bind(BBCode.default);

    return BBCode;
}));
