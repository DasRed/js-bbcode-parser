import BBCodeParser from '@/BBCodeParser';
import parser from '@/parser';
import {expect, it} from 'vitest';

it('exports the class as default', () => {
    expect(parser).toBe(BBCodeParser);
});
