import swc from '@swc/core';
import type { BundleInput } from '@swc/core/spack';
import fs from 'fs';
import { resolve } from 'path';

import { PKG_PATH } from '../constants';
import { useGlobalConfig, withLogger } from '../utils';

const { dependencies, devDependencies } = require(PKG_PATH);
const references = fs.readFileSync(resolve(process.cwd(), 'node_modules/@types/node/index.d.ts'), 'utf8').split('\n');
const nodeBuiltInLibs = references
    .filter(line => line.startsWith('///'))
    .map(ref => {
        const [_, path] = ref.match(/<reference path=\"(.*)\" \/>/) ?? [];
        return path?.split('.d.ts')[0];
    })
    .filter(Boolean);

const { input: entry, outDir, outName } = useGlobalConfig();

export async function build(outputName: string) {
    const output = await swc.bundle({
        entry,
        externalModules: [...nodeBuiltInLibs, ...Object.keys(dependencies), ...Object.keys(devDependencies)]
    } as BundleInput);
    fs.writeFileSync(outputName, Object.values(output)[0]?.code);
}

export function buildEsm() {
    const fileName = `${outName}.mjs`;
    return withLogger(fileName, build.bind(null, `${outDir}/${fileName}`));
}
