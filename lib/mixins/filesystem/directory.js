if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['fs'], function(fs){
    var mixin = {
        //called when first mixing in the functionality
        init: function(cfg, callback){
            var self = this;
            var errs = false;
            
            for(var key in cfg){
                self.set(key, cfg[key]);
            }

            fs.stat(self.get('path'), function(err, stats){
                for(var key in stats){
                    self.set(key, stats[key]);
                }


                self.emit('directory.ready', cfg);

                if(callback){
                    callback(errs, self);
                }
            });
        },
        //called when something is published to this channel
        publish: function(topic, data){
            var self = this;

            switch(topic){
                case 'directory.read':
                
                    fs.readdir(self.get('path'), function(err, files){
                        if(err){
                            self.emit('error', err);
                            return;
                        }

                        var fileCount = files.length;
                        var readyFiles = [];

                        if(fileCount>0){
                            for(var i=0;i<fileCount;i++){
                                var filePath = self.get('path')+'/'+files[i];
                                var stats = fs.statSync(filePath);
                                if(stats.isFile()){
                                    var file = new self.constructor({
                                        mixins: [
                                            {
                                                type: 'FluxData/filesystem/file',
                                                path: filePath
                                            }
                                        ]
                                    });

                                    file.on('file.ready', function(){
                                        readyFiles.push(this);
                                        self.emit('directory.read.file.ready', this);
                                        if(readyFiles.length==fileCount){
                                            self.set('files', readyFiles);
                                            self.emit('directory.read.done', {});
                                        }
                                    });
                                }else if(stats.isDirectory()){
                                    var directory = new self.constructor({
                                        mixins: [
                                            {
                                                type: 'FluxData/filesystem/directory',
                                                path: filePath
                                            }
                                        ]
                                    });

                                    directory.on('directory.ready', function(){
                                        readyFiles.push(this);
                                        self.emit('directory.read.directory.ready', this);
                                        if(readyFiles.length==fileCount){
                                            self.set('files', readyFiles);
                                            self.emit('directory.read.done', {});
                                        }
                                    });
                                }
                            }
                        }else{
                            
                            self.set('files', []);
                            self.emit('directory.read.done', {});
                        }
                    });
                    break;
            }
        }
    };
    
    return mixin;
});