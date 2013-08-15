;!function(exports, undefined) {
	var fs = require('fs');
	
	var channel = {
		name: 'filesystem.WatchFile',
		label: 'Watch File',
		params:{
			filename:{
				name:'filename',
				label: 'File Name',
				type: 'Text'
			}
		},
		outputs: [
			{
				name: 'accessed',
				label: 'Accessed'
			},
			{
				name: 'modified',
				label: 'Modified'
			},
			{
				name: 'watcherror',
				label: 'Watch Error'
			}
		],
		publish: function(topic, entity){
			var self = this;
			
			var filename = entity.get('filename');
			if(!filename){
				filename = self.get('filename');
			}
			
			if(!filename){
				self.emit('watcherror', self.ensureEntity({value: 'No filename supplied'}));
			}else{
				
				if(!fs.existsSync(filename)){
					self.emit('watcherror', self.ensureEntity({value: 'File not found'}));
				}else{
					doFileWatch(filename, function(filename, curr, prev){
						console.log(arguments);
						if(curr.atime!=prev.atime){ //accessed
							self.emit('accessed', self.ensureEntity({filename: filename, time: curr.atime}));
						}
						
						if(curr.mtime!=prev.mtime){ //modified
							self.emit('modified', self.ensureEntity({filename: filename, time: curr.mtime}));
						}
					});
				}
			}
		}
	}
	
	function doFileWatch(filename, callback){
		fs.watchFile(filename, function(curr, prev){
			console.log(arguments);
			callback(filename, curr, prev);
		});
	}
	
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return channel;
		});
	} else {
		exports.Channel = channel;
	}

}(typeof process !== 'undefined' && typeof process.title !== 'undefined' && typeof exports !== 'undefined' ? exports : window);