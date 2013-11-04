    if (typeof define !== 'function') {
        var define = require('amdefine')(module);
    }
    
    define(['net'], function(net){
        var mixin = {
            //called when first mixing in the functionality
            init: function(cfg, callback){
                var self = this;
                var errs = false;
                
                for(var key in cfg){
                    if(key!='socket'){
                        self.set(key, cfg[key]);
                    }
                }
                
                self.requireMixin('mixins/tcp/socket', cfg, function(){
                    self.TCPSocket.configureListeners = function(){
                        var self = this;
                        
                        var chunk = '';

                        var socket = self.TCPSocket.socket;

                        socket.on('data', function(data){

                            //keep laoding data until we recieve the stop char
                            chunk += data.toString(); // Add string on the end of the variable 'chunk'
                            d_index = chunk.indexOf('\r'); // Find the delimiter
                        
                            // While loop to keep going until no delimiter can be found
                            while (d_index > -1) {    
                                try {
                                    
                                    string = chunk.substring(0,d_index); // Create string up until the delimiter
                                    json = JSON.parse(string); // Parse the current string
                                    
                                    if(self.intro){
                                        self.emit(json.topic, json.data); // Function that does something with the current chunk of valid json.            
                                    }else{
                                        if(json.topic=='_intro'){
                                            
                                            if(!self.intro){
                                                self.publish('_intro', {
                                                    id: self.get('id'),
                                                    name: self.get('name')
                                                });


                                                self.set('id', json.data.id);
                                                self.set('name', json.data.name);

                                                self.emit('remote.ready', self, self);
                                                self.intro = true;
                                            }
                                        }
                                    }
                                    
                                }catch(e){
                                }
                                
                                chunk = chunk.substring(d_index+1); // Cuts off the processed chunk
                                d_index = chunk.indexOf('\r'); // Find the new delimiter
                            }
                        });
                        
                        socket.on('end', function(data){
                            self.attemptConnect();
                            self.emit('end', data);
                        });
                    };
                    
                    if(cfg){
                        if(cfg.socket){
                            
                            self.TCPSocket.socket = cfg.socket;
                            self.TCPSocket.configureListeners.call(self);

                            if(self.TCPSocket.socket){
                                //move the socket to another property, so the default socket publish function doesn't send a copy of the data as well
                                self.TCPSocket.managedSocket = self.TCPSocket.socket;
                                delete self.TCPSocket.socket;
                            }

                            if(callback){
                                callback(self);
                            }
                        }else{
                            var host = self.get('host');
                            var port = self.get('port');
                            
                            //if we have a port configured
                            if(port){
                                self.attemptConnect(function(err){
                                    if(!err){
                                        if(callback){
                                            callback(err, self);
                                        }
                                    }
                                });
                            }
                        }
                    }else{
                        if(self.TCPSocket.socket){
                            //move the socket to another property, so the default socket publish function doesn't send a copy of the data as well
                            self.TCPSocket.managedSocket = self.TCPSocket.socket;
                            delete self.TCPSocket.socket;
                        }

                        if(callback){
                            callback(self);
                        }
                    }
                });
            },
            attemptConnect: function(callback){
                console.log('attempting connection');
                var self = this;
                var host = self.get('host');
                var port = self.get('port');
                
                //if we have a port configured
                if(port){
                    try{
                        var socket = net.connect(port, host, function(){
                            self.TCPSocket.socket = socket;
                            self.TCPSocket.configureListeners.call(self);

                            if(self.TCPSocket.socket){
                                //move the socket to another property, so the default socket publish function doesn't send a copy of the data as well
                                self.TCPSocket.managedSocket = self.TCPSocket.socket;
                                delete self.TCPSocket.socket;
                            }

                            if(callback){
                                callback(false, self);
                            }
                        });

                        socket.on('error', function(err){
                            //try agin in a few seconds
                            setTimeout(function(){
                                self.attemptConnect();
                            }, 5000);

                            if(callback){
                                callback(err);
                            }
                        });
                    }catch(e){
                        //try again in a few seconds
                        
                        if(callback){
                            callback(e);
                        }
                    }
                }
            },
            //called when something is published to this channel
            publish: function(topic, data){
                var self = this;
                
                var message = {
                    topic: topic,
                    data: data?data.get():undefined
                };

                try{
                    var messageString = JSON.stringify(message)+'\r';
                    if(messageString && self.TCPSocket.managedSocket){
                        self.TCPSocket.managedSocket.write(messageString);
                    }else{
                        //console.log(self.TCPSocket);
                    }
                }catch(e){

                }
            }
        };
        
        return mixin;
    });
    