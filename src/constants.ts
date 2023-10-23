import type { RollupBabelInputPluginOptions } from '@rollup/plugin-babel';
import path from 'path';

import type { FastConfig } from './types';

export const CONFIG_PATH = path.resolve(process.cwd(), 'fast-pack.config.cjs');

export const PKG_PATH = path.resolve(process.cwd(), 'package.json');

export const RS_PACK_DEFAULT_CONFIG: FastConfig = {
    input: 'src/index.ts',
    outDir: 'dist',
    outName: 'index',
    engine: 'rollup',
    rollup: {},
    babel: {}
};

export const DEFAULT_BABEL_OPTIONS: RollupBabelInputPluginOptions = {
    presets: ['@babel/preset-env'],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    exclude: 'node_modules/**',
    babelHelpers: 'bundled'
};
