	if (typeof define !== 'function') {
	    var define = require('amdefine')(module);
	}
	
	define(['net'], function(net){
		var mixin = {
			init: function(cfg){
				var self = this;
				
				self.requireMixin('mixins/tcp/socket');
				
				self.TCPSocket.configureListeners = function(){
					var self = this;
					var socket = self.TCPSocket.socket;
					
					var chunk = '';
					socket.on('data', function(data){
						//keep laoding data until we recieve the stop char
						chunk += data.toString(); // Add string on the end of the variable 'chunk'
					    d_index = chunk.indexOf('\r'); // Find the delimiter
					
					    // While loop to keep going until no delimiter can be found
					    while (d_index > -1) {         
					        try {
					            string = chunk.substring(0,d_index); // Create string up until the delimiter
					            json = JSON.parse(string); // Parse the current string
					            self.emit(json.topic, json.data); // Function that does something with the current chunk of valid json.        
					        }catch(e){
					        }
					        
					        chunk = chunk.substring(d_index+1); // Cuts off the processed chunk
					        d_index = chunk.indexOf('\r'); // Find the new delimiter
					    }  
					});
					
					socket.on('end', function(data){
						self.emit('end', data);
					});
				}
				
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
				
				if(self.TCPSocket.socket){
					//move the socket to another property, so the default socket publish function doesn't send a copy of the data as well
					self.TCPSocket.managedSocket = self.TCPSocket.socket;
					delete self.TCPSocket.socket;
				}
			},
			publish: function(topic, data){
				var self = this;
				var message = {
					topic: topic,
					data: data?data:undefined
				}
				
				var messageString = JSON.stringify(message)+'\r';
				
				if(messageString && self.TCPSocket.managedSocket){
					self.TCPSocket.managedSocket.write(messageString);
				}
			}
		}
		
		return mixin;	
	});
	