	if (typeof define !== 'function') {
	    var define = require('amdefine')(module);
	}
	
	define(['fs'], function(fs){
		var mixin = {
			init: function(cfg){
				var self = this;
				if(cfg){
					for(var key in cfg){
						self.set(key, cfg[key]);
					}
				}
			},
			publish: function(topic, data){
				var self = this;
				var filename = self.get('filename');
				
				if(filename){
					switch(topic){
						case 'file.read':
							fs.exists(filename, function(exists){
								if(exists){
									fs.readFile(filename, function(err, data){
										if(!err){
											self.emit('read', self);
										}
									});		
								}
							});
							break;
						case 'file.write':
							fs.writeFile(filename, data, function(err){
								if(!err){
									self.emit('file.write', self);
								}
							});
							break;
						case 'file.append':
							fs.appendFile(filename, data, function(err){
								if(!err){
									self.emit('file.append', self);
								}
							});
							break;
					}	
				}
			}
		}
		
		return mixin;
	});
	