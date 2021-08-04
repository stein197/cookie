import fs from "fs";
import gulp from "gulp";
import gulpBabel from "gulp-babel";
import gulpRename from "gulp-rename";
import gulpTypescript from "gulp-typescript";
import gulpUglify from "gulp-uglify";
import webpackStream from "webpack-stream";
import babelConfig from "./babel.config.json";
import tsConfig from "./tsconfig.json";
import webpackConfig from "./webpack.config";

const TSCONFIG_JSON: string = "tsconfig.json";
const TS_PROJECT: gulpTypescript.Project = gulpTypescript.createProject(TSCONFIG_JSON);
const DIR_OUT: string = tsConfig.compilerOptions.outDir;
const DIR_TYPES: string = tsConfig.compilerOptions.declarationDir;
const CWD: string = ".";
const INDEX_JS: string = "index.js";

export default gulp.series(clean, build);

/**
 * Builds entire projects.
 */
export async function build(): Promise<void> {
	const js = TS_PROJECT.src().pipe(TS_PROJECT()).js.pipe(gulp.dest(DIR_OUT)).pipe(gulpBabel(babelConfig));
	js.pipe(gulp.dest(DIR_OUT)).pipe(webpackStream(webpackConfig)).pipe(gulpUglify()).pipe(gulp.dest(DIR_OUT));
	js.pipe(gulpUglify()).pipe(gulpRename(INDEX_JS)).pipe(gulp.dest(CWD));
}

/**
 * Cleans out all directories that was created by `build` task.
 */
export async function clean(): Promise<void> {
	for (const dir of [DIR_OUT, DIR_TYPES]) {
		fs.rmdirSync(dir, {
			recursive: true
		});
	}
	fs.rmSync(INDEX_JS);
}
