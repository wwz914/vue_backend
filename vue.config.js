const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
module.exports = {
  // 修改默认打包入口,链式编程修改webpack配置
  chainWebpack:config=>{
    // 生产模式
    config.when(process.env.NODE_ENV==='production',config=>{
      config.entry('app').clear().add('./src/main-prod.js')

      // 判断生产/开发模式的标识
      config.plugin('html').tap(args=>{
        args[0].isProd=true
        return args
      })

      // 通过cdn加载外部资源
      config.set('externals',{
        // vue:'Vue',
        // 'vue-router':'VueRouter',
        // axios:'axios',
        // lodash:'lodash',
        echarts:'echarts',
        // nprogress:'Nprogress',
        'vue-quill-editor':'VueQuillEditor'
      })
    })

    //开发模式
    config.when(process.env.NODE_ENV==='development',config=>{
      config.entry('app').clear().add('./src/main-dev.js')

      config.plugin('html').tap(args=>{
        args[0].isProd=false
        return args
      })
    })
  }
};
// const { defineConfig } = require('@vue/cli-service');

// module.exports = (env, options) => {
//   const isProduction = process.env.NODE_ENV === 'production';
//   const entryFile = isProduction ? './src/main-prod.js' : './src/main-dev.js';

//   return defineConfig({
//     transpileDependencies: true,
//     configureWebpack: config => {
//       config.entry('app').clear().add(entryFile);
//     }
//   });
// };
