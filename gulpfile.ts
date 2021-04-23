import * as gulp from "gulp";
import * as gulpTypescript from "gulp-typescript";
import * as fs from "fs";

const TSCONFIG_JSON = "tsconfig.json";
let tsConfig: any;
try {
	tsConfig = JSON.parse(fs.readFileSync(TSCONFIG_JSON).toString())
} catch (ex) {
	console.log(ex.message);
	process.exit();
}

const DIR_OUT: string = tsConfig.compilerOptions.outDir;
const DIR_TYPES: string = tsConfig.compilerOptions.declarationDir;

export default gulp.series(compile);

export async function compile(): Promise<void> {
	let project = gulpTypescript.createProject(TSCONFIG_JSON);
	let result = project.src().pipe(project());
	result.pipe(gulp.dest(DIR_TYPES));
	result.js.pipe(gulp.dest(DIR_OUT));
}

export async function clean(): Promise<void> {
	for (let dir of [DIR_OUT, DIR_TYPES]) {
		fs.rmdirSync(dir, {
			recursive: true
		});
	}
}
