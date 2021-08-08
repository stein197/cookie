import "ts-mocha";
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
import mocha from "mocha";

const TSCONFIG_JSON: string = "tsconfig.json";
const tsProject: gulpTypescript.Project = gulpTypescript.createProject(TSCONFIG_JSON);
const DIR_OUT: string = tsConfig.compilerOptions.outDir;
const DIR_TYPES: string = tsConfig.compilerOptions.declarationDir;
const CWD: string = ".";
const INDEX_JS: string = "index.js";

export default gulp.series(clean, build, test);

/**
 * Builds entire projects.
 */
export async function build(): Promise<void> {
	const src = tsProject.src().pipe(tsProject());
	const js = src.js.pipe(gulp.dest(DIR_OUT)).pipe(gulpBabel(babelConfig));
	js.pipe(gulp.dest(DIR_OUT)).pipe(webpackStream(webpackConfig)).pipe(gulpUglify()).pipe(gulp.dest(DIR_OUT));
	js.pipe(gulpUglify()).pipe(gulpRename(INDEX_JS)).pipe(gulp.dest(CWD));
	src.pipe(gulp.dest(DIR_TYPES));
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
	if (fs.existsSync(INDEX_JS))
		fs.rmSync(INDEX_JS);
}

/**
 * Runs unit tests
 */
export async function test(): Promise<void> {
	const m: mocha = new mocha();
	m.addFile("test/cookie.ts");
	m.run(failures => process.on('exit', () => process.exit(failures)));
}
