import test from 'ava';
import { SemanticVersion } from '../../lib/core';

test(t => t.true(new SemanticVersion(1, 0, 0, '').isValid()));
test(t => t.false(new SemanticVersion().isValid()));

test(t => {
    const { major, minor, patch, metadata } = SemanticVersion.parse('v1.1.48RC1-trusty');

    t.is(major, 1, 'major version mismatch');
    t.is(minor, 1, 'minor version mismatch');
    t.is(patch, 48, 'patch version mismatch');
    t.is(metadata, 'RC1-trusty', 'metadata mismatch');
});

