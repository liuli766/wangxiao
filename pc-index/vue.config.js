// vue.config.js
const isProduction = process.env.NODE_ENV === "production";
const Version = require("./package.json").version; // 当前版本号
module.exports = {
    publicPath: isProduction ? "/" : "/",

    outputDir: "dist",

    assetsDir: "static",

    filenameHashing: true,

    // eslint-loader 是否在保存的时候检查
    lintOnSave: true,

    // 是否使用包含运行时编译器的Vue核心的构建
    runtimeCompiler: false,

    // 默认情况下 babel-loader 忽略其中的所有文件 node_modules
    transpileDependencies: [],

    // 生产环境 sourceMap
    productionSourceMap: false,

    // cors 相关 https://jakearchibald.com/2017/es-modules-in-browsers/#always-cors
    // corsUseCredentials: false,
    // webpack 配置，键值对象时会合并配置，为方法时会改写配置
    // https://cli.vuejs.org/guide/webpack.html#simple-configuration
    // configureWebpack: config => {},
    configureWebpack: {
        // externals: {
        //     vue: "Vue",
        //     "vue-router": "VueRouter",
        //     vuex: "Vuex"
        // }
        entry: ["babel-polyfill", "./src/main.ts"],
        output: {
            // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
            filename: `js/${Version}.[name].[hash].js`,
            chunkFilename: `js/${Version}.[name].[hash].js`
        }
    },
    // webpack 链接 API，用于生成和修改 webapck 配置
    // https://github.com/mozilla-neutrino/webpack-chain
    chainWebpack: config => {
        // 因为是多页面，所以取消 chunks，每个页面只对应一个单独的 JS / CSS
        config.optimization.splitChunks({
            cacheGroups: {}
        });
        // 'src/lib' 目录下为外部库文件，不参与 eslint 检测
        config.module.rule("eslint").exclude.end();
        config.entry("main").add("babel-polyfill");
    },

    // 配置高于chainWebpack中关于 css loader 的配置
    css: {
        // 是否开启支持 foo.module.css 样式
        requireModuleExtension: true,

        // 是否使用 css 分离插件 ExtractTextPlugin，采用独立样式文件载入，不采用 <style> 方式内联至 html 文件中
        extract: {
            // 一种方式，每次打包后的css文件名会变更新。
            filename: `css/${Version}.[name].[hash].css`,
            chunkFilename: `css/${Version}.[name].[hash].css`
        },

        // 是否构建样式地图，false 将提高构建速度
        sourceMap: false,

        // css预设器配置项
        loaderOptions: {
            // 给 sass-loader 传递选项
            sass: {
                // @/ 是 src/ 的别名
                // 所以这里假设你有 `src/variables.sass` 这个文件
                // 注意：在 sass-loader v7 中，这个选项名是 "data"
                prependData: `@import "@/static/scss/common.scss";`
            },
            // 默认情况下 `sass` 选项会同时对 `sass` 和 `scss` 语法同时生效
            // 因为 `scss` 语法在内部也是由 sass-loader 处理的
            // 但是在配置 `data` 选项的时候
            // `scss` 语法会要求语句结尾必须有分号，`sass` 则要求必须没有分号
            // 在这种情况下，我们可以使用 `scss` 选项，对 `scss` 语法进行单独配置
            scss: {
                prependData: `@import "@/static/scss/common.scss";`
            }
        }
    },
    devServer: {
        open: true,

        host: "0.0.0.0",

        port: 3001,

        https: false,

        hotOnly: false,

        proxy: {
            // 配置跨域
            "/api": {
                // target: "http://127.0.0.1:8080",
                target: "http://api-test.yunxuebao.com",
                // target: "https://api.cswx.com",
                // target: "http://192.168.1.114:8080",
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    "^/api": "/"
                }
            }
        },
        before: app => {}
    },
    // 构建时开启多进程处理 babel 编译
    parallel: require("os").cpus().length > 1,

    // https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
    pwa: {},

    // 第三方插件配置
    pluginOptions: {}
};
