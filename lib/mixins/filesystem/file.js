if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['fs', 'path'], function(fs, path){
	var mixin = {
		name: 'FluxData/filesystem/file',
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

			if(!self.get('interval')){
                self.set('interval', 5007);
            }
            
			fs.stat(self.get('path'), function(err, stats){
				if(err){
					self.emit('error', err);
					return;
				}

				self.set('filename', path.basename(self.get('path')));
				self.set('ext', path.extname(self.get('path')));

                for(var key in stats){
					if((typeof stats[key])==='function'){
						self.set(key, stats[key]());
					}else{
						self.set(key, stats[key]);
					}
				}

				if(self.get('monitor')!==false){
					self.fswatch.call(self);
				}

                self.emit('file.ready', cfg);

                if(callback){
                    callback(errs, self);
                }
            });
		},
		//called when something is published to this channel
		publish: function(topic, data){

		},
		fswatch: function(){
			var self = this;
			fs.watchFile(self.get('path'), {
				interval: self.get('interval')
			}, function(curr, prev){
				if(curr.atime!=prev.atime){
					self.emit('accessed', curr);
				}

				if(curr.mtime!=prev.mtime){
					fs.exists(self.get('path'), function(bExists){
						if(bExists){
							self.emit('modified', curr);
						}else{
							self.emit('deleted', curr);
						}
					});
				}
			});
		}
	};
	
	return mixin;
});