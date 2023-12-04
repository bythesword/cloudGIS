// import typescript from 'rollup-plugin-typescript2';

// export default {
//   input: 'index.ts',
//   // output: {
//   //   file: 'index.js',
//   //   format: 'esm',
//   //   name: "tomCM"
//   // }
//   output: [
//     {// 输出两份文件，这一份用于上传到npm
//       format: 'es',
//       dir: './'
//     },
//     // {// 用于根项目测试
//     //   format: 'es',
//     //   dir: '../plugins'
//     // }
//   ],
//   plugins: [
//     typescript(),
//     // vuePlugin(),
//     // postcss()
//   ]
// };


import typescript from 'rollup-plugin-typescript2';
import { uglify } from "@blaumaus/rollup-plugin-uglify";

export default {
  input: 'index.ts',
  // output: {
  //   file: 'index.js',
  //   format: 'esm',
  //   name: "tomCM"
  // }
  output: [
    {// 输出两份文件，这一份用于上传到npm
      format: 'es',
      dir: './'
    },
    // {// 用于根项目测试
    //   format: 'es',
    //   dir: '../plugins'
    // }
  ],
  plugins: [
    // typescript(),uglify()
    // vuePlugin(),
    // postcss()
  ]
};