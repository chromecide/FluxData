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

            self.emit('sort.ready', cfg);

            if(callback){
                callback(errs, self);
            }
        },
        //called when something is published to this channel
        publish: function(topic, data){
            var self = this;

            if(Array.isArray(data)){
                if(data.length===0){
                    self.emit('sort.sorted', data);
                }else{
                    var sortKey = self.get('sortkey');
                    console.log('sorting on:', sortKey);
                    data.sort();
                    if(self.get('direction')=='DESC'){
                        data.reverse()
                    }

                    self.emit('data.sorted', data);
                }
            }
        }
    };
    
    return mixin;
});