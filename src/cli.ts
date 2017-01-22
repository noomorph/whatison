import * as commander from 'commander';
import { ApplicationConfiguration, DetectorFactory } from './lib/core';
import * as detectors from './lib/detectors';

const pkg = require('../package.json') as any;
 
interface IWhatisonCommand extends commander.ICommand, ApplicationConfiguration {
    stream: boolean;
}

const configuration = commander
    .version(pkg.version)
    .option('-a, --all-headers', 'Scan all headers')
    .option('-v, --verbose', 'Turn on verbose mode ')
    .option('-s, --stream', 'Turn on stream mode ')
    .parse(process.argv) as IWhatisonCommand;

const factory = new DetectorFactory(configuration);
factory.register(detectors.PoweredByDetector);
factory.register(detectors.SpecificHeadersDetector);

const detector = factory.instantiate(detectors.AggregateDetector);
