	if (typeof define !== 'function') {
	    var define = require('amdefine')(module);
	}
	
	define(['net'], function(net){
		var mixin = {
			init: function(cfg){
				var self = this;
				if(cfg){
					for(var key in cfg){
						self.set(key, cfg[key]);
					}
				}
				
				var port = self.get('mesh.port');
				
				if(port){
					console.log('CONNECTING');
					//try and connect first
					var client = net.connect({port: port}, function() { //'connect' listener
					  	console.log('client connected');
					  	client.write('world!\r\n');
					});
					
					client.on('error', function(){
						net.createServer(function(con){
							
						}).listen(port);
					});
					
					client.on('data', function(data) {
					  console.log(data.toString());
					  client.end();
					});
					
					client.on('end', function() {
					  console.log('client disconnected');
					});
				}
			}	
		};
		
		return mixin;
	});
	