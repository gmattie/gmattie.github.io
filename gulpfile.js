//Dependencies
const autoPrefixer = require("autoprefixer");
const browserSync = require("browser-sync").create();
const gulp = require("gulp");
const gulpUtil = require("gulp-util");
const minCSS = require("gulp-clean-css");
const minHTML = require("gulp-htmlmin");
const postCSS = require("gulp-postcss");
const sass = require("gulp-sass");
const sourceMaps = require("gulp-sourcemaps");
const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const webpackUglify = require("uglifyjs-webpack-plugin");

//Config
const config = {
    
    DEVELOPMENT: gulpUtil.env.development,
    PRODUCTION: gulpUtil.env.production
};

//Tasks
const tasks = {

    TRANSPILE_JS: "transpile-js",
    TRANSPILE_SASS: "transpile-sass",
    MINIFY_HTML: "minify-html",
    MINIFY_DATA: "minify-data"
};

//Paths
const PATHS_RESOURCES = "./resources/";

const paths = {

    ROOT: `${PATHS_RESOURCES}`,
    BUILD: `${PATHS_RESOURCES}build/`,
    SOURCE: `${PATHS_RESOURCES}source/`
};

//Folders
const folders = {

    JS: "js/",
    CSS: "css/",
    SASS: "sass/",
    DATA: "data/"
};

//Files
const files = {

    JS: "main.js",
    CSS: "main.css",
    SASS: "main.scss",
    HTML: "index.html",
    DATA: "contentMap.xml"
};

//Task Transpile JavaScript
gulp.task(tasks.TRANSPILE_JS, () => {

    gulp.src(`${paths.SOURCE}${folders.JS}${files.JS}`)
        .pipe(
            webpackStream({
                entry: [
                    "core-js/fn/symbol/iterator.js", //Polyfill for Microsoft Edge v40
                    "./resources/source/js/main.js"
                ],
                module: {
                    rules: [{
                        test: /\.js$/,
                        loader: "babel-loader",
                        exclude: /(node_modules)/,
                        options: {
                            presets: [["env", {"modules": false}]]
                        }
                    }]
                },
                plugins: (config.PRODUCTION) ? [new webpackUglify({sourceMap: (config.DEVELOPMENT)})] : [],
                output: {filename: `${files.JS}`},
                devtool: (config.DEVELOPMENT) ? "inline-source-map" : ""
            }, webpack)
            .on("error", (error) => gulpUtil.log(error)))
        .pipe(gulp.dest(`${paths.BUILD}${folders.JS}`))
        .pipe((config.DEVELOPMENT) ? browserSync.stream() : gulpUtil.noop());
});

//Task Transpile Sass
gulp.task(tasks.TRANSPILE_SASS, () => {

    gulp.src(`${paths.SOURCE}${folders.SASS}${files.SASS}`)
        .pipe((config.DEVELOPMENT) ? sourceMaps.init() : gulpUtil.noop())
        .pipe(
            sass({
                outFile: `${files.CSS}`
            })
            .on("error", sass.logError))
        .pipe(
            postCSS([
                autoPrefixer()
            ]))
        .pipe((config.PRODUCTION) ? minCSS() : gulpUtil.noop())
        .pipe((config.DEVELOPMENT) ? sourceMaps.write() : gulpUtil.noop())
        .pipe(gulp.dest(`${paths.BUILD}${folders.CSS}`))
        .pipe((config.DEVELOPMENT) ? browserSync.stream() : gulpUtil.noop());
});

//Task Minify HTML
gulp.task(tasks.MINIFY_HTML, () => {

    gulp.src(`${paths.SOURCE}${files.HTML}`)
        .pipe(minHTML({collapseWhitespace: true, removeComments: true, keepClosingSlash: true}))
        .pipe(gulp.dest("./"))
        .pipe((config.DEVELOPMENT) ? browserSync.stream() : gulpUtil.noop());
});

//Task Minify Data
gulp.task(tasks.MINIFY_DATA, () => {

    gulp.src(`${paths.SOURCE}${folders.DATA}${files.DATA}`)
        .pipe(minHTML({collapseWhitespace: true, removeComments: true, keepClosingSlash: true}))
        .pipe(gulp.dest(`${paths.BUILD}${folders.DATA}`))
        .pipe((config.DEVELOPMENT) ? browserSync.stream() : gulpUtil.noop());
});

//Task Default
gulp.task("default", [tasks.TRANSPILE_JS, tasks.TRANSPILE_SASS, tasks.MINIFY_HTML, tasks.MINIFY_DATA], () => {

    if (config.DEVELOPMENT) {
        
        browserSync.init({

            server: {

                baseDir: "./",
                index: `${files.HTML}`
            }
        });

        gulp.watch(`${paths.SOURCE}${folders.JS}**/*.js`, [tasks.TRANSPILE_JS]);
        gulp.watch(`${paths.SOURCE}${folders.SASS}**/*.scss`, [tasks.TRANSPILE_SASS]);
        gulp.watch(`${paths.SOURCE}${files.HTML}`, [tasks.MINIFY_HTML]);
        gulp.watch(`${paths.SOURCE}${folders.DATA}${files.DATA}`, [tasks.MINIFY_DATA]);
    }
});