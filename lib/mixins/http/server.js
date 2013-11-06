	if (typeof define !== 'function') {
		var define = require('amdefine')(module);
	}
	
	/**
	 * HTTP Server Mixin
	 *```
	 * var FluxData = require('FluxData');
	 *
	 * var httpServer = new FluxData.Channel({
	 *   mixins:[
	 *     {
	 *       type: 'FluxData/http/Server',
	 *       port: 8080
	 *     }
	 *   ]
	 * });
	 *
	 * httpServer.on('http.request', function(data){
	 * 	//process request here
	 * });
	 * ```
	 * @class FluxData.http.server
	 * @extensionfor Channel
	 * @requires http
	 * @uses  FluxData.http.request
	 */
	
	/**
	 * @attribute host
	 */
	
	/**
	 * @attribute port
	 */
	
	define(['http'], function(http){
		var mixin = {
			http:{
				server: undefined
			},
			init: function(cfg, callback){
				var self = this;

				if(cfg){
					if(!self.get('http.server')){
						if(!self.get('http')){
							self.set('http', {});
						}
						self.set('http.server', {});
					}
					for(var key in cfg){
						if(key!='type'){
							self.set('http.server.'+key, cfg[key]);
						}
					}
				}
				
				if(!self.get('http.server.port')){
					self.set('http.server.port', 8080);
				}

				/**
				 * @event http.mixin.ready
				 * @param {Object} Channel `this`
				 */
				self.emit('http.mixin.ready', self);
				
				if(self.get('http.server.autostart')!==false){
					self.publish('http.server.start', {});
				}

				if(callback){
					callback(false, {cfg: cfg});
				}
			},
			publish: function(topic, data){
				var self = this;
				switch(topic){
					//start the http server
					case 'http.server.start':
						if((typeof data)=='object'){
							for(var key in data){
								self.set(key, data[key]);
							}
						}
						
						if(!self.http.server){
							self.http.server = http.createServer(function(request, response){

								var requestChannel = new self.constructor({
									request: request,
									response: response,
									mixins: [
										{
											type: 'FluxData/http/request',
										}
									]
								});

								requestChannel.on('http.request.ready', function(){
									/**
									 * Emitted when a request has been received and the Request Channel is ready
									 * @event http.request
									 * @param {Object} RequestChan The ready Request Channel
									 */
									self.emit('http.request', requestChannel);
								});
							});
						}
						
						var port = self.get('http.server.port');
						var host = self.get('http.server.host');
						
						self.http.server.listen(port, host);
						/**
						 * Emitted when the internal http server has started
						 * @event http.server.started
						 * @param {Object} Channel `this`
						 */
						self.emit('http.server.started', self);
						break;
					//stop the http server
					case 'http.server.stop':
						if(self.http.server){
							self.http.server.close();
							/**
							 * Emitted when the internal http server has stopped
							 * @event http.server.stopped
							 * @param {Object} Channel `this`
							 */
							self.emit('http.server.stopped', self);
						}
						break;
				}
			}
		};
		
		return mixin;
	});
	