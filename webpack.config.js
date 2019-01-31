const path = require("path");
const webpack = require("webpack");
const authFile = require("./auth.json");

module.exports = (env, argv) => {
    // Check whether this is prod build or not flag
    const isProd = Boolean(argv.mode === "production" || process.env.NODE_ENV === "production");
    return {
        entry: "./src/main.js",
        output: {
            path: path.join(__dirname, "/server/bundle"),
            filename: "index_bundle.js"
        },
        devServer: {
            contentBase: "./src",
            inline: true,
            port: 8080
        },
        module: {
            rules: [
                {
                    test: /\.(jsx|js)$/,
                    exclude: /node_modules/,
                    loader: "babel-loader"
                },
                {
                    test: /\.css$/,
                    // Use only one rule exclusively.
                    oneOf: [
                        // Usage: import './Root.css?raw'; then the css file will be processed as pure css, no css module applied.
                        // <div className='w3_red w3_large' />
                        {
                            resourceQuery: /raw/,
                            use: ["style-loader", { loader: "css-loader" }]
                        },
                        // Usage: import classes from './Root.css'; and the css file will be processed by CSS Modules.
                        // <div className={w3_red} />
                        {
                            use: [
                                "style-loader",
                                {
                                    loader: "css-loader",
                                    options: {
                                        // Enable CSS modules.
                                        modules: true,
                                        // Make CSS classes get unique names so that they don't
                                        // overwrite each others even using the same class in multiple JS files.
                                        // [locol] means the component name which using the class.
                                        localIdentName: "[name]__[local]___[hash:base64:5]"
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                __SERVER_BASE_URL__: JSON.stringify(isProd ? authFile.__HOSTING_SERVER__ : authFile.__LOCAL_SERVER__)
            })
        ]
    };
};
