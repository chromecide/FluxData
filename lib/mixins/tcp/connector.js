	if (typeof define !== 'function') {
	    var define = require('amdefine')(module);
	}
	
	define(['net'], function(net){
		var mixin = {
			TCPConnector: {
				configureListeners: function(socket){
					var self = this;
					self.TCPConnector.server.on('connection', function(socket){
						//create a channel from the connection and publish it to the router
						var socketChannel = new self.constructor({
							mixins:[
								{
									type: 'FluxData/tcp/socket',
									socket: socket
								}
							]
						});
						
						socket.on('close', function(){
							delete self.Router.endPoints[socketChannel.get('id')];	
						});
						
						self.publish('router.channel', socketChannel);
					});	
				}
			},
			init: function(cfg, callback){
				var self = this;
				
				self.requireMixin('FluxData/router/index');
						
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
				
				if(callback){
					callback(self);
				}
			}
		};
		
		return mixin;	
	});
	