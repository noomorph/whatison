import { ApplicationConfiguration } from './ApplicationConfiguration';
import { DetectorFactory } from './DetectorFactory';
import { DetectionResult } from './DetectionResult';
import { HTTPHeader } from './HTTPHeader';
import { SoftwareTag } from './SoftwareTag';
import { Version } from './Version';

export interface DetectorConstructor {
    new(config: ApplicationConfiguration, factory: DetectorFactory): Detector;
}

export abstract class Detector {
    constructor(
        protected config: ApplicationConfiguration,
        protected factory: DetectorFactory
    ) {}

    protected shouldScan(header: HTTPHeader): boolean {
        return true;
    }

    protected abstract doScan(header: HTTPHeader): DetectionResult | null;

    private stripVerboseInformationIfNeeded(result: DetectionResult | null): DetectionResult | null {
        if (result && !this.config.verbose) {
            return new DetectionResult(result.tags);
        }

        return result;
    }

    public scan(header: HTTPHeader): DetectionResult | null {
        const shouldScan: boolean = this.shouldScan(header);

        if (!shouldScan) {
            return null;
        }

        const result = this.stripVerboseInformationIfNeeded(this.doScan(header));

        return result;
    }
}
