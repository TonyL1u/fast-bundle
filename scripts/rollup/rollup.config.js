import esbuild from 'rollup-plugin-esbuild';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export const OUTPUT_DIR = 'dist';

export const file = type => `${OUTPUT_DIR}/index.${type}`;

export default {
    input: 'src/index.ts',
    plugins: [esbuild(), resolve(), commonjs({ include: ['node_modules/**', 'node_modules/**/*'] })],
    external: [/node_modules/],
};
