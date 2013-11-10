if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(){
    var mixin = {
        //called when first mixing in the functionality
        basic_auth:{
            auth_handler: function(username, password, callback){
                var self = this;
                console.log(self.get('basic_auth'));
                if(self.get('basic_auth.username')==username && self.get('basic_auth.password')==password){
                    callback(true);
                }else{
                    callback(false);
                }
            }
        },
        init: function(cfg, callback){
            var self = this;
            var errs = false;
            
            for(var key in cfg){
                if(key=='auth_handler'){
                    self.basic_auth.auth_handler = cfg[key];
                }else{
                    self.set('basic_auth.'+key, cfg[key]);
                }
            }

            self.before('http.request', function(data, sender, next){
                
                var req = data.get('request');
                var res = data.get('response');

                //The following was taken from: https://gist.github.com/charlesdaniel/1686663
                var auth = req.headers['authorization']; // auth is in base64(username:password) so we need to decode the base64
                 
                if(!auth) { // No Authorization header was passed in so it's the first time the browser hit us
                    // Sending a 401 will require authentication, we need to send the 'WWW-Authenticate' to tell them the sort of authentication to use
                    // Basic auth is quite literally the easiest and least secure, it simply gives back base64( username + ":" + password ) from the browser
                    res.statusCode = 401;
                    res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
                     
                    res.end();
                } else if(auth) { // The Authorization was passed in so now we validate it
                 
                    var tmp = auth.split(' '); // Split on a space, the original auth looks like "Basic Y2hhcmxlczoxMjM0NQ==" and we need the 2nd part
                     
                    var buf = new Buffer(tmp[1], 'base64'); // create a buffer and tell it the data coming in is base64
                    var plain_auth = buf.toString(); // read it back out as a string
                     
                    console.log("Decoded Authorization ", plain_auth);
                     
                    // At this point plain_auth = "username:password"
                     
                    var creds = plain_auth.split(':'); // split on a ':'
                    var username = creds[0];
                    var password = creds[1];
                    
                    self.basic_auth.auth_handler.call(self, username, password, function(authed){
                        if(authed) { // Is the username/password correct? 
                            next();
                        } else {
                            res.statusCode = 401; // Force them to retry authentication
                            res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
                            res.end();
                        }
                    });
                }
            });

            if(callback){
                callback(errs, self);
            }
        },
        uninit: function(){
            //self.off('http.request', self.auth_handler);
        },
        //called when something is published to this channel
        publish: function(topic, data){
            
        }
    };
    
    return mixin;
});