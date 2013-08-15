	if (typeof define !== 'function') {
	    var define = require('amdefine')(module);
	}
	
	define(function(){
		var mixin = {
			init: function(){
				var self = this;
				self.requireMixin('mixins/router/index');
				
				//override the router routeMessage function
				self.Router.routeMessage = function(sourceNode, topic, message){
					self.emit(sourceNode.get('id')+'.'+topic, message);
				}
			},
			publish: function(topic, data){
				var self = this;
				if(topic.indexOf('.')>-1){
					var parts = topic.split('.');
					var targetNode = self.Router.getEndPointById.call(self, parts[0]);
					if(targetNode){
						parts.shift();
						targetNode.publish(parts.join('.'), data);
					}
				}
			}
		}
		
		return mixin;	
	});
	