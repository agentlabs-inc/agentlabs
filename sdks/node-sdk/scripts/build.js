const esbuild = require('esbuild');
const packageJson = require('../package.json');
const { join } = require('path');

console.time('done in');
console.log('Building package... 👨‍🍳');

esbuild.buildSync({
    entryPoints: [join(__dirname, '..', 'src', 'index.ts')],
    outfile: join(__dirname, '..', 'dist', 'index.js'),
    bundle: true,
    target: ['esnext'],
    platform: 'node',
    minify: false,
    external: [
        ...Object.keys(packageJson.dependencies ?? []),
        ...Object.keys(packageJson.peerDependencies ?? []),
    ],
});

console.timeEnd('done in');
