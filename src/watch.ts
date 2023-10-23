import chokidar from 'chokidar';
import { resolve } from 'path';
import { bold, underline } from 'picocolors';

import { buildCjs, buildTypes } from './pack';
import { Command } from './types';
import { exec, loggerOutput, useGlobalConfig } from './utils';

const __root = process.cwd();
const { name, version } = require(resolve(__root, 'package.json'));
const WORKING_PATH = process.env.INIT_CWD === __root ? resolve(__root, 'src') : process.env.INIT_CWD;
const { watch: watchConfig, outDir } = useGlobalConfig();
const { bizProjectPath, skipDts = true, onlyBuild = false, customScript } = watchConfig || {};

async function buildLogic() {
    if (customScript) {
        if (typeof customScript === 'string') {
            exec(customScript);
        } else if (typeof customScript === 'function') {
            await customScript();
        }
    } else {
        exec(`rimraf ${outDir}`);
        if (skipDts) {
            await buildCjs();
        } else {
            await Promise.all([buildCjs(), buildTypes()]);
        }
    }
}

export default function watch() {
    if (onlyBuild) {
        createWatcher(buildLogic);
    } else {
        loggerOutput(Command.WATCH, 'checking yalc version...');

        try {
            exec('yalc --version');
        } catch (error) {
            loggerOutput(Command.WATCH, 'please install yalc and try again❌ ==> npm install -g yalc', 'error');
            process.exit(0);
        }

        createWatcher(async () => {
            await buildLogic();
            exec('yalc publish --no-scripts --silent');
            exec(`yalc add ${name}@${version}`, { cwd: bizProjectPath });
        });
    }
}

function createWatcher(action: () => Promise<void>) {
    loggerOutput(Command.WATCH, 'start watching...👀');
    const watcher = chokidar.watch(WORKING_PATH!, { ignoreInitial: true });
    watcher.on('ready', () => loggerOutput(Command.WATCH, `now watch files in ${WORKING_PATH}\n`));
    watcher.on('change', async path => {
        try {
            loggerOutput(Command.WATCH, `file ${underline(path)} changed`);
            const start = +new Date();
            await action();
            loggerOutput(Command.WATCH, `✨ Done in ${bold(`${+new Date() - start}ms`)}\n`);
        } catch (error) {
            loggerOutput(Command.WATCH, error as string, 'error');
        }
    });
}
