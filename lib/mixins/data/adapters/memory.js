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

            self.collections = [];

            if(callback){
                callback(errs, self);
            }
        },
        //called when something is published to this channel
        publish: function(topic, data){
            switch(topic){
                case 'save': //save a collection

                    break;
                case 'delete': //remove a collection

                    break;
                case ''
                case 'query': //create a query channel

                    break;
            }
        },
    };
    
    return mixin;
});