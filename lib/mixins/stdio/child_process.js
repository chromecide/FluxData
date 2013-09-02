
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['child_process'], function(child_process){
    var mixin = {
        //called when first mixing in the functionality
        init: function(cfg, callback){
            var self = this;
            var errs = false;
            
            for(var key in cfg){
                self.set(key, cfg[key]);
            }

            var spawn = child_process.spawn;
            var command = self.get('command');
            var commandArgs = self.get('args');

            self.thisCommand = spawn(command, commandArgs);

            self.thisCommand.stdout.on('data', function (data) {
                self.emit('child_process.data', {
                    data: data
                });
            });

            self.thisCommand.stderr.on('data', function (data) {
                self.emit('child_process.err.data', {
                    data: data
                });
            });

            self.thisCommand.on('close', function (code) {
                self.emit('child_process.close', {
                    code: code
                });
            });

            if(callback){
                callback(errs, self);
            }
        },
        //called when something is published to this channel
        publish: function(topic, data){
            var self = this;

            switch('topic'){
                case 'child_process.data':
                    self.thisCommand.stdin.write(data.data);
                    break;
            }
        }
    };
    
    return mixin;
});