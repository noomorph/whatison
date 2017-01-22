export class HTTPHeader {
    constructor(name: string, value: string) {
        this.name = String(name || '');
        this.value = String(value || '');

        this.lowerName = this.name.toLowerCase();
        this.lowerValue = this.value.toLowerCase();
    }

    public readonly name: string;
    public readonly value: string;

    public readonly lowerName: string;
    public readonly lowerValue: string;

    public isValid(): boolean {
        return this.name !== '';
    }

    public toString(): string {
        if (this.name && this.value) {
            return this.name + ': ' + this.value;
        } else if (this.name) {
            return this.name;
        } else {
            return '[invalid HTTPHeader]';
        }
    }

    public static parse(raw: string): HTTPHeader {
        const rawString = String(raw || '');
        const colonIndex = rawString.indexOf(':');

        const header = rawString.slice(0, colonIndex).trim();
        const value = rawString.slice(colonIndex + 1).trim();

        return new HTTPHeader(header, value);
    }
}
