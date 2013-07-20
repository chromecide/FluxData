;!function(exports, undefined) {
	var qs = require('querystring');
	var channel = {
		name: 'http.server',
		label: 'Server',
		params:{
			host:{
				name:'host',
				label: 'Host',
				type: 'Text'
			},
			port:{
				name:'port',
				label: 'Port',
				type: 'Number'
			}
		},
		init: function(callback){
			console.log('CREATING');
			var self = this;
			var http = require('http');
			
			self.Models = {
				HTTPConn: new self._Model({
					name: 'HTTPConnection',
					fields:[
						{
							name: 'Request'
						},
						{
							name: 'Response'
						}
					]
				})
			}
			
			if(!this.port){
				this.port = 8080;
			}
			
			http.createServer(function (req, res) {
				switch(req.method){
					case 'GET':
						var connection = new self._Entity(self.Models.HTTPConn, {
						  	request: req,
						  	response: res
						});
						
						self.emit('entity', connection);
						break;
					case 'POST':
						postWrap.call(self, req, res);
						break;
				}
			}).listen(this.port);
			if(callback){
				callback(this);
			}
		},
		publish: function(topic, entity){
			//this.emit('entity', entity);
		}
	}
	
	function postWrap(request, response){
		var self = this;
		request.post_content='';
		request.on('data', function(data){
			this.post_content+=data;
		});
		
		request.on('end', function(){
			var parsed = qs.parse(request.post_content);
			request.post_content = parsed;
			var connection = new self._Entity(self.Models.HTTPConn, {
			  	request: request,
			  	response: response
			});
			self.emit('entity', connection);
		});	
	};
	
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return channel;
		});
	} else {
		exports.Channel = channel;
	}

}(typeof process !== 'undefined' && typeof process.title !== 'undefined' && typeof exports !== 'undefined' ? exports : window);