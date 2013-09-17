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

            self.emit('apps.network.ready', cfg);

            if(callback){
                callback(errs, self);
            }
        },
        //called when something is published to this channel
        publish: function(topic, data){
            var self = this;

            var channelList = self.get('channels');
            var linkList = self.get('links');

            data.set('channels', {});



            for(var i=0;i<channelList.length;i++){
                var channelCfg = channelList[i];
                
                data.set('channels.'+)
            }
        }
    };
    
    return mixin;
});