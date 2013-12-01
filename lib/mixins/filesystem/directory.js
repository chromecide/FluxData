if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['fs'], function(fs){
    var mixin = {
        name: 'FluxData/filesystem/directory',
        //called when first mixing in the functionality
        init: function(cfg, callback){
            var self = this;
            var errs = false;
            
            self.maxCopyCount = 2;
            self.copyingCount = 0;

            self.copyingFiles = {};
            self.copyQueue = [];

            for(var key in cfg){
                self.set(key, cfg[key]);
            }

            if(!self.get('interval')){
                self.set('interval', 5007);
            }

            fs.stat(self.get('path'), function(err, stats){
                if(stats.isDirectory()){
                    for(var key in stats){
                        if((typeof stats[key])==='function'){
                            self.set(key, stats[key]());
                        }else{
                            self.set(key, stats[key]);
                        }
                    }

                    if(self.get('monitor')!==false){
                        self.fswatch();
                    }

                    self.loadDirectory(self.get('emitEvents'), function(){
                        self.emit('directory.ready', cfg);
                    });
                }else{
                    self.emit('error', {
                        message: 'Path is not a directory'
                    });
                }

                if(callback){
                    callback(errs, self);
                }
            });
        },
        //called when something is published to this channel
        publish: function(topic, data){
            var self = this;

            switch(topic){
                case 'file': //file sync
                    //if the file doesn't already exist, copy the source file
                    
                    var fileName = data.get('filename');
                    var file = data.get('file');
                    var targetPath = self.get('path');
                    var targetFile = path.join(targetPath, fileName);

                    fs.exists(targetFile, function(exists){
                        if(!exists){
                            self.copyQueue.push({
                                file: file,
                                targetFile: targetFile,
                                filename: filename
                            });

                            self.processCopyQueue();
                        }
                    });
                    break;
                case 'directory': //directory sync

                    break;
            }
        },
        processCopyQueue: function(){
            var self = this;
            var current = self.copyQueue.shift();

            if(current && self.copyingCount<self.maxCopyCount){
                self.copyingFiles[current.targetFile] = true;
                self.copyingCount++;
                self.copyFile(current.file.get('path'), current.targetFile, function(){
                    delete self.copyingFiles[current.targetFile];
                    self.copyingCount--;
                    self.processCopyQueue();
                });
            }else{
                console.log('QUEUE FINISHED');
            }
        },
        fswatch: function(){
            var self = this;

            fs.watchFile(self.get('path'), {interval: self.get('interval')},function(curr, prev){
                if(curr.atime!=prev.atime){
                    self.emit('accessed', curr);
                }

                if(curr.mtime!=prev.mtime){
                    fs.exists(self.get('path'), function(bExists){
                        if(bExists){
                            self.emit('modified', curr);
                            self.loadDirectory();
                        }else{
                            self.emit('deleted', curr);
                        }
                    });
                }
            });
        },
        loadDirectory: function(emitEvents, callback){
            var self = this;
            if(!self.filechildEventListener){
                self.filechildEventListener = function(){
                    
                    if(this.event=='deleted'){
                        //TODO: remove the file from the directory's files collection
                        var tList = self.get('files');
                        
                        for(var k=tList.length-1;k>=0;k--){
                            if(tList[k].get('path')==this.get('path')){
                                tList.splice(k, 1);
                            }
                        }

                        this.off('accessed', self.filechildEventListener);
                        this.off('modified', self.filechildEventListener);
                        this.off('deleted', self.filechildEventListener);

                        self.set('files', tList);
                    }

                    self.emit('file.'+this.event, this);
                };
            }

            if(!self.directorychildEventListener){
                self.directorychildEventListener = function(){
                    
                    if(this.event=='deleted'){
                        //TODO: remove listeners from object
                        var tList = self.get('files');
                        
                        for(var k=tList.length-1;k>=0;k--){
                            if(tList[k].get('path')==this.get('path')){
                                tList.splice(k, 1);
                            }
                        }

                        this.off('accessed', self.directorychildEventListener);
                        this.off('modified', self.directorychildEventListener);
                        this.off('deleted', self.directorychildEventListener);

                        self.set('files', tList);
                    }

                    self.emit('directory.'+this.event, this);
                };
            }

            var currentFileList = self.get('files');
            console.log('READING DIR', self.get('path'));
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
                                            path: filePath,
                                            interval: self.get('interval')
                                        }
                                    ]
                                });

                                file.on('file.ready', function(){
                                    readyFiles.push(this);
                                    if(emitEvents!==false){

                                        self.emit('file.added', this);
                                    }
                                    
                                    if(readyFiles.length==fileCount){
                                        self.set('files', readyFiles);
                                        if(callback){
                                            callback(false, fileCount);
                                        }
                                    }
                                });

                                file.on('accessed', self.filechildEventListener);
                                file.on('modified', self.filechildEventListener);
                                file.on('deleted', self.filechildEventListener);
                            }else if(stats.isDirectory()){
                                if(self.get('recursive')!==false){
                                    var directory = new self.constructor({
                                        mixins: [
                                            {
                                                type: 'FluxData/filesystem/directory',
                                                path: filePath,
                                                interval: self.get('interval')
                                            }
                                        ]
                                    });

                                    directory.on('directory.ready', function(){
                                        readyFiles.push(this);
                                        if(emitEvents!==false){
                                            self.emit('directory.added', this);
                                        }

                                        if(readyFiles.length==fileCount){
                                            self.set('files', readyFiles);
                                            if(callback){
                                                callback(false, fileCount);
                                            }
                                        }
                                    });

                                    directory.on('accessed', self.directorychildEventListener);
                                    directory.on('modified', self.directorychildEventListener);
                                    directory.on('deleted', self.directorychildEventListener);
                                }
                            }
                        }
                    }
                }else{
                    self.set('files', []);
                    if(callback){
                        callback(false, 0);
                    }
                }
            });
        },
        copyFile: function(source, target, cb){
            var cbCalled = false;

            var rd = fs.createReadStream(source);
            rd.on("error", function(err) {
                done(err);
            });

            var wr = fs.createWriteStream(target);
            wr.on("error", function(err) {
                done(err);
            });

            wr.on("close", function(ex) {
                done();
            });

            rd.pipe(wr);

            function done(err) {
                if (!cbCalled) {
                    cb(err);
                    cbCalled = true;
                }
            }
        }
    };
    
    return mixin;
});