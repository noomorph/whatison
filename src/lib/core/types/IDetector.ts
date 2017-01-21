import { Version } from '../versions/Version';

export interface IDetector {
    parseHeader(header: string, value: string): void;

    detected: boolean;
    certain: boolean;
    versions: Version[];
}
