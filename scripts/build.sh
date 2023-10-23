function buildEsm() {
    rollup --config scripts/rollup/rollup.esm.config.js
}

function buildCjs() {
    rollup --config scripts/rollup/rollup.cjs.config.js
}

function buildDts() {
    rollup --config scripts/rollup/rollup.types.config.js
}

function buildAll() {
    # &异步调用
    buildEsm & buildCjs & buildDts
}

if [ -z $1 ]; then
    buildAll
elif [ $1 == 'esm' ]; then
    buildESM
elif [ $1 == 'cjs' ]; then
    buildCjs
elif [ $1 == 'dts' ]; then
    buildDts
else
    buildAll
fi

# 写入头命令
# sed命令在macOS和linux下表现不同
system=`uname`
if [ $system == 'Darwin' ]; then
    # macOS
    sed -i "" '1s/^/\#\!\/usr\/bin\/env node\n/' dist/index.cjs
else
    # linux
    sed -i "1i#!/usr/bin/env node" dist/index.cjs
fi
