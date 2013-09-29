if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(){
    var mixin = {
        //called when first mixing in the functionality
        basic_auth:{
            auth_handler: function(username, password, callback){
                callback(true);
            }
        },
        init: function(cfg, callback){
            var self = this;
            var errs = false;
            
            for(var key in cfg){
                if(key=='auth_handler'){
                    self.basic_auth.auth_handler = cfg[key];
                }else{
                    self.set(key, cfg[key]);
                }
            }

            self.auth_handler = function(data){
                var request = data.get('request');
                var response = data.get('response');

                if(!request.headers.authorization){
                    response.statusCode = 401;
                    response.setHeader('WWW-Authenticate', 'Basic realm="'+(self.get('realm') || "Secure Area")+'"');
                    response.end();
                }else{
                    console.log(request.headers.authorization);
                    var authCreds = new Buffer(request.headers.authorization, "base64");
                    console.log(authCreds.toString('utf8'));
                    self.basic_auth.auth_handler('test', 'test', function(authed){
                        if(authed){
                            console.log('AUTHORIZED');
                            self.emit('basic_auth.authenticated', data);
                            data.publish('basic_auth.authenticated', self);
                        }else{
                            data.publish('end', {});
                            data.publish('basic_auth.failed', self);
                            self.emit('basic_auth.failed', data);
                        }
                    });
                    
                }
            };

            self.on('http.request', self.auth_handler);

            if(callback){
                callback(errs, self);
            }
        },
        uninit: function(){
            self.off('http.request', self.auth_handler);
        },
        //called when something is published to this channel
        publish: function(topic, data){
            
        }
    };
    
    return mixin;
});