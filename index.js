if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}


var __dirname = __dirname?__dirname:'/';
/*
var requirejs = require('requirejs');

var requireCfg = {
	
};

requirejs.config({
    //Use node's special variable __dirname to
    //get the directory containing this file.
    //Useful if building a library that will
    //be used in node but does not require the
    //use of node outside
    baseUrl: __dirname,

    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require?require:undefined,
    paths: {
    	FluxData: './lib/mixins'
    }
});*/



define(['./lib/channel.js'], function(Channel) {
	return {
		Channel: Channel
	};
});