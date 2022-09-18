import pino from "pino";
import ecsFormat from '@elastic/ecs-pino-format';
import path from "path";
import fs from "fs";

const bunyanLevels = {
    TRACE : 10,
    DEBUG : 20,
    INFO : 30,
    WARN : 40,
    ERROR : 50,
    FATAL : 60,
};

const streams = [
    { stream: process.stdout },
    { stream: fs.createWriteStream(path.join(getAppRootDir(), "./logs/log")) },
]


export const logger = pino({
    name: 'stockly',
    customLevels: bunyanLevels,
    formatters: {
        level: (label: string): Object => {
            return { level: label};
        },
    },
    ...ecsFormat()
}, pino.multistream(streams));


logger.info('Stockly logger started');

function getAppRootDir(): string {
    let currentDir = __dirname;
    while(!fs.existsSync(path.join(currentDir, 'package.json'))) {
        currentDir = path.join(currentDir, '..');
    }
    return currentDir;
}
