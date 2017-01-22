import { SoftwareTag, Detector, HTTPHeader, DetectionResult } from '../core';

const APACHE_REGEX = /apache.?server/;
const NGINX_REGEX = /nginx.?server/;
const IIS_REGEX = /iis.?server/;

function tag(name: string): DetectionResult {
    const singleTag = new SoftwareTag(name);
    return new DetectionResult([singleTag]);
}

const EXACT_MATCHES = new Map<string, DetectionResult>();
EXACT_MATCHES.set('commerce-server-software', tag('microsoft commerce server'));
EXACT_MATCHES.set('microsoftofficewebserver', tag('microsoft office web server'));
EXACT_MATCHES.set('x-php-powered-by', tag('php'));
EXACT_MATCHES.set('x-wix-renderer-server', tag('wix'));
EXACT_MATCHES.set('a-powered-by', tag('abo.cms'));
EXACT_MATCHES.set('b-powered-by', tag('bitrix'));

export class SpecificHeadersDetector extends Detector {
    protected doScan(header: HTTPHeader): DetectionResult | null {
        const name = header.lowerName;

        {
            const exactMatch = EXACT_MATCHES.get(name);
            if (exactMatch) {
                return exactMatch;
            }
        }

        if (name.match(APACHE_REGEX)) {
            return tag('apache');
        }

        if (name.match(NGINX_REGEX)) {
            return tag('nginx');
        }

        if (name.match(IIS_REGEX)) {
            return tag('iis');
        }

        return null;
    }

}
