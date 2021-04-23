import * as gulp from "gulp";
import * as gulpTypescript from "gulp-typescript";
import * as fs from "fs";

const DIR_OUT: string = "out";
const DIR_TYPES: string = "types";

export default gulp.series(compile);

export async function compile(): Promise<void> {
	let project = gulpTypescript.createProject("tsconfig.json");
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
