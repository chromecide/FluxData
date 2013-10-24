	if (typeof define !== 'function') {
	    var define = require('amdefine')(module);
	}
	/**
	 * ## TCP Server Mixin
	 *```
	 * var FluxData = require('FluxData');
	 *
	 * var tcpServer = new FluxData.Channel({
	 *   mixins:[
	 *     {
	 *       type: 'FluxData/tcp/Server',
	 *       port: 9000
	 *     }
	 *   ]
	 * });
	 *
	 * tcpServer.on('socket.ready', function(data){
	 * 	//process request here
	 * });
	 * ```
	 * @class FluxData.tcp.server
	 * @extensionfor Channel
	 * @requires net
	 * @uses  FluxData.http.request
	 */
	
	/**
	 * @attribute host
	 */
	
	/**
	 * @attribute port
	 */
	define(['net'], function(net){
		var mixin = {
			TCPServer: {
				configureListeners: function(socket){
					var self = this;
					self.TCPServer.server.on('connection', function(socket){
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
						
						//self.publish('router.channel', socketChannel);
						self.emit('socket.ready', socketChannel);
					});	
				}
			},
			init: function(cfg){
				var self = this;
				
						
				if(cfg){
					if(cfg.server){
						self.TCPServer.server = cfg.server;
					}else{
						for(var key in cfg){
							self.set(key, cfg[key]);
						}
						var port = self.get('TCPServer.port');
						var host = self.get('TCPServer.host');
						
						self.TCPServer.server = net.createServer({allowHalfOpen: false}).listen(port, host);
					}
				}
				
				if(self.TCPServer.server){
					self.TCPServer.configureListeners.call(self);
				}
			}
		};
		
		return mixin;	
	});
	