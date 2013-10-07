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

            self.requireMixin({
                type: 'FluxData/stdio/stdin'
            }, {}, function(){
                self.requireMixin({
                    type: 'FluxData/stdio/stdout'
                }, {}, function(){
                    if(callback){
                        callback(errs, self);
                    }
                    self.emit('terminal.ready', cfg);
                });
            });
        },
        //called when something is published to this channel
        publish: function(topic, data){
            var self = this;

            switch(topic){
                case 'terminal.prompt':
                    self.once('data', function(data){
                        self.emit('terminal.prompt', data.get());
                    });

                    self.publish('write', {
                        data: data.message || data.get('message')
                    });
                    break;
                case 'terminal.menu':
                    var menuItems = data.get('items');
                    self.publish('write', {
                        data: '--------------------------------------------\n'
                    });
                    for(var i=0;i<menuItems.length;i++){
                        self.publish('write', {
                            data: '['+(i+1)+'] '+menuItems[i].text+'\n'
                        });
                    }

                    self.once('data', function(data){
                        self.emit('terminal.menu', new self.constructor({
                            selection: parseInt(data.get('data'), 10)
                        }));
                    });

                    self.publish('write', {
                        data: '--------------------------------------------\n'
                    });

                    self.publish('write', {
                        data: 'Please Enter a Selection[1-'+menuItems.length+']: '
                    });

                    break;
            }
        }
    };
    
    return mixin;
});