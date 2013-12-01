if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(){
    var mixin = {
        name: 'FluxData/apps/wait',
        inputs: [
            {
                name: 'data',
                accepts:[]
            },
            {
                name:'trigger',
                accepts: []
            }
        ],
        outputs: [],
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
            if(topic!='trigger'){
                self.set('event', topic);
                self.set('data', data);
            }else{
                self.emit(self.get('event'), self.get('data'));
            }
        }
    };
    
    return mixin;
});