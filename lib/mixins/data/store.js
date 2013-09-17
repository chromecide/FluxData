if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(){
    var mixin = {
        adapter:{
            connectCollection: function(collectionName, acllback){
                var self = this;

                var errs = [];
                
                var returnCollection;

                if(!self._collections){
                    self._collections = {};
                }

                if(self._collections[collectionName]){
                    returnCollection = self._collections[collectionName];
                }else{
                    errs.push('collection not found');
                }
                
                if(callback){
                    if(errs.length===0){
                        errs = false;
                    }
                
                    callback(errs, returnCollection);
                }

            },
            getCollection: function(collection, callback){
                var self = this;

                var errs = [];
                
                if(!self._collections){
                    self._collections = {};
                }
                
                if(callback){
                    if(errs.length===0){
                        errs = false;
                    }
                
                    callback(errs, collection);
                }
            },
            saveCollection: function(collectionData, callback){
                var self = this;

                var errs = [];
                
                var collection = collectionData;
                if((collection instanceof self.constructor)===false){
                    if(!collection.mixins){
                        collection.mixins = [
                            {
                                type: 'FluxData/data/collection'
                            }
                        ];
                    }

                    collection = new self.constructor(collection);

                    self._collections[collection.get('id')] = collection;
                }

                if(callback){
                    if(errs.length===0){
                        errs = false;
                    }
                
                    callback(errs, collection);
                }
            },
            removeCollection: function(collection, callback){
                var self = this;
                var errs = [];
                
                
                
                if(callback){
                    if(errs.length===0){
                        errs = false;
                    }
                
                    callback(errs, record);
                }
            }
        },
        //called when first mixing in the functionality
        init: function(cfg, callback){

            var self = this;
            var errs = false;
            
            for(var key in cfg){
                self.set(key, cfg[key]);
            }

            if(!self.get('collections')){
                self.set('collections', {});
            }

            if(callback){
                callback(errs, self);
            }

            self.emit('mixin.ready', cfg);
        },
        //called when something is published to this channel
        publish: function(topic, data){
            
            var self = this;
            switch(topic){
                case 'collection.query':
                    
                    break;
                case 'collection.connect':
                    self.adapter.connectCollection.call(self, data, function(errs, collection){
                        self.emit('collection', collection);
                    });
                    break;
                case 'collection.get':
                    self.adapter.getCollection.call(self, data, function(errs, collection){
                        self.emit('collection', collection);
                    });
                    break;
                case 'collection.save':
                    console.log('SAVING');
                    self.adapter.saveCollection.call(self, data, function(errs, collection){
                        self.emit('collection.saved', collection);
                    });
                    break;
                case 'collection.remove':
                    self.adapter.removeCollection.call(self, data, function(errs, collection){
                        self.emit('collection.removed', collection);
                    });
                    break;            
            }
        }
    };
    
    return mixin;
});