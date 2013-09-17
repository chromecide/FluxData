if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

/**
 * Simple Mixin for holding query results
 * @return {[type]} [description]
 */
define(function(){
    var mixin = {
        //called when first mixing in the functionality
        init: function(cfg, callback){
            var self = this;
            var errs = false;

            for(var key in cfg){
                self.set(key, cfg[key]);
            }
            
            self.set('results', []);

            if(callback){
                callback(errs, self);
            }

            self.emit('data.query.ready', cfg);
        },
        //called when something is published to this channel
        publish: function(topic, data){
            var self = this;
            switch(topic){
                case 'result':
                    self._data.results.push(data);
                    self.emit('result.added', data);
                    break;
                default:
                    break;
            }
        }
    };
    
    return mixin;
});