;!function(exports, undefined) {
	var readfileChannel = require(__dirname+'/readfile.js').Channel;
	var writefileChannel = require(__dirname+'/writefile.js').Channel;
	var appendfileChannel = require(__dirname+'/appendfile.js').Channel;
	var watchfileChannel = require(__dirname+'/WatchFile.js').Channel;
	
	var readdirectoryChannel = require(__dirname+'/readdirectory.js').Channel;
	var createdirectoryChannel = require(__dirname+'/createdirectory.js').Channel;
	
	var channels = {
		name: 'filesystem',
		isChannelList: true,
		readfile: readfileChannel,
		writefile: writefileChannel,
		appendfile: appendfileChannel,
		WatchFile: watchfileChannel,
		readdirectory:readdirectoryChannel,
		createdirectory: createdirectoryChannel
	}
	
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return channels;
		});
	} else {
		exports.Channels = channels;
	}

}(typeof process !== 'undefined' && typeof process.title !== 'undefined' && typeof exports !== 'undefined' ? exports : window);