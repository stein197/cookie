import path from "path";
import url from "url";

const DIR_NAME = path.dirname(url.fileURLToPath(import.meta.url));
const OUT_DIR = "out";

export default {
	entry: `./${OUT_DIR}/cookie.js`,
	output: {
		filename: "[name].bundle.js",
		path: path.resolve(DIR_NAME, OUT_DIR),
		library: "cookie"
	},
	mode: "production",
	optimization: {
		minimize: false
	},
	resolve: {
		extensions: [
			".js"
		],
		modules: [
			OUT_DIR,
			"node_modules"
		]
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				resolve: {
					fullySpecified: false
				}
			}
		]
	}
};
