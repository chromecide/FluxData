var router = {
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
			var routes = self.Router.getRoutesBySource(SourceNode.get('id'), topic);
			
			for(var i=0;i<routes.length;i++){
				var route = routes[i];
				var targetNode = self.Router.endPoints[route.target];
				targetNode.publish(route.targetTopic, message);
			}
		},
		getRoutesBySource: function(sourceNodeID, topic){
			var routes = [];
			for(var i=0;i<self.Router.routes.length;i++){
				var route = self.Router.routes[i]; 
				
				if((typeof route.source)=='function'){
					if(route.source(sourceNodeID, topic)){
						
					}	
				}else{
					if(route.source = sourceNodeID && route.sourceTopic == topic){
						routes.push(route);
					}
				}
			}
			
			return routes;
		}
	},
	publish: function(topic, message){
		var self = this;
		switch(topic){
			case 'endpoint':
				self.Router.addEndpoint.call(self, message);
				break;
			case 'route':
				self.Router.addRoute.call(self, message);
				break;
			case 'message':
			default:
				self.Router.routeMessage.call(self, message.get('source'), message.get('message'));
				break;
		}
	}
}
