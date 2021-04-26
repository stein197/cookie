import * as gulp from "gulp";
import * as fs from "fs";
import { exec } from "child_process";

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

export default gulp.series(compile, bundle);

export async function compile(): Promise<void> {
	exec("npx tsc");
}

export async function bundle(): Promise<void> {
	exec("npx webpack");
}

export async function clean(): Promise<void> {
	for (let dir of [DIR_OUT, DIR_TYPES]) {
		fs.rmdirSync(dir, {
			recursive: true
		});
	}
}
