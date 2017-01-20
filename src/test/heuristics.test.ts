import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import * as _ from 'lodash';
import test, {CallbackTest, CallbackTestContext} from 'ava';

import { parseSingleHeader, IWhatisonResult } from '../lib/parseSingleHeader';

interface IHeuristicLimit {
    min: number;
    max: number;
}

interface IHeuristicStats {
    count: {
        [technology: string]: number;
    };
}

interface IExpectedHeuristics {
    count: {
        [technology: string]: IHeuristicLimit;
    };
}

function aggregate(stats: IHeuristicStats, result: IWhatisonResult): void {
    _(result.software).map('name').forEach((name: string) => {
        stats.count[name] = stats.count[name] || 0;
        stats.count[name]++;
    });
}

function parseHeaderLine(line: string) {
    const colonIndex = line.indexOf(':');
    const header = line.slice(0, colonIndex);
    const value = line.slice(colonIndex + 1);

    return [header, value];
}

function loadData(lineCallback: Function): Promise<any> {
    const input = fs.createReadStream(path.resolve('data', '500k-raw1.txt'), {
        encoding: 'utf8'
    });

    const rl = readline.createInterface({
        input,
        terminal: false
    });

    rl.on('line', lineCallback);

    return new Promise(resolve => {
        input.on('close', resolve);
    });
}

function assertTechnologyStats(technology: string, count: number, limit: IHeuristicLimit): string | void {
    if (!isFinite(count)) {
        return `no stats for ${technology}, count is: ${count}`;
    }

    if (count > limit.max) {
        return `too much ${technology}, expected: ${limit.max}, but was: ${count}`;
    }

    if (count < limit.min) {
        return `not enough ${technology}, expected: ${limit.min}, but was: ${count}`;
    }
}


test.cb('parseSingleHeader: heuristics', ((t: CallbackTestContext) => {
    t.plan(1);

    const stats: IHeuristicStats = {
        count: {
            php: 0,
            ruby: 0
        }
    };

    const expectedStats: IExpectedHeuristics = {
        count: {
            php: { min: 6000, max: 7000 },
            ruby: { min: 70, max: 80 },
            wix: { min: 6, max: 10 }
        }
    };

    loadData((line: string) => {
        const [header, value] = parseHeaderLine(line);
        const result = parseSingleHeader(header, value);
        aggregate(stats, result);
    }).then(() => {
        const hasDeviations: boolean = _(expectedStats.count).toPairs().reduce((result: boolean, pair: any) => {
            const technology: string = pair[0];
            const expected: IHeuristicLimit = pair[1];
            const actualCount: number = stats.count[technology];

            const message = assertTechnologyStats(technology, actualCount, expected);

            if (message) {
                t.fail(message);
                return true;
            }

            return result;
        }, false);

        if (!hasDeviations) {
            t.pass();
        }
        t.end();
    });
}));
