;!function(exports, undefined) {
	
	var channel = {
		name: 'filesystem.readfile',
		label: 'Read File',
		params:{
			filename: {
				name: 'filename',
				label: 'File Name',
				type: 'Text'
			}
		},
		outputs:[
			{
				name: 'loaderror',
				label: 'Load Error'
			}
		],
		publish: function(topic, entity){
			var self = this;
			//console.log(entity);
			//we assume that the "value" of entity is the content to write to the file
			var fs = require('fs');
			var path = require('path');
			
			
			var filename = entity.get('filename');
			if(!filename){
				//see if it was supplied as an attribute
				filename = this.get('filename');
				
				if(!filename){
					console.log('No File Name supplied')
					this.emit('loaderror', this.ensureEntity({value: 'No filename found'}));
					return;	
				}
				
			}
			if(!fs.existsSync(filename)){
				console.log('Invalid Filename: '+filename);
				//try loading from the current working directory
				this.emit('loaderror', this.ensureEntity({value:  'Invalid filename: '+filename}));
				return;
			}
			
			fs.readFile(filename, function (err, data) {
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