import * as Gulp from "gulp";
import * as GulpTypescript from "gulp-typescript";

const project: GulpTypescript.Project = GulpTypescript.createProject("tsconfig.json");
const outDir: string = "out";

export default Gulp.series(compile);

export async function compile(): Promise<void> {
	project.src().pipe(project()).js.pipe(Gulp.dest(outDir));
}
