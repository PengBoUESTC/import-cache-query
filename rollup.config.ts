import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import clear from 'rollup-plugin-clear'
import json from '@rollup/plugin-json'
import { dts } from 'rollup-plugin-dts'

export default defineConfig(
  [
    {
      input: 'lib/index.ts',
      output: {
        dir: 'dist',
        format: 'esm',
        chunkFileNames: '[name].js'
      },
      plugins: [
        json(),
        nodeResolve(),
        commonjs(),
        clear({ targets: ['dist'] }),
        typescript({
          tsconfig: 'tsconfig.json',
        }),
      ]
    },
    {
      input: 'lib/index.ts',
      output: {
        dir: 'dist',
        format: 'esm',
        chunkFileNames: '[name].d.ts'
      },
      plugins: [dts({
        tsconfig: 'tsconfig.json',
      })]
    }
  ]
)