import { Detector, DetectorFactory, HTTPHeader, ApplicationConfiguration, DetectionResult, SoftwareTag } from '../core';
import compact = require('lodash/compact');
import map = require('lodash/map');
import flatten = require('lodash/flatten');

export class AggregateDetector extends Detector {
    protected detectors: Detector[];

    constructor(
        protected config: ApplicationConfiguration,
        protected factory: DetectorFactory
    ) {
        super(config, factory);
        this.detectors = this.factory.instantiateAll();
    }

    protected doScan(header: HTTPHeader): DetectionResult | null {
        const results = [];

        for (let i = 0; i < this.detectors.length; i++) {
            const result = this.detectors[i].scan(header);

            if (result) {
                results.push(result);
            }
        }

        const allTags = map<DetectionResult, SoftwareTag>(results, 'tags');

        return new DetectionResult(compact(flatten(allTags)));
    }
}
