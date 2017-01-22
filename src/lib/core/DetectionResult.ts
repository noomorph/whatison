import { SoftwareTag } from './SoftwareTag';

export class DetectionResult {
    constructor(tags: SoftwareTag[]) {
        this.tags = tags;
    }

    public tags: SoftwareTag[];
}
