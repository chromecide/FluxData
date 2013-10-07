if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(){
    var mixin = {
        //called when first mixing in the functionality
        init: function(cfg, callback){
            console.log('INITTING GET STRING');
            var self = this;
            var errs = false;
            
            for(var key in cfg){
                self.set(key, cfg[key]);
            }

            if(!self.get('attribute')){
                self.set('attribute', 'value');
            }

            if(!self.get('as_attribute')){
                self.set('as_attribute', 'value');
            }

            if(callback){
                callback(errs, self);
            }
        },
        //called when something is published to this channel
        publish: function(topic, data){
            console.log('GETTING STRING');
            var attributeName = self.get('attribute');
            var attributeValue = {};
            attributeValue[self.get('as_attribute')] = data.get(attributeName);

            self.emit('got', attribtueValue);
        }
    };
    
    return mixin;
});