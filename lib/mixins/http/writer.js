if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(){
    var mixin = {
        //called when first mixing in the functionality
        init: function(cfg, callback){
            var self = this;
            var errs = false;
            
            for(var key in cfg){
                self.set(key, cfg[key]);
            }

            

            if(callback){
                callback(errs, self);
            }
        },
        //called when something is published to this channel
        publish: function(topic, data){
            var self = this;

            switch(topic){
                case 'request':
                    var content = self.get('content');

                    var response = data.get('response');
                    
                    data.publish('content', {
                        content: content
                    });

                    self.emit('content.written', data);
                    break;
            }
        }
    };
    
    return mixin;
});