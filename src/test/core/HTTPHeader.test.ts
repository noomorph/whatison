import test from 'ava';
import { HTTPHeader } from '../../lib/core';

const emptyHeader = new HTTPHeader('', '');
const namedHeader = new HTTPHeader('Server', '');
const valueHeader = new HTTPHeader('', 'Apache');
const fullHeader = new HTTPHeader('Server', 'Apache');

test(t => t.is(emptyHeader.name, ''));
test(t => t.is(emptyHeader.value, ''));
test(t => t.is(emptyHeader.lowerName, ''));
test(t => t.is(emptyHeader.lowerValue, ''));
test(t => t.is(emptyHeader.toString(), '[invalid HTTPHeader]'));

test(t => t.is(namedHeader.name, 'Server'));
test(t => t.is(namedHeader.lowerName, 'server'));
test(t => t.is(namedHeader.value, ''));
test(t => t.is(namedHeader.lowerValue, ''));
test(t => t.is(namedHeader.toString(), 'Server'));

test(t => t.is(valueHeader.name, ''));
test(t => t.is(valueHeader.lowerName, ''));
test(t => t.is(valueHeader.value, 'Apache'));
test(t => t.is(valueHeader.lowerValue, 'apache'));
test(t => t.is(valueHeader.toString(), '[invalid HTTPHeader]'));

test(t => t.is(fullHeader.name, 'Server'));
test(t => t.is(fullHeader.lowerName, 'server'));
test(t => t.is(fullHeader.value, 'Apache'));
test(t => t.is(fullHeader.lowerValue, 'apache'));
test(t => t.is(fullHeader.toString(), 'Server: Apache'));
