const path = require('path');
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
	  entry: {
		  main: path.join(__dirname,'/src/index.js')
	  },
	  devtool: 'source-map',
	  output: {
		path: path.join(__dirname, '/dist'),
        filename: "[name].bundle.js",
        publicPath: '/'
      },
	  module: {
	    rules: [
	      {
	        test: /\.(js|jsx)$/,
	        exclude: /node_modules/,
	        use: {
	          loader: "babel-loader"
	        }
	      },
	      {
	          test: /\.css$/i,
	          use: [MiniCssExtractPlugin.loader, 'css-loader'],
	      },
	      {
	          test: /\.(png|jpg|gif|svg)$/,
	          use: {
		          loader: 'file-loader'
		      }
	        },
	        {
	          test: /\.(woff|woff2|ttf|svg|eot)$/,
	          use: {
		          loader: 'url-loader'
		      }
	        },
	    ]
	  },
	  devServer: {
			disableHostCheck: true,
			historyApiFallback: true,
			//writeToDisk: true,
	  },
	  plugins: [
	    new HtmlWebPackPlugin({
	    	template: path.join(__dirname,'/public/index.html'), 
	    	favicon: path.join(__dirname,'/public/favicon.ico')
	    }),
	    new MiniCssExtractPlugin({
	        filename: '[name].css',
	    }),
	    new webpack.ProvidePlugin({
	           $: "jquery",
	           jQuery: "jquery",
	           "window.jQuery": "jquery"
	    }),
	    new webpack.DefinePlugin({
	    	'process.env':{
	    	    'REACT_APP_SECRET_KEY': JSON.stringify('secreat-key-12345'),
	    	    'REACT_APP_PROD_PER_PAGE_COUNT': JSON.stringify('9')
	    	}
	    })
	  ]
};