import type { ExecSyncOptionsWithBufferEncoding } from 'child_process';
import { execSync } from 'child_process';
import colors, { bold } from 'picocolors';

import { CONFIG_PATH, RS_PACK_DEFAULT_CONFIG } from './constants';
import type { FastConfig } from './types';
import { Command } from './types';

const { input, outDir } = useGlobalConfig();

export function useGlobalConfig() {
    try {
        delete require.cache[require.resolve(CONFIG_PATH)];
        const config = require(CONFIG_PATH) as FastConfig;
        return { ...RS_PACK_DEFAULT_CONFIG, ...config };
    } catch (error) {
        return RS_PACK_DEFAULT_CONFIG;
    }
}

export function exec(command: string, options: ExecSyncOptionsWithBufferEncoding & { extraEnv?: string } = {}) {
    return execSync(command, {
        stdio: 'inherit',
        env: Object.assign({}, process.env, options.extraEnv || {}),
        ...options
    });
}

export function loggerOutput(prefix: string, msg: string, type: 'info' | 'error' = 'info') {
    const tag = type === 'info' ? colors.cyan(`[fast-pack:${prefix}]`) : colors.red(`[fast-pack:${prefix}]`);
    return console.log(`${colors.dim(new Date().toLocaleTimeString())} ${tag} ${colors.green(msg)}`);
}

export async function withLogger<T>(file: string, action: () => Promise<T>) {
    const output = `${outDir}/${file}`;
    loggerOutput(Command.BUILD, `${bold(input)} → ${bold(output)}...`);
    const start = Date.now();
    await action();
    const end = Date.now() - start;
    loggerOutput(Command.BUILD, `created ${bold(output)} in ${bold(`${end}ms`)}`);
}

export function merge<T extends Record<string, any>>(a: T, b: T) {
    return Object.keys(a).reduce((pre, cur) => {
        const valueA = a[cur];
        const valueB = b[cur];
        if (Array.isArray(valueA) && Array.isArray(valueB)) {
            return { ...pre, [cur]: [...valueA, ...valueB] };
        } else if (isObject(valueA) && isObject(valueB)) {
            return { ...pre, [cur]: { ...valueA, ...valueB } };
        }

        return { ...pre, [cur]: valueB || valueA };
    }, {}) as T;
}

function isObject(obj: any): obj is object {
    return Object.prototype.toString.call(obj) === '[object Object]';
}
