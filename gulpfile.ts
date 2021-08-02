import * as gulp from "gulp";
import * as fs from "fs";
import * as gulpTypescript from "gulp-typescript";

const TSCONFIG_JSON: string = "tsconfig.json";
let tsConfig: any;

try {
	tsConfig = JSON.parse(fs.readFileSync(TSCONFIG_JSON).toString())
} catch (ex) {
	console.log(ex.message);
	process.exit(1);
}

const TS_PROJECT: gulpTypescript.Project = gulpTypescript.createProject(TSCONFIG_JSON);
const DIR_OUT: string = tsConfig.compilerOptions.outDir;

export default compile;

export async function compile(): Promise<NodeJS.ReadWriteStream> {
	return TS_PROJECT.src().pipe(TS_PROJECT()).js.pipe(gulp.dest(DIR_OUT));
}
