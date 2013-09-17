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
                    if((typeof stats[key])==='function'){
                        self.set(key, stats[key]());
                    }else{
                        self.set(key, stats[key]);
                    }
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
                    var currentFileList = self.get('files');

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

                                //first see if a file with this path already exists
                                var bFound = false;
                                if(currentFileList){
                                    for(var j=0;j<currentFileList.length;j++){
                                        if(currentFileList[j].get('path')==filePath){
                                            readyFiles.push(currentFileList[j]);
                                            bFound = true;
                                        }
                                    }
                                }
                                
                                if(!bFound){
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
                            }
                        }else{
                            
                            self.set('files', []);
                            self.emit('directory.read.done', {});
                        }
                    });
                    break;
                case 'directory.watch':
                    self.fswatch();
                    break;
            }
        },
        fswatch: function(){
            var self = this;
            var fileList = false;
            //first do a read and cache a copy of the fileList
            self.once('directory.read.done', function(){
                fileList = self.get('files');
                console.log('LOADED ', fileList.length, 'files');
                fs.watchFile(self.get('path'), function(curr, prev){
                    if(curr.atime!=prev.atime){
                        self.emit('directory.accessed', curr);
                    }

                    if(curr.mtime!=prev.mtime){
                        self.emit('directory.modified', curr);
                    }

                    self.once('directory.read.done', function(){
                        var newList = self.get('files');
                        //compare the cached list against the new list
                        var newFiles = [];
                        var removedFiles = [];

                        for(var i=0;i<fileList.length;i++){
                            var bFound = false;

                            for(var j=0;j<newList.length;j++){
                                if(fileList[i].get('path')==newList[j].get('path')){
                                    bFound = true;
                                }
                            }

                            if(!bFound){
                                removedFiles.push(fileList[i]);
                            }
                        }

                        for(var i=0;i<newList.length;i++){
                            var bFound = false;
                            for(var j=0;j<fileList.length;j++){
                                if(newList[i].get('path')==fileList[j].get('path')){
                                    bFound = true;
                                }
                            }

                            if(!bFound){
                                newFiles.push(newList[i]);
                            }
                        }

                        
                        
                        //make the new list the cached list
                        fileList = newList;
                    });

                    self.publish('directory.read', {});
                });
            });

            self.publish('directory.read', {});
        }
    };
    
    return mixin;
});