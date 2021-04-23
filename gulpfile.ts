import * as gulp from "gulp";
import * as gulpTypescript from "gulp-typescript";
import * as fs from "fs";

const OUT_DIR: string = "out";

export default gulp.series(compile);

export async function compile(): Promise<void> {
	let project: gulpTypescript.Project = gulpTypescript.createProject("tsconfig.json");
	project.src().pipe(project()).js.pipe(gulp.dest(OUT_DIR));
}

export async function clean(): Promise<void> {
	for (let dir of [OUT_DIR, "types"]) {
		fs.rmdirSync(dir, {
			recursive: true
		});
	}
}
