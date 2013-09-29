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

            var appNetworkCfg = {
                mixins: [
                    {
                        type: 'FluxData/apps/network',
                        channels: self.get('channels'),
                        links: self.get('links')
                    }
                ]
            };

            self.appNetwork = new self.constructor(appNetworkCfg);
            
            self.appNetwork.on('network.ready', function(){
                self.emit('app.ready', self.appNetwork);
            });

            if(callback){
                callback(errs, self);
            }
        },
        //called when something is published to this channel
        publish: function(topic, data){
            
        }
    };
    
    return mixin;
});