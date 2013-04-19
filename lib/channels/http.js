;!function(exports, undefined) {
	
	var channel = {
		name: 'http',
		init: function(callback){
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
				var connection = new self._Entity(self.Models.HTTPConn, {
				  	request: req,
				  	response: res
				});
				self.emit('entity', connection);
			}).listen(this.port);
			
			if(callback){
				callback(this);
			}
		},
		publish: function(entity){
			this.emit('entity', entity);
		}
	}
	
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return channel;
		});
	} else {
		exports.Channel = channel;
	}

}(typeof process !== 'undefined' && typeof process.title !== 'undefined' && typeof exports !== 'undefined' ? exports : window);