import { build, buildCjs, buildEsm as buildEsmWithRollup, buildTypes } from './engine/rollup';
import { buildEsm as buildEsmWithSwc } from './engine/swc';
import type { Format } from './types';
import { useGlobalConfig } from './utils';

const { engine } = useGlobalConfig();

export { build, buildCjs, buildTypes };

export function buildEsm() {
    return engine === 'swc' ? buildEsmWithSwc() : buildEsmWithRollup();
}

export default function pack(format: Format) {
    switch (format) {
        case 'cjs':
            return buildCjs();
        case 'esm':
            return buildEsm();
        case 'umd':
            return;
        case 'iife':
            return;
        case 'types':
            return buildTypes();
    }
}
