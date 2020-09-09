const path = require("path");

module.exports = {
    // enntry file
    entry: "./src/index.js",
    // 컴파일 + 번들링된 js 파일이 저장될 경로와 이름 지정
    output: {
        path: path.resolve(__dirname, "dist/js"),
        filename: "bundle.js",
        publicPath: "/dist/js",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
            },
        ],
    },
    devtool: "source-map",
    // https://webpack.js.org/concepts/mode/#mode-development
    mode: "development",
};
