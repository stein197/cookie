import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const outDir = "out";

export default {
	entry: `./${outDir}/cookie.js`,
	output: {
		filename: "[name].bundle.js",
		path: path.resolve(__dirname, outDir)
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
			outDir,
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

