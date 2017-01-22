import { Version } from './Version';

export class SemanticVersion implements Version {
    private raw: string;
    private major: number;
    private minor: number;
    private patch: number;
    private metadata: string;

    constructor(version: string = '') {
        this.raw = version;

        const [numbers = '', ...metadata] = version.split('-');
        const [major, minor, patch] = numbers.split('.');

        this.major = Number(major);
        this.minor = Number(minor);
        this.patch = parseInt(patch, 10);

        if (isNaN(Number(patch)) && isFinite(this.patch)) {
            this.metadata = patch.replace(/^\d+/g, '');
        } else {
            this.metadata = '';
        }

        if (metadata.length > 0) {
            this.metadata += '-' + metadata.join('-');
        }
    }

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
}
