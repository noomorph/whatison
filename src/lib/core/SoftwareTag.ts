import { Version } from './Version';

export class SoftwareTag {
    constructor(name: string, version?: Version) {
        this.name = String(name || '');
        this.version = version;
    }

    public name: string;
    public version: Version | undefined;
}
