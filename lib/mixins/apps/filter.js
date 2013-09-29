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

            var criteria = self.get('criteria');

            if(criteria && Array.isArray(criteria) && criteria.length>0){
                var passed = true;
                for(var i=0;i<criteria.length;i++){
                    if(!passed){
                        continue;
                    }

                    var critItem = criteria[i];
                    for(var key in critItem){
                        if(critItem[key].eq){
                            if(data.get(key)!=critItem[key].eq){
                                passed = false;
                            }
                        }
                    }
                }
                if(passed){
                    self.emit('passed', data);
                }else{
                    self.emit('failed', data);
                }
            }else{
                self.emit('passed', data);
            }
        }
    };
    
    return mixin;
});