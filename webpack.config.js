import path from "path";
import url from "url";

const CWD = path.dirname(url.fileURLToPath(import.meta.url));
const DIR_OUT = "out";
const NAME = "cookie";

export default {
	entry: `./${DIR_OUT}/${NAME}.js`,
	output: {
		filename: `${NAME}.bundle.js`,
		path: path.resolve(CWD, DIR_OUT),
		library: {
			name: NAME,
			type: "var"
		}
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
			DIR_OUT,
			"node_modules"
		]
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: "babel-loader"
				},
				resolve: {
					fullySpecified: false
				}
			}
		]
	}
};
