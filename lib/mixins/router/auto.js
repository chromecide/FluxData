	if (typeof define !== 'function') {
		var define = require('amdefine')(module);
	}
	
	define(function(){
		var mixin = {
			init: function(cfg, callback){
				var self = this;

				self.requireMixin('mixins/router/index', {}, function(){
					self.Router.routeMessage = function(sourceNode, topic, message){
						
						if(topic.indexOf('.')>-1){
							//we MAY have a destination
							var parts = topic.split('.');
							var targetNode = self.Router.getEndPointById.call(self, parts[0]);
							if(targetNode){ //we had a destination, so only send to that
								targetNode.publish(topic, message);
								return;
							}
						}
						
						var endPoints = self.Router.endPoints;
						for(var epID in endPoints){
							if(epID!=sourceNode.get('id')){
								var endPoint = endPoints[epID];
								endPoint.publish(topic, message);
							}
						}

						if(callback){
							callback(false, self);
						}
					};
				});
				
				//override the router routeMessage function
				
			}
		};
		
		return mixin;
	});
	