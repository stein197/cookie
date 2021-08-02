const path = require("path");

const DIR_OUT = "out";
const NAME = "cookie";

module.exports = {
	output: {
		filename: `${NAME}.js`,
		path: path.resolve(__dirname, DIR_OUT),
		library: NAME
	}
};
