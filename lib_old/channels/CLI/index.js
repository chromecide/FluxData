;!function(exports, undefined) {
	var runChannel = require(__dirname+'/run.js').Channel;
	var getArgsChannel = require(__dirname+'/getArgs.js').Channel;
	var channels = {
		name: 'CLI',
		isChannelList: true,
		Run: runChannel,
		getArgs: getArgsChannel
	}
	
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return channels;
		});
	} else {
		exports.Channels = channels;
	}

}(typeof process !== 'undefined' && typeof process.title !== 'undefined' && typeof exports !== 'undefined' ? exports : window);