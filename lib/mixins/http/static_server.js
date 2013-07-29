	if (typeof define !== 'function') {
	    var define = require('amdefine')(module);
	}
	
	define(['fs', 'url', 'path'], function(fs, url, path){
		var mixin = {
			init: function(cfg){
				var self = this;
				
				if(cfg){
					for(var key in cfg){
						self.set(key, cfg[key]);
					}	
				}
				
				self.mixin('mixins/http/server');
				
				self.on('http.request', function(data){
					var request = data.request;
					var response = data.response;
					var basePath = self.get('webroot') || process.cwd();
					
					var uri = url.parse(request.url).pathname;
					if (uri.match(/\/$/)) uri = uri + 'index.html';
					var filename = path.join(basePath, uri);
					
					fs.exists(filename, function(exists){
						if (!exists){
							response.writeHead(404, {
								"Content-Type": "text/plain"
							});
							//response.write("404 Not Found\n");
							response.end();
							return;  
						}
						fs.readFile(filename, "binary", function(err, file){
							if (err){
								response.writeHead(500, {
									"Content-Type": "text/plain"
								});
								//response.write("500 Not Found\n");
								response.end();
								return;
							}
							response.writeHead(200);
							response.write(file, "binary");
							response.end();
						});
					});
				});
			}
		}
		return mixin;
	});
	