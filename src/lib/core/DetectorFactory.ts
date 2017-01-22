import { ApplicationConfiguration } from './ApplicationConfiguration';
import { Detector, DetectorConstructor } from './Detector';

export class DetectorFactory {
    private classes: Set<DetectorConstructor>;

    constructor(
        protected appConfig: ApplicationConfiguration
    ) {
        this.classes = new Set();
    }

    public register(DetectorClass: DetectorConstructor) {
        this.classes.add(DetectorClass);
    }

    public instantiate(DetectorClass: DetectorConstructor) {
        return new DetectorClass(this.appConfig, this);
    }

    public instantiateAll(): Detector[] {
        const detectors: Detector[] = [];

        this.classes.forEach(DetectorClass => {
            detectors.push(this.instantiate(DetectorClass));
        });

        return detectors;
    }
}
