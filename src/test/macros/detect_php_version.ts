import {Macro, AssertContext} from "ava";
import * as core from "../../lib/core";
import * as detectors from "../../lib/detectors";

export default function generate_detect_php_version_macro(config: core.ApplicationConfiguration): Macro<AssertContext> {
    const factory = new core.DetectorFactory(config);
    const macro: Macro<AssertContext> = function detect_php_version(t, rawHeader, expectedVersion) {
        const [_1, versionNumber] = expectedVersion.toLowerCase().split('/') || ['', ''];

        const header = core.HTTPHeader.parse(rawHeader);
        const detector = factory.instantiate(detectors.PoweredByDetector);
        const result = detector.scan(header);

        t.not(result, null, 'could not detect anything');

        if (result) {
            const tags = result.tags.filter(tag => tag.name === 'php');

            t.not(tags.length, 0, 'could not detect PHP version');
            t.is(tags.length, 1, 'found too many versions of PHP');
            t.not(tags[0].version, undefined, 'could not ascertain version of PHP');

            const version = tags[0].version;

            if (version) {
                t.is(version.toString(), versionNumber);
            }
        }
    };

    macro.title = (title = '', header, version) => `${title}should detect ${version} when given ${header}...`;
    return macro;
}
