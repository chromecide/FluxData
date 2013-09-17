if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['fs'], function(fs){
	var mixin = {
		//called when first mixing in the functionality
		init: function(cfg, callback){

			var self = this;
			var errs = false;
			
			for(var key in cfg){
				if(key==='fd'){
					self.fd = fd;
				}else{
					self.set(key, cfg[key]);
				}
			}

			fs.stat(self.get('path'), function(err, stats){
                for(var key in stats){
					if((typeof stats[key])==='function'){
						self.set(key, stats[key]());
					}else{
						self.set(key, stats[key]);
					}
				}


                self.emit('file.ready', cfg);

                if(callback){
                    callback(errs, self);
                }
            });
		},
		//called when something is published to this channel
		publish: function(topic, data){
			var self = this;
			switch(topic){
				case 'file.open':
					self.fsopen(data);
					break;
				case 'file.read':

					self.fsread(data);
					break;
				case 'file.copy':
					self.fscopy(self.get('path'), data.targetPath);
					break;
				case 'file.watch':
					self.fswatch(data);
					break;
			}
		},
		fsopen: function(data, callback){
			var self = this;
			fs.open(data.path || self.get('path'), function(err, fd){
				if(!err){
					self.fd = fd;
					self.emit('file.open', {
						fd: fd
					});
				}else{
					self.emit('file.open_error', {
						error: err
					});
					errs.push(err);
				}

				if(callback){
					callback(errs, self);
				}
			});
		},
		fsread: function(data, callback){
			var self = this;

			var errs = [];
			
			if(self.fd || (data.start || data.bytes)){
				if(!self.fd){
					self.fsopen({}, function(){
						self.fsread(data, callback);
					});
					return;
				}

				if(data.start || data.bytes){
					//TODO: fs.read
				}
			}else{
				fs.readFile(self.get('path'), function(err, data){
					if(!err){
						self.set('data', data.toString());
					}
				});
			}
			
			if(callback){
				if(errs.length===0){
					errs = false;
				}
			
				callback(errs, data);
			}
		},
		fscopy: function (sourcePath, targetPath, callback){
			var self = this;
			
			var source = fs.createReadStream(sourcePath);
			source.on('error', function(err){
				console.log(err);
				if(callback){
					callback(err, [sourcePath, targetPath]);
				}
			});

			var target = fs.createWriteStream(targetPath);
			target.on('error', function(){
				if(callback){
					callback(err, [sourcePath, targetPath]);
				}
			});

			target.on('close', function(){
				var newFile = new self.constructor({
					mixins: [
						{
							type: 'FluxData/filesystem/file',
							path: targetPath
						}
					]
				});

				self.emit('file.copied', newFile);

				if(callback){
					callback(false, newFile);
				}
			});

			source.pipe(target);
		},
		fswatch: function(){
			var self = this;
			fs.watchFile(self.get('path'), function(curr, prev){
				if(curr.atime!=prev.atime){
					self.emit('file.accessed', curr);
				}

				if(curr.mtime!=prev.mtime){
					self.emit('file.modified', curr);
				}
			});
		}
	};
	
	return mixin;
});