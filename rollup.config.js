import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript';
import filesize from 'rollup-plugin-filesize';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/index.ts',
  output: {
    format: 'cjs',
    file: 'dist/index.min.js',
    name: 'ESInterpret'
  },
  plugins: [
    typescript({ target: 'es5' }),
    terser(),
    nodeResolve(),
    commonjs(),
    filesize()
  ]
};
