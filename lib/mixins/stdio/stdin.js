	if (typeof define !== 'function') {
	    var define = require('amdefine')(module);
	}
	
	define({
		init: function(cfg, callback){
			var self = this;
			
			for(var key in cfg){
				self.set(key, cfg[key]);
			}

			process.stdin.resume();
			process.stdin.setEncoding(self.get('encoding')|| 'utf8');
			
			process.stdin.on('data', function(data) {
				self.emit('data', {
					data: data
				});
			});
			
			process.stdin.on('end', function() {
				process.stdout.write('end');
				self.emit('end', {});
			});

			if(callback){
				callback(cfg);
			}
		}
	});
	