;!function(exports, undefined) {
	
	var channel = {
		name: 'filesystem.createdirectory',
		label: 'Create Directory',
		params:{
			path: {
				name: 'path',
				label: 'Directory Path',
				type: 'Text'
			},
			recursive: {
				name: 'recursive',
				label: 'Create Recursively',
				type: 'Boolean',
				defaultValue: true
			},
			mode: {
				name: 'mode',
				label: 'Mode',
				type: 'Text',
				defaultValue: '0777'
			}
		},
		outputs:[
			{
				name: 'createerror',
				label: 'Creation Error'
			}
		],
		publish: function(topic, entity){
			var self = this;
			//console.log(entity);
			//we assume that the "value" of entity is the content to write to the file
			var fs = require('fs');
			var path = require('path');
			
			fs.mkdirParent = function(dirPath, mode, callback) {
			  //Call the standard fs.mkdir
			  fs.mkdir(dirPath, mode, function(error) {
			    //When it fail in this way, do the custom steps
			    if (error && error.errno === 34) {
			      //Create all the parents recursively
			      fs.mkdirParent(path.dirname(dirPath), mode, callback);
			      //And then the directory
			      fs.mkdirParent(dirPath, mode, callback);
			    }
			    //Manually run the callback since we used our own callback to do all these
			    callback && callback(error);
			  });
			};
			
			var pathName = entity.get('path');
			
			if(!pathName){
				//see if it was supplied as an attribute
				pathName = self.get('path');
				
				if(!pathName){
					console.log('No Path Name supplied')
					self.emit('createerror', self.ensureEntity({value: 'path not supplied'}));
					return;	
				}
				
			}
			
			var mode = entity.get('mode');
			
			if(mode===undefined){
				mode = self.get('mode');
			}
			
			var recursive = entity.get('recursive');
			
			if(recursive===undefined){
				recursive = self.get('recursive');
			}
			
			if(fs.existsSync(pathName)){
				//path exists, fire the output
				self.emit('entity', self.ensureEntity({value: pathName}));
				return;
			}else{
				if(recursive===true || recursive=='true'){
					//ensure the parent structure of the folder
					fs.mkdirParent(pathName, mode, function(err){
						if(err){
							console.log(err);
							self.emit('createerror', self.ensureEntity({value: err}));
						}else{
							self.emit('entity', self.ensureEntity({value: pathName}));
						}
					});
				}else{ //just try making the directory, a createerror will be emitted if the parent directory structure does not exist
					fs.mkdir(pathName, mode, function(err){
						if(err){
							console.log(err);
							self.emit('createerror', self.ensureEntity({value: err}));
						}else{
							self.emit('entity', self.ensureEntity({value: pathName}));
						}
					});	
				}
			}
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