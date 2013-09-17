if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['request'], function(request){
    var mixin = {
        //called when first mixing in the functionality
        init: function(cfg, callback){
            var self = this;
            var errs = false;
            
            for(var key in cfg){
                self.set(key, cfg[key]);
            }

            self.emit('http.ready', cfg);

            if(callback){
                callback(errs, self);
            }
        },
        //called when something is published to this channel
        publish: function(topic, data){

            console.log(arguments);
            var self = this;
            switch(topic){
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
        }
    };
    
    return mixin;
});