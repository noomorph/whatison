import test, { Macro, AssertContext } from 'ava';
import { IWhatisonResult, parseSingleHeader } from '../lib/parseSingleHeader';

type CallInput = [string, string];

const callParseSingleHeader: Macro<AssertContext> = function callParseSingleHeader(t: AssertContext, args: CallInput, expected: IWhatisonResult): void {
    const [header, value] = args;
    t.deepEqual(parseSingleHeader(header, value), expected);
}

callParseSingleHeader.title = function logParseSingleHeader(providedTitle: string, args: CallInput, expected: IWhatisonResult): string {
    const [header, value] = args;

    return `callParseSingleHeader(${header}, ${args}) === ${JSON.stringify(expected)}`;
};

const blank: IWhatisonResult = {
    software: []
};

test(callParseSingleHeader, [undefined, undefined], blank);
