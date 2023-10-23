import basicConfig, { file } from './rollup.config.js';

export default {
    ...basicConfig,
    output: {
        file: file('cjs'),
        inlineDynamicImports: true,
        format: 'cjs'
    }
};
