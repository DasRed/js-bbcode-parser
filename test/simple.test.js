import assert from 'assert';
import bbCodeParser from '../src/simple.js'

describe('Default Parser', () => {
    [
        [ // #10 https://github.com/DasRed/js-bbcode-parser/issues/10
            '[list]\n[*]item 1[/*]\n[*]item 2[/*]\n[/list]\n\n[b]\nmulti line\nbold text\n[/b]',
            '<ul>\n<li>item 1</li>\n<li>item 2</li>\n</ul>\n\n<strong>\nmulti line\nbold text\n</strong>',
        ],
        [ // #20 https://github.com/DasRed/js-bbcode-parser/issues/20
            '[code]nuff nuff nuff[/code] rofl copter [p]lalalaalalal[/p]',
            '<pre>nuff nuff nuff</pre> rofl copter <p>lalalaalalal</p>',
        ],
    ].forEach(
        ([input, output], index) => it(`#${index} parsing input to the correct output`,
            () => assert.strict.equal(bbCodeParser.parse(input), output)
        )
    );
});
