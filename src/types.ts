import type { RollupBabelInputPluginOptions } from '@rollup/plugin-babel';
import type { RollupOptions } from 'rollup';

export enum Command {
    BUILD = 'build',
    CLEAN = 'clean',
    WATCH = 'watch'
}

export type Format = 'cjs' | 'esm' | 'umd' | 'iife' | 'types';

export interface FastConfig {
    /**
     * 打包文件入口。
     *
     * @defaultValue `src/index.ts`
     */
    input?: string;
    /**
     * 打包后的输出目录。
     *
     * @defaultValue `dist`
     */
    outDir?: string;
    /**
     * 打包后的文件名。
     *
     * @defaultValue `index`
     */
    outName?: string;
    /**
     * 底层代码transform引擎，默认为 rollup ，可选 [swc](https://swc.rs/) （打包速度非常快，仅供体验😃）。
     *
     * @defaultValue `rollup`
     */
    engine?: 'rollup' | 'swc';
    /**
     * rollup 相关配置。
     *
     * @see https://www.rollupjs.com/guide/big-list-of-options
     */
    rollup?: RollupOptions;
    babel?: {
        /**
         * 是否启用 babel 插件。
         *
         * @defaultValue `true`
         */
        enabled?: boolean;
        /**
         * `@rollup/plugin-babel` 插件相关配置。
         */
        options?: RollupBabelInputPluginOptions;
    };
    watch?: {
        /**
         * 本地调试的项目绝对路径。
         */
        bizProjectPath?: string;
        /**
         * watch mode 的时候默认不会编译ts类型，减少每次 compile 的时间。
         *
         * @defaultValue `true`
         */
        skipDts?: boolean;
        /**
         * 开启后，文件变动时仅会打包，不会使用 yalc 同步到业务代码。
         *
         * @defaultValue `false`
         */
        onlyBuild?: boolean;
        /**
         * 自定义每次文件变动时需要执行的逻辑。如果传入字符串会被当作一条终端命令执行，替换默认的 build 命令。
         */
        customScript?: string | (() => Promise<void>);
    };
}
