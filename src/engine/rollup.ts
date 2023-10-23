import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import type { OutputOptions, RollupOptions } from 'rollup';
import { rollup } from 'rollup';

import { DEFAULT_BABEL_OPTIONS } from '../constants';
import { merge, useGlobalConfig, withLogger } from '../utils';

const { default: esbuild } = require('rollup-plugin-esbuild');
const { default: dts } = require('rollup-plugin-dts');
const { input, babel: babelConfig, outDir, rollup: rollupConfig, outName } = useGlobalConfig();
const { enabled = true, options: babelOptions = DEFAULT_BABEL_OPTIONS } = babelConfig || {};

const DEFAULT_OPTIONS = {
    input,
    plugins: [esbuild(), resolve(), commonjs({ include: ['node_modules/**', 'node_modules/**/*'] }), enabled ? babel({ ...DEFAULT_BABEL_OPTIONS, ...babelOptions }) : {}],
    external: [/node_modules/],
    onwarn: () => null
} as RollupOptions;

export const build = async (output: OutputOptions, inputOptionsOverride: RollupOptions = {}, inputOptionsMerged: RollupOptions = {}) => {
    const bundle = await rollup(merge({ ...DEFAULT_OPTIONS, ...rollupConfig, ...inputOptionsOverride } as RollupOptions, inputOptionsMerged));
    return await bundle.write(output);
};

export function buildCjs() {
    const fileName = `${outName}.cjs`;
    return withLogger(
        fileName,
        build.bind(null, {
            file: `${outDir}/${fileName}`,
            inlineDynamicImports: true,
            format: 'cjs'
        })
    );
}

export function buildEsm() {
    const fileName = `${outName}.mjs`;
    return withLogger(
        fileName,
        build.bind(null, {
            file: `${outDir}/${fileName}`,
            inlineDynamicImports: true,
            format: 'es'
        })
    );
}

export function buildTypes() {
    const fileName = `${outName}.d.ts`;
    return withLogger(
        fileName,
        build.bind(
            null,
            {
                file: `${outDir}/${fileName}`,
                format: 'es'
            },
            { plugins: [dts()] }
        )
    );
}
