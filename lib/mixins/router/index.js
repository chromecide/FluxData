	if (typeof define !== 'function') {
	    var define = require('amdefine')(module);
	}
	
	define({
		Router:{
			endPoints: {},
			routes: [],
			addEndPoint: function(endPoint, callback){
				var self = this;
				var endPointID = endPoint.get('id');
				
				if(!self.endpoints[endPointID]){
					self.endpoints[endPointID] = endPoint;
				}
			},
			/*
			 * {
			 * 		source: ["InputNodeID" || function(sourceNode, topic){return true||false;}],
			 * 		sourceTopic: "InputNodeTopicName",
			 * 		target: ["TargetNodeID" || Array("TargetNodeIDS") || function(sourceNode, topic){return this.Router.endPoints}],
			 * 		targetTopic: "TargetNodeTopicName"
			 * }
			 * 
			 * OR
			 * 
			 * 
			 */
			addRoute: function(route){
				var self = this;
				self.Router.routes.push(route);
			},
			routeMessage: function(sourceNode, topic, message){
				var self = this;
				
				var routes = self.Router.getRoutesBySource.call(self, sourceNode.get('id'), topic);
				
				for(var i=0;i<routes.length;i++){
					var route = routes[i];
					
					var targetNode = self.Router.endPoints[route.target];
					targetNode.publish(route.targetTopic=='*'?topic:route.targetTopic, message);
				}
			},
			getEndPointById: function(epID){
				var self = this;
				return self.Router.endPoints[epID];
			},
			getRoutesBySource: function(sourceNodeID, topic){
				var self = this;
				var routes = [];
				
				for(var i=0;i<self.Router.routes.length;i++){
					var route = self.Router.routes[i]; 
					
					if((typeof route.source)=='function'){
						if(route.source(sourceNodeID, topic)){
							routes.push(route);
						}	
					}else{
						if(route.source=='*' || route.source == sourceNodeID){
							if(route.sourceTopic=='*' || route.sourceTopic == topic){
								routes.push(route);
							}
						}
					}
				}
				
				return routes;
			},
			configureListeners: function(channel){
				var self = this;
				channel.onAny(function(evData){
					self.Router.routeMessage.call(self, this, this.event, evData);
				});
			}
		},
		init: function(cfg){
			var self = this;
			
		},
		publish: function(topic, data){
			var self = this;
			switch(topic){
				case 'router.channel':
					if(!data.initialConfig){
						data = new self.constructor(data);
					}
					
					self.Router.endPoints[data.get('id')] = data;
					self.Router.configureListeners.call(self, data);
					break;
				case 'router.route':
					self.Router.routes.push(data);
					break;
			}
		}
	});
	