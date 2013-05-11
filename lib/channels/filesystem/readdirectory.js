;!function(exports, undefined) {
	
	var channel = {
		name: 'filesystem.readdirectory',
		label: 'Read Directory',
		params:{
			path: {
				name: 'path',
				label: 'Directory Path',
				type: 'Text'
			}
		},
		outputs:[
			{
				name: 'loaderror',
				label: 'Load Error'
			}
		],
		publish: function(entity){
			var self = this;
			//console.log(entity);
			//we assume that the "value" of entity is the content to write to the file
			var fs = require('fs');
			var path = require('path');
			
			var path = entity.get('path');
			if(!path){
				//see if it was supplied as an attribute
				filename = this.get('path');
				
				if(!path){
					console.log('No Path Name supplied')
					this.emit('loaderror', this.ensureEntity({value: 'No path found'}));
					return;	
				}
				
			}
			if(!fs.existsSync(path)){
				console.log('Invalid Path: '+filename);
				this.emit('loaderror', this.ensureEntity({value:  'Invalid path: '+filename}));
				return;
			}
			
			fs.readdir(path, function (err, data) {
			  if (err){
			  	console.log(err);
			  	self.emit('loaderror', self.ensureEntity({value: err}));
			  }
			  console.log('***********************');
			  console.log(filename);
			  console.log(data);
			  console.log('***********************');
			  self.emit('entity', self.ensureEntity({value: data}));
			});
			
		}
	}
	
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return channel;
		});
	} else {
		exports.Channel = channel;
	}

}(typeof process !== 'undefined' && typeof process.title !== 'undefined' && typeof exports !== 'undefined' ? exports : window);