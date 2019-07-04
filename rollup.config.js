import resolve from 'rollup-plugin-node-resolve'
export default [
  {
    input: 'src/content.js',
    output: {
      file: 'build/content_scripts/pinyin_it_content.js',
      format: 'iife',
      name: 'pinyinit'
    },
    plugins: [
      resolve()
    ]
  },
  {
    input: 'src/options.js',
    output: {
      file: 'build/options/options.js',
      format: 'iife',
      name: 'pinyinit'
    },
    plugins: [
      resolve()
    ]
  },
  {
    input: 'src/background.js',
    output: {
      file: 'build/background/background.js',
      format: 'iife',
      name: 'pinyinit'
    },
    plugins: [
      resolve()
    ]
  }
]
