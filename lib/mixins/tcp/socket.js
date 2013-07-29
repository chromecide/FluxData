	if (typeof define !== 'function') {
	    var define = require('amdefine')(module);
	}
	
	define(['net'], function(net){
		var mixin = {
			TCPSocket: {
				socket: undefined,
				configureListeners: function(){
					
					var self = this;
					var socket = self.TCPSocket.socket;
					
					socket.on('data', function(data){
						self.emit('data', data);
					});
					
					socket.on('end', function(data){
						self.emit('end', data);
					});
				}
			},
			init: function(cfg){
				var self = this;
				if(cfg){
					if(cfg.socket){
						
						self.TCPSocket.socket = cfg.socket;
						self.TCPSocket.configureListeners.call(self);
					}else{
						
						for(var key in cfg){
							self.set(key, cfg[key]);
						}
						
						var host = self.get('TCPSocket.host');
						var port = self.get('TCPSocket.port');
						
						//if we have a port and configured
						if(port){
							var socket = net.connect(port, host, function(){
								
								self.TCPSocket.socket = socket;
								self.TCPSocket.configureListeners.call(self);
							});
						}
					}
				}
			},
			publish: function(topic, message){
				var self = this;
				var socket = self.TCPSocket.socket;
				if(socket && message){
					socket.write(message.toString());
				}else{
					console.log(arguments);
				}
			}
		}
		
		return mixin;
	});
	