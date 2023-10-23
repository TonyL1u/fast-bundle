import basicConfig, { file } from './rollup.config.js';

export default {
    ...basicConfig,
    output: {
        file: file('mjs'),
        inlineDynamicImports: true,
        format: 'esm'
    }
};
