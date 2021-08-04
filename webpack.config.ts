import path from "path";

const DIR_OUT: string = "out";
const NAME: string = "cookie";

export default {
	output: {
		filename: `${NAME}.js`,
		path: path.resolve(__dirname, DIR_OUT),
		library: NAME
	}
};
