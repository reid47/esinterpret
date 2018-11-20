import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript';
import filesize from 'rollup-plugin-filesize';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

const prod = process.env.NODE_ENV === 'production';

export default {
  input: 'src/index.ts',
  output: {
    format: 'cjs',
    file: 'dist/index.js',
    name: 'ESInterpret'
  },
  plugins: [
    typescript({ target: 'es2015' }),
    prod && terser(),
    nodeResolve(),
    commonjs(),
    filesize()
  ].filter(Boolean)
};
