import gulp from "gulp";
import gulpTypescript from "gulp-typescript";
import gulpUglify from "gulp-uglify";
import webpackStream from "webpack-stream";
import webpackConfig from "./webpack.config.js";
import tsConfig from "./tsconfig.json";

const TSCONFIG_JSON: string = "tsconfig.json";
const TS_PROJECT: gulpTypescript.Project = gulpTypescript.createProject(TSCONFIG_JSON);
const DIR_OUT: string = tsConfig.compilerOptions.outDir;

export default build;

export async function build(): Promise<NodeJS.ReadWriteStream> {
	return TS_PROJECT.src().pipe(TS_PROJECT()).js.pipe(gulpUglify()).pipe(webpackStream(webpackConfig)).pipe(gulp.dest(DIR_OUT));
}
