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

            var myChannels = self.get('channels');

            self.network = {
                channels: {}
            };

            var channelCount = myChannels.length;
            var loadedChannels = 0;
            
            function channelReturn(){

                loadedChannels++;
                if(loadedChannels==channelCount){
                    self.attachSelfLinks(function(){
                        self.attachChannelLinks(function(){
                            self.emit('network.ready', {cfg: cfg});
                        });
                    });
                }
            }
            
            for(var k=0;k<myChannels.length;k++){
                var newChannel = new self.constructor(myChannels[k], function(retData){
                    
                    self.network.channels[this.get('id')] = this;                    
                    if(!retData.ready){
                        this.on('channel.ready', function(){
                            channelReturn();
                        });
                    }else{
                        channelReturn();
                    }
                });
            }

            //self.emit('network.ready', cfg);

            if(callback){
                callback(errs, self);
            }
        },
        //called when something is published to this channel
        publish: function(topic, data){
            var self = this;

            switch(topic){
                case 'input':
                    self.attachInputLinks(data);
                    self.emit('input', data);
                    break;
                default:
                    self.emit(topic, data);
                    break;
            }
        },
        attachSelfLinks: function(callback){
            var self = this;
            var links = self.get('links');
            var inputLinks = [];
            
            for(var i=0;i<links.length;i++){
                if(links[i].source=='self'){
                    inputLinks.push(links[i]);
                }
            }

            var callbackBuilder = function(targetChan, targetEvent, useEventData){
                var sourceChannel = this;
                return function(eventData){

                    if(targetChan=='self'){
                        self.emit(targetEvent, useEventData!==false?eventData:sourceChannel);
                    }else{
                        targetChan.publish(targetEvent, useEventData!==false?eventData:sourceChannel);
                    }
                    
                };
            };

            for(var j=0;j<inputLinks.length;j++){
                var sourceEventName = inputLinks[j].event;

                var targetChannel;

                if(inputLinks[j].target=='self'){
                    targetChannel = 'self';
                }else{
                    targetChannel = self.network.channels[inputLinks[j].target];
                }

                var targetEventName = inputLinks[j].target_event;
                var useInput = (inputLinks[j].useEventData===false);

                var cb = callbackBuilder(targetChannel, targetEventName, (inputLinks[j].useEventData));
                self.on(sourceEventName, cb);
            }

            if(callback){
                callback(false, self);
            }
        },
        attachInputLinks: function(inputObject, callback){
            var self = this;
            var links = self.get('links');
            var inputLinks = [];
            
            for(var i=0;i<links.length;i++){
                if(links[i].source=='input'){
                    inputLinks.push(links[i]);
                }
            }

            for(var j=0;j<inputLinks.length;j++){
                var sourceEventName = inputLinks[j].event;
                var targetChannel = self.network.channels[inputLinks[j].target];
                var targetEventName = inputLinks[j].target_event;
                var useInput = (inputLinks[j].useEventData===false);



                inputObject.on(sourceEventName, function(eventData){
                    targetChannel.publish(targetEventName, (useInput?inputObject:eventData));
                });
            }

            if(callback){
                callback(false, inputObject);
            }
        },
        attachChannelLinks: function(callback){
            var self = this;
            var links = self.get('links');
            var inputLinks = [];
            
            for(var i=0;i<links.length;i++){
                if(links[i].source!='self' && links[i].source!='input'){
                    inputLinks.push(links[i]);
                }
            }

            var callbackBuilder = function(targetChan, targetEvent, useEventData){
                var sourceChannel = this;
                return function(eventData){

                    if(targetChan=='self'){
                        self.emit(targetEvent, useEventData!==false?eventData:sourceChannel);
                    }else{
                        
                        targetChan.publish(targetEvent, useEventData!==false?eventData:sourceChannel);
                    }
                    
                };
            };
            
            for(var j=0;j<inputLinks.length;j++){
                var sourceChannel = self.network.channels[inputLinks[j].source];
                var sourceEventName = inputLinks[j].event;
                var targetChannel = inputLinks[j].target=='self'?'self':self.network.channels[inputLinks[j].target];
                var targetEventName = inputLinks[j].target_event;
                
                //var useInput = (inputLinks[j].useEventData===false);
                
                // console.log(sourceChannel.get('id')+'.'+sourceEventName,'=>', (targetChannel=='self'?'self':inputLinks[j].target)+'.'+targetEventName);
                var cb = callbackBuilder(targetChannel, targetEventName, (inputLinks[j].useEventData));
                sourceChannel.on(sourceEventName, cb);
            }

            if(callback){
                callback(false, self);
            }
        },
        processSubNetworks: function(){

        }
    };
    
    return mixin;
});