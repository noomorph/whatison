import {Macro, AssertContext} from "ava";
import * as core from "../../lib/core";
import * as detectors from "../../lib/detectors";

export default function generate_detect_multi_versions_macro(config: core.ApplicationConfiguration): Macro<AssertContext> {
    const factory = new core.DetectorFactory(config);
    const macro: Macro<AssertContext> = function detect_php_version(t, rawHeader, expectedTags: core.SoftwareTag[]) {
        const header = core.HTTPHeader.parse(rawHeader);
        const detector = factory.instantiate(detectors.PoweredByDetector);
        const result = detector.scan(header);

        if (!result) {
            return t.fail('could not detect anything');
        }

        return t.pass('to be done');
    };

    macro.title = (title = '', header, version) => `${title}should detect many versions when given ${header}...`;

    return macro;
}
