var FluxData = require('./index');
var path = require('path');
var url = require('url');
var fs = require('fs');
var querystring = require('querystring');

var serverNode = new FluxData.Channel({
	mixins:[
		{
			type: 'mixins/http/server',
			port: 8080
		}
	]
});

var activeNode = new FluxData.Channel({});

serverNode.on('http.request', function(data){
	var request = data.get('request');
	var response = data.get('response');
	
	var pUrl = url.parse(request.url);
	
	switch(pUrl.pathname){
		case '':
		case '/':
		case '/ui':
			response.writeHead(200);
			response.write(getUIFile(request.url));
			response.end();
			break;
		default:
			var urlParts = pUrl.pathname.split('/');
			
			if(urlParts[0]==''){
				urlParts.shift();
			}
			
			if(urlParts[0]=='fsgui'){
				switch(urlParts[1]){
					case 'app.js':
					case 'mixins':
					case 'css':
						break;
					default:
						urlParts.shift();
						break;
				}
			}
			
			switch(urlParts[0]){
				case 'data':
					switch(request.method){
						case 'GET':
							response.writeHead(200);
							var data = activeNode.get();
							console.log(data);
							response.write(JSON.stringify(data));
							response.end();
							break;	
						case 'POST':
							postRequest(request, response, function(){
								console.log(request.post);
								for(var key in request.post){
									console.log(request.post[key]);
									switch(request.post[key].type){
										case 'string':
											activeNode.set(key, request.post[key].value);
											break;
										case 'number':
											activeNode.set(key, request.post[key].value*1);
											break;
										case 'boolean':
											activeNode.set(key, request.post[key].value=='true'?true:false);
											break;
										case 'object':
											activeNode.set(key, JSON.parse(request.post[key].value));
											break;
										case 'date':
											activeNode.set(key, request.post[key].value);
											break;
									}
									
								}
								console.log(activeNode._data);
								response.writeHead(200);
								response.write('{"success": true}');
								response.end();
							});
							break;
					}
					
					break;
				case 'requirejs':
					response.writeHead(200);
					response.write(fs.readFileSync(__dirname+'/node_modules/requirejs/require.js'));
					response.end();
					break;
				case 'FluxData':
				
					response.writeHead(200);
					urlParts.shift();
					console.log(urlParts);
					response.write(fs.readFileSync(__dirname+'/'+urlParts.join('/')));
					response.end();
					break;
				case 'fsgui':
					response.writeHead(200);
					response.write(fs.readFileSync(__dirname+'/lib/'+urlParts.join('/')));
					response.end();
					break;
				default:
					response.writeHead(404, {
						"Content-Type": "text/plain"
					});
					
					response.end();	
					break;
			}
			
			break;
	}
});

serverNode.on('http.mixin.ready', function(){
	serverNode.publish('http.start', {});
});


function postRequest(request, response, callback) {
    var queryData = "";
    if(typeof callback !== 'function') return null;

    if(request.method == 'POST') {
        request.on('data', function(data) {
            queryData += data;
            if(queryData.length > 1e6) {
                queryData = "";
                response.writeHead(413, {'Content-Type': 'text/plain'}).end();
                request.connection.destroy();
            }
        });

        request.on('end', function() {
            request.post = parsePostData(queryData);
            callback();
        });

    } else {
        response.writeHead(405, {'Content-Type': 'text/plain'});
        response.end();
    }
}

function parsePostData(data){
	var splits = data.split('&');
    var hash = [];
    
    var baseData = querystring.parse(data);
    console.log(data);
    console.log(baseData);
    for(var key in baseData){	
    	console.log(key);
    	var arrMatch = /([^\[]*)\[([^\]]*)]/.exec(key);
    	
    	if(arrMatch){
    		//object or array
    		var fieldName = arrMatch[1];
    		if(!hash[fieldName]){
    			hash[fieldName] = {};
    		}
    		hash[fieldName][arrMatch[2]] = baseData[key];
    	}else{
    		hash[key] = baseData[key];	
    	}
    	
    }
    console.log('=====');
    console.log(hash);
    console.log('=====');
    return hash;
}

function getUIFile(filepath){
	var html = '';
	
	html+='<html>';
	html+='<head>';
	html+='<style>';
	html+='h1.loader{text-align: center; font-family: sans-serif;}';
	html+='</style>';
	html+='<title>Flux Singularity Node</title>';
	html+='<script data-main="fsgui/app" src="/requirejs"></script>';
	html+='<script>';
	html+='require.config({';
	html+='paths:{';
	html+='eventemitter2: "FluxData/node_modules/eventemitter2/lib/eventemitter2",';
	html+='util: "FluxData/lib/browser_util"',
	html+='}})';
	html+='</script>';
	html+='</head>';
	html+='<body>';
	html+='<h1 class="loader">Loading...</h1>';
	html+='</body>';
	html+='</html>';
	
	return html;
}
