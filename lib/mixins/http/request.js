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
        /**
         * Called when something is published to this channel
         * @param  {string} topic topic to publish
         * @param  {Object} data  data to publish
         */
        publish: function(topic, data){

            var self = this;
            var response = self.get('response');

            switch(topic){
                //set the value of a header
                case 'header':
                    response.setHeader(data.get('name'), data.get('value'));
                    break;
                //write content to the response
                case 'content':

                    if(self.get('buffer')!==true){
                        response.write(data.get('content'));
                        self.emit('content.written', data);
                    }else{
                        self.set('contentbuffer', self.get('contentbuffer')+data.get('content'));
                    }
                    
                    break;
                //end the response
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
        /**
         * Processes the cookie header
         * @param  {request}   request  the request object
         * @param  {Function} callback Optional. called when cookie parsing has completed
         */
        processCookies: function(request, callback){
            if(request.headers.cookie && request.headers.cookie!==''){
                var cookies = request.headers.cookie.split(';');
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
        /**
         * Adds handlers for processing the request data
         * @param  {request}   request  the request object
         * @param  {response}   response the response object
         * @param  {Function} callback Required. Called when all request data has been recieved
         */
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
                request.body = querystring.parse(queryData);
                callback();
            });
        }
    };
    
    return mixin;
});