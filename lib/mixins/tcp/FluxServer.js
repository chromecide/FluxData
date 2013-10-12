if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['net'], function(net){
    var mixin = {
        FluxServer: {
            configureListeners: function(socket){
                var self = this;
                self.FluxServer.server.on('connection', function(socket){

                    //create a channel from the connection and publish it to the router
                    var socketChannel = new self.constructor({
                        mixins:[
                            {
                                type: 'FluxData/tcp/FluxRemote',
                                socket: socket
                            }
                        ]
                    });
                    
                    socketChannel.onAny(function(evData){

                        self.emit(this.get('id')+'.'+this.event, evData);
                    });

                    socket.on('close', function(evData){
                        // delete self.Router.endPoints[socketChannel.get('id')];
                        self.emit(socketChannel.get('id')+'.close', evData);
                    });
                    
                    //self.publish('router.channel', socketChannel);
                    self.emit('remote.open', socketChannel);
                });
            }
        },
        //called when first mixing in the functionality
        init: function(cfg, callback){
            var self = this;
            var errs = false;
            
            for(var key in cfg){
                switch(key){
                    case 'server':
                        self.FluxServer.server = cfg.server;
                        break;
                    default:
                        self.set(key, cfg[key]);
                        break;
                }
            }

            var port = self.get('port');
            var host = self.get('host');

            if(!port){
                self.getPort(function(){
                    self.FluxServer.server = net.createServer({allowHalfOpen: false}).listen(port, host);

                    if(self.FluxServer.server){
                        self.FluxServer.configureListeners.call(self);
                    }
                });
            }else{
                self.FluxServer.server = net.createServer({allowHalfOpen: false}).listen(port, host);

                if(self.FluxServer.server){
                    self.FluxServer.configureListeners.call(self);
                }
            }

            self.on('remote.open', function(socketChannel){
                
                socketChannel.on('channel.ready', function(){
                    socketChannel.publish('_intro', {
                        id: self.get('id'),
                        name: self.get('name')
                    });

                    socketChannel.once('remote.ready', function(data){
                        self.emit('remote.ready', this, self);
                    });
                });
            });

            self.emit('FluxServer.ready', {});

            if(callback){
                callback(errs, self);
            }
        },
        //called when something is published to this channel
        publish: function(topic, data){
            
        },
        getPort: function(cb){
            var self = this;
            if(!self.portrange){
                self.portrange=9000;
            }

            var port = selfportrange;
            self.portrange += 1;
             
            var server = net.createServer();
            server.listen(port, function (err) {
                server.once('close', function () {
                    cb(port);
                });

                server.close();
            });

            server.on('error', function (err) {
                self.getPort(cb);
            });
        }
    };
    
    return mixin;
});
