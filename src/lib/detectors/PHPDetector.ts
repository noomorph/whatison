import { IDetector, SemanticVersion, Version } from '../core';

export class PHPDetector implements IDetector {
    public detected: boolean = false;
    public certain: boolean = false;
    public versions: Version[] = [];

    public parseHeader(header: string, value: string): void {
        const isStandardHeader: boolean = header === 'x-powered-by' || header === 'powered-by' || header === 'server';
        const match: string[] | null = PHPDetector.VERSION_REGEX.exec(value);

        if (match) {
            this.detected = true;
            this.certain = this.certain || isStandardHeader;
            this.versions.push(new SemanticVersion(match[1]));
        }
    }

    static VERSION_REGEX = /\bphp\/([3457][0-9a-z\-\.]*)/;
}
