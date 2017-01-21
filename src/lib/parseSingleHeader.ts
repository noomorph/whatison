import { IWhatisonResult, ISoftwareTag } from './core';

function isPoweredBy(header: string): boolean {
    return header.indexOf('powered-by') >= 0;
}

function isServer(header: string): boolean {
    return header.indexOf('server') >= 0;
}

function hasPHP(value: string): boolean {
    return value.indexOf('php') >= 0;
}

function hasRuby(value: string): boolean {
    return value.indexOf('ruby') >= 0;
}

function _parseSingleHeader(header: string, value: string): IWhatisonResult {
    const software: ISoftwareTag[] = [];

    if (isPoweredBy(header) || isServer(header)) {
        if (hasPHP(value)) {
            software.push({ name: 'php' });
        }

        if (hasRuby(value)) {
            software.push({ name: 'ruby' });
        }
    }

    if (header === 'x-wix-renderer-server') {
        software.push({ name: 'wix' });
    }

    return { software };
}

export function parseSingleHeader(_header: string | undefined, _value: string | undefined): IWhatisonResult {
    const header = String(_header || '').toLowerCase();
    const value = String(_value || '').toLowerCase();

    return _parseSingleHeader(header, value);
}
