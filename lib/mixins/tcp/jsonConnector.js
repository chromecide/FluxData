	if (typeof define !== 'function') {
	    var define = require('amdefine')(module);
	}
	
	define(['net'], function(net){
		var mixin = {
			init: function(cfg){
				var self = this;
				
				self.requireMixin('FluxData/tcp/connector');
				
				self.TCPConnector.configureListeners = function(){
					self.TCPConnector.server.on('connection', function(socket){
						//create a channel from the connection and publish it to the router
						//send the id of this node to the remote socket and wait for a response
						var socketChannel = new self.constructor({
							mixins:[
								{
									type: 'FluxData/tcp/jsonSocket',
									socket: socket
								}
							]
						});
						
						socket.on('close', function(){
							delete self.Router.endPoints[socketChannel.get('id')];
						});
						
						self.publish('router.channel', socketChannel);
					});	
				};
				
				if(cfg){
					if(cfg.server){
						self.TCPConnector.server = cfg.server;
					}else{
						for(var key in cfg){
							self.set(key, cfg[key]);
						}
						
						var port = self.get('TCPConnector.port');
						var host = self.get('TCPConnector.host');
						
						self.TCPConnector.server = net.createServer({allowHalfOpen: false}).listen(port, host);
					}
				}
				
				if(self.TCPConnector.server){
					self.TCPConnector.configureListeners.call(self);
				}
			}
		};
		
		return mixin;	
	});
	