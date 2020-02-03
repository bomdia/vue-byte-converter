import commonjs from '@rollup/plugin-commonjs' // Convert CommonJS modules to ES6
import buble from '@rollup/plugin-buble' // Transpile/polyfill with reasonable browser support
import resolve from '@rollup/plugin-node-resolve' // handle including of module
import vue from 'rollup-plugin-vue' // Handle .vue SFC files

export default {
  input: 'src/wrapper.compiled.js', // Path relative to package.json
  output: {
    name: 'VueByteConverter',
    exports: 'named'
  },
  plugins: [
    commonjs(),
    resolve(),
    vue({
      css: true, // Dynamically inject css as a <style> tag
      compileTemplate: true // Explicitly convert template to render function
    }),
    buble({ target: { chrome: 60 } }) // Transpile to ES5
  ]
}
