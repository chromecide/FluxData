if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

/**
     * ## Static HTTP Server Mixin
     *
     * Server Static Files over HTTP
     *
     * **Example**
     *```
     * var FluxData = require('FluxData');
     *
     * var httpServer = new FluxData.Channel({
     *   mixins:[
     *     {
     *       type: 'FluxData/http/static_server',
     *       port: 8080,
     *       webroot: process.cwd()
     *     }
     *   ]
     * });
     * ```
     * @class FluxData.http.request
     * @extensionfor Channel
     * @requires request
     */
    
    /**
     * @attribute paths
     */
    
    /**
     * @attribute webroot
     */
define(['request', 'querystring'], function(request, querystring){
    var mixin = {
        //called when first mixing in the functionality
        init: function(cfg, callback){
            var self = this;
            var errs = false;
            
            for(var key in cfg){
                self.set(key, cfg[key]);
            }

            var req = self.get('request');
            var res = self.get('response');

            if(req){
                self.processRequest(req, res, function(){
                    self.processCookies(req, function(){
                        self.emit('http.request.ready', cfg);

                        if(callback){
                            callback(errs, self);
                        }
                    });
                });
            }else{
                self.emit('http.request.ready', cfg);

                if(callback){
                    callback(errs, self);
                }
            }
            
        },
        //called when something is published to this channel
        publish: function(topic, data){

            var self = this;
            var response = self.get('response');

            switch(topic){
                case 'header':
                    response.setHeader(data.get('name'), data.get('value'));
                    break;
                case 'content':

                    if(self.get('buffer')!==true){
                        response.write(data.get('content'));
                        self.emit('content.written', data);
                    }else{
                        self.set('contentbuffer', self.get('contentbuffer')+data.get('content'));
                    }
                    
                    break;
                case 'end':
                    if(self.get('buffer')===true){
                       response.write(self.get('contentbuffer'));
                    }
                    response.end();
                    
                    self.emit('request.ended', self);
                    break;
                case 'http.get':
                    request(self.get('url'), function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            self.emit('http.get.done', {
                                body: body
                            });
                        }
                    });
                    break;
                case 'http.post':

                    break;
            }
        },
        processCookies: function(request, callback){
            if(request.headers.cookie && request.headers.cookie!==''){
                var cookies = request.headers.cookie.split(';');
                console.log(cookies);
                request.cookies = {};

                for(var i=0;i<cookies.length;i++){
                    var cookie = cookies[i].split('=');
                    request.cookies[cookie[0]] = cookie[1];
                }
            }

            if(callback){
                callback(request);
            }
        },
        processRequest: function(request, response, callback){
            var queryData = "";
            if(typeof callback !== 'function') return null;

            request.on('data', function(data) {
                queryData += data;
                if(queryData.length > 1e6) {
                    queryData = "";
                    response.writeHead(413, {'Content-Type': 'text/plain'}).end();
                    request.connection.destroy();
                }
            });

            request.on('end', function() {
                console.log(queryData);
                response.body = querystring.parse(queryData);
                callback();
            });
        }
    };
    
    return mixin;
});