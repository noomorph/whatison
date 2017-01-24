import { DetectionResult, Detector, HTTPHeader, SemanticVersion, SoftwareTag } from '../core';

const SERVER_MATCH = /^(x-)?(\w+-?)?server\d?$/;
const POWERED_MATCH = /^(x-)?(\w+[- ]?)?powered\b/;
const EXACT_MATCHES = [
    "a-powered-by",
    "b-powered-by",
    "powered by",
    "powered-by",
    "server",
    "server2",
    "x-bs-server",
    "x-cf-powered-by",
    "x-cms-powered-by",
    "x-original-server",
    "x-php-powered-by",
    "x-powered-by",
    "x-powered-by-cms",
    "x-powered-cms",
    "x-server",
    "x-upstream-server"
];

const PHP_REGEX = /\bphp\/([3457][0-9a-z\-\.]*)/;

export class PoweredByDetector extends Detector {
    protected shouldScan(header: HTTPHeader): boolean {
        const name = header.lowerName;

        if (EXACT_MATCHES.indexOf(name) >= 0) {
            return true;
        }

        if (this.config.scanAllHeaders) {
            if (SERVER_MATCH.test(name)) {
                return true;
            }

            if (POWERED_MATCH.test(name)) {
                return true;
            }

            if (header.lowerValue.indexOf('powered') >= 0) {
                return true;
            }
        }


        return false;
    }

    protected doScan(header: HTTPHeader): DetectionResult | null {
        const match = PHP_REGEX.exec(header.lowerValue);

        if (match) {
            const tag = new SoftwareTag('php', SemanticVersion.parse(match[1]));
            return new DetectionResult([tag]);
        }

        return null;
    }
}
