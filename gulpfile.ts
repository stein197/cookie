import * as gulp from "gulp";
import * as fs from "fs";
import * as childProcess from "child_process";

// TODO: Switch from CLI to API & piping
const TSCONFIG_JSON = "tsconfig.json";
let tsConfig: any;
try {
	tsConfig = JSON.parse(fs.readFileSync(TSCONFIG_JSON).toString())
} catch (ex) {
	console.log(ex.message);
	process.exit(1);
}

const DIR_OUT: string = tsConfig.compilerOptions.outDir;
const DIR_TYPES: string = tsConfig.compilerOptions.declarationDir;
const NAME: string = "cookie";

export default gulp.series(compile, bundle, esm2cjs, minify, cleanup);

export async function compile(): Promise<void> {
	await exec("npx tsc");
}

export async function bundle(): Promise<void> {
	await exec("npx webpack");
}

export async function esm2cjs(): Promise<void> {
	await exec(`npx babel ${DIR_OUT}/${NAME}.js --out-file index.js`);
}

export async function minify(): Promise<void> {
	await exec("npx uglifyjs index.js --output index.js");
	await exec(`npx uglifyjs ${DIR_OUT}/${NAME}.bundle.js --output ${DIR_OUT}/${NAME}.bundle.min.js`);
}

export async function cleanup(): Promise<void> {
	fs.readdir(DIR_OUT, (err, files) => {
		if (err)
			return err;
		for (let filename of files) {
			if (filename !== `${NAME}.bundle.min.js`)
				fs.unlinkSync(`${DIR_OUT}/${filename}`);
		}
	});
}

export async function clean(): Promise<void> {
	for (let dir of [DIR_OUT, DIR_TYPES]) {
		fs.rmdirSync(dir, {
			recursive: true
		});
	}
	if (fs.existsSync("index.js"))
		fs.unlinkSync("index.js");
}

function exec(command: string): Promise<string> {
	return new Promise((resolve: (result: string) => void, reject: (result: Error) => void) => {
		let child: childProcess.ChildProcess = childProcess.exec(command, (error, stdout) => {
			if (error)
				reject(error);
			else
				resolve(stdout);
		});
		child.stdout.on("data", (chunk) => process.stdout.write(chunk));
		child.stderr.on("data", (chunk) => process.stderr.write(chunk));
	});
}
