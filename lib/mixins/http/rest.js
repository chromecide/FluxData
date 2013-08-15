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
					var request = data.get('request');
					var response = data.get('response');
					var basePath = self.get('webroot') || process.cwd();
					
					var uri = url.parse(request.url).pathname;
					if (uri.match(/\/$/)) uri = uri + 'index.html';
					var filename = path.join(basePath, uri);
					
					fs.exists(filename, function(exists){
						if (!exists){
							//TODO: Check Against the paths attribute
							var paths = self.get('paths');
							var pathURL = false;
							
							for(var key in paths){
								//turn the key into a regex object
								var testURL = uri;
								if(testURL.indexOf('/')==0){
									testURL = testURL.substring(1, testURL.length);
								}
								var pattern = new RegExp(key.replace('/','\/')+'(.*)');
								
								if(pattern.test(uri)){
									pathURL = paths[key]+uri.replace(key, '');
									
								}
							}
							
							if(pathURL){
								var pfilename = path.resolve(pathURL);
								console.log(pfilename);
								fs.exists(pfilename, function(exists){
									
									if(!exists){
										response.writeHead(404, {
											"Content-Type": "text/plain"
										});
										//response.write("404 Not Found\n");
										response.end();
										return;
									}
									
									fs.readFile(pfilename, "binary", function(err, file){
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
							}else{
								response.writeHead(404, {
									"Content-Type": "text/plain"
								});
								//response.write("404 Not Found\n");
								response.end();
							}
							
							return;	
						}else{
							console.log('HERE');
							console.log(filename);
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
						}
						
						
					});
				});
			}
		}
		return mixin;
	});
	