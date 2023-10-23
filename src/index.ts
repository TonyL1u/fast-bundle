import pack from './pack';
import type { Format } from './types';
import { Command } from './types';
import { exec, useGlobalConfig } from './utils';
import watch from './watch';

const [command, format = 'cjs'] = process.argv.slice(2) as [Command, Format]; // 获取指令参数
const { outDir } = useGlobalConfig();

if (command === Command.BUILD) {
    pack(format);
} else if (command === Command.CLEAN) {
    exec(`rimraf ${outDir}`);
} else if (command === Command.WATCH) {
    watch();
}

export { build, buildCjs, buildEsm, buildTypes } from './pack';
export * from './types';
