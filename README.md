# fast-bundle

`fast-bundle` 是一个基于 [`rollup.js`]('https://www.rollupjs.com/') 封装的轻量级 js(ts) 库文件打包工具。

## 特性

-   🪶 轻量级 **2.67kB**（gzipped）
-   ⚙️ 零配置，开箱即用
-   🚀 基于 `rollup.js` ，构建速度快，产物体积小
-   ✨ 可扩展性强，支持自定义 `rollup` 插件以及多种格式单独构建
-   👀 集成了 Watch Mode，优化本地开发调试流程
-   🔥 可选使用 [swc](https://swc.rs/) 打包

## 使用方法

1. 安装 `fast-bundle`

```bash
# with npm
npm install fast-bundle --save-dev
```

```bash
# with pnpm
pnpm add fast-bundle --save-dev
```

2. 在项目根目录配置 `fast-bundle.config.cjs` （可选）

```js
// fast-bundle.config.cjs
module.exports = {
    input: 'src/index.ts', // 库入口文件，默认为 src/index.ts
    outDir: 'dist' // 产物的输出目录，默认为 dist
};
```

完整配置：

```ts
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
```

3. 在 `package.json` 中新建命令

```json
{
    "scripts": {
        "build": "fast-bundle build"
    }
}
```

构建命令默认的输出格式为 `cjs` ，打包完毕后会在 `dist` 目录生成产物 `index.cjs` 。可以通过不同的命令参数输出不同格式的打包产物。

```bash
npm run build
```

4. 构建命令

```bash
fast-bundle build [cjs | esm | umd | iife | types]
```
