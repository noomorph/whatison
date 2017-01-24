import { Version } from './Version';

export class SemanticVersion implements Version {
    private raw: string;

    constructor(
        public major: number = NaN,
        public minor: number = NaN,
        public patch: number = NaN,
        public metadata: string = ''
    ) {}

    public isValid(): boolean {
        return !isNaN(this.major);
    }

    public toString(): string {
        if (!this.isValid()) {
            return this.raw;
        }

        const sPatch: string = isNaN(this.patch) ? '' : ('.' + this.patch);
        const sMinor: string = isNaN(this.minor) ? '' : ('.' + this.minor);

        return this.major + sMinor + sPatch + this.metadata;
    }

    public static compare(a: SemanticVersion, b: SemanticVersion): number {
        if (!a.isValid() || !b.isValid()) {
            return 0;
        }

        if (a.major !== b.major) {
            return Math.sign(a.major - b.major);
        }

        if (a.minor !== b.minor) {
            return a.minor - b.minor;
        }

        if (!isFinite(a.patch) || !isFinite(b.patch)) {
            return 0;
        }

        if (a.patch !== b.patch) {
            return a.patch - b.patch;
        }

        if (!a.metadata && b.metadata) {
            return -1;
        }

        if (a.metadata && !b.metadata) {
            return 1;
        }

        if (!a.metadata && !b.metadata) {
            return 0;
        }

        return a.metadata.localeCompare(b.metadata); // TODO: implement full-featured metadata comparison
    }

    public static parse(version: string = ''): SemanticVersion {
        const [numbers = '', ...saMetadata] = version.trim().split('-');
        const [sMajor = '', sMinor = '', sPatch = ''] = numbers.split('.');

        const major: number = parseInt(sMajor[0] === 'v' ? sMajor.slice(1) : sMajor);
        const minor: number = parseInt(sMinor, 10);
        const patch: number = parseInt(sPatch, 10);

        let metadata: string;
        if (isNaN(Number(sPatch)) && isFinite(patch)) {
            metadata = sPatch.replace(/^\d+/g, '');
        } else {
            metadata = '';
        }

        if (saMetadata.length > 0) {
            metadata += '-' + saMetadata.join('-');
        }

        const result = new SemanticVersion(major, minor, patch, metadata);
        result.raw = version;

        return result;
    }
}
