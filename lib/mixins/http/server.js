	if (typeof define !== 'function') {
	    var define = require('amdefine')(module);
	}
	
	define(['http'], function(http){
		var mixin = {
			http:{
				server: undefined
			},
			init: function(cfg, callback){
				var self = this;
				if(cfg){
					for(var key in cfg){
						if(key!='type'){
							self.set(key, cfg[key]);	
						}
					}
				}
				
				self.emit('http.mixin.ready', {});
				
				if(self.get('http.autostart')!==false){
					
					self.publish('http.start', {});
				}

				if(callback){
				    callback(false, {cfg: cfg});
				}
			},
			publish: function(topic, data){
				var self = this;
				switch(topic){
					case 'http.start':
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
									self.emit('http.request', requestChannel);
								});
							});
						}
						
						var port = self.get('port');
						var host = self.get('host');
						
						self.http.server.listen(port, host);
						break;
					case 'http.stop':
						if(self.http.server){
							self.http.server.close();
						}
						break;
				}
			}
		};
		
		return mixin;
	});
	