;!function(exports, undefined) {
	var serverChannel = require(__dirname+'/server.js').Channel;
	var writeResponseChannel = require(__dirname+'/writeresponse.js').Channel;
	var getFileChannel = require(__dirname+'/get.js').Channel;
	
	var channels = {
		name: 'http',
		isChannelList: true,
		server: serverChannel,
		writeresponse: writeResponseChannel,
		get: getFileChannel
	}
	
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return channels;
		});
	} else {
		exports.Channels = channels;
	}

}(typeof process !== 'undefined' && typeof process.title !== 'undefined' && typeof exports !== 'undefined' ? exports : window);