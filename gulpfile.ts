import * as gulp from "gulp";
import * as gulpTypescript from "gulp-typescript";

const PROJECT: gulpTypescript.Project = gulpTypescript.createProject("tsconfig.json");
const OUT_DIR: string = "out";

export default gulp.series(compile);

export async function compile(): Promise<void> {
	PROJECT.src().pipe(PROJECT()).js.pipe(gulp.dest(OUT_DIR));
}
