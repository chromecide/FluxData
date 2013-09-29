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
            var channels = self.get('channels');
            var links = self.get('links');

            var subNetConfig = {
                mixins: [
                    {
                        type: 'FluxData/apps/network',
                        channels: channels,
                        links: links
                    }
                ]
            };

            var subnet = new self.constructor(subNetConfig);

            subnet.once('complete', function(evtData){
                self.emit('complete', evtData);
            });

            subnet.once('network.ready', function(){
                subnet.publish('input', data);
            });

        }
    };
    
    return mixin;
});