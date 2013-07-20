;!function(exports, undefined) {
	
	var channel = {
		name: 'filesystem.appendfile',
		label: 'Append File',
		params:{
			filename: {
				name: 'filename',
				label: 'File Name',
				type: 'Text'
			},
			value: {
				name: 'value',
				label: 'Value'
			}
		},
		outputs:[
			{
				name: 'appenderror',
				label: 'Write Error'
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
					this.emit('appenderror', this.ensureEntity({value: 'No filename found'}));
					return;	
				}
				
			}
			var fileContent = entity.get('value');
			if(!fileContent){
				fileContent = self.get('value');
			}
			
			/*
			if(fs.existsSync(filename)){
				console.log('Invalid Filename: '+filename);
				//try loading from the current working directory
				this.emit('appenderror', this.ensureEntity({value:  'Invalid filename: '+filename}));
				return;
			}*/
			
			fs.appendFile(filename, fileContent, function (err, data) {
			  if (err){
			  	console.log(err);
			  	self.emit('appenderror', self.ensureEntity({value: err}));
			  }else{
			  	self.emit('entity', self.ensureEntity({filename: filename, value: fileContent}));
			  }
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