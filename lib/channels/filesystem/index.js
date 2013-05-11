;!function(exports, undefined) {
	var readfileChannel = require(__dirname+'/readfile.js').Channel;
	var readdirectoryChannel = require(__dirname+'/readdirectory.js').Channel;
	var channels = {
		name: 'filesystem',
		isChannelList: true,
		readfile: readfileChannel,
		readdirectory:readdirectoryChannel
	}
	
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return channels;
		});
	} else {
		exports.Channels = channels;
	}

}(typeof process !== 'undefined' && typeof process.title !== 'undefined' && typeof exports !== 'undefined' ? exports : window);