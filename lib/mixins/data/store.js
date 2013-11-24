if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['./model', './collection'], function(modelMixin, collectionMixin){
    var mixin = {
        //called when first mixing in the functionality
        init: function(cfg, callback){
            var self = this;
            var errs = false;
            var models = [];

            for(var key in cfg){
                if(key==='models'){
                    models = cfg.models;
                }else{
                    self.set(key, cfg[key]);
                }
            }

            if(!self.get('models')){
                self.set('models', {});
            }

            function modelLoop(cb){
                var model = models.shift();
                if(!model){
                    if(cb){
                        cb();
                    }
                    return;
                }

                self.addModel(model, function(){
                    if(cb){
                        cb();
                    }
                });
            }
            modelLoop(function(){
                if(callback){
                    callback(errs, self);
                }
            });
        },
        //called when something is published to this channel
        publish: function(topic, data){
            
        },
        addModel: function(model, callback){
            var self = this;
            if((model instanceof self.constructor)===false){
                if(!model.mixins){
                    model.mixins = [
                        {
                            type: modelMixin
                        }
                    ];
                }

                model = new self.constructor(model);
            }
            
            self.set('models.'+model.get('name'), model);

            if(callback){
                callback();
            }
        },
        removeModel: function(model, callback){
            var self = this;
            if(model instanceof self.constructor){
                model = model.get('name');
            }

            self.remove('models.'+model);

            if(callback){
                callback();
            }
        },
        query: function(query, callback){

        },
        fetch: function(){
            console.log('FETCHING');
        },
        sync: function(models, callback){
            var self = this;
            if((typeof models)=='function'){
                callback = models;
                models = false;
            }

            models = models || self.get('models');

            var modelList = [];

            for(var modelName in models){
                modelList.push(models[modelName]);
            }

            function newModelLoop(cb){
                var model = modelList.shift();

                if(!model){
                    if(cb){
                        cb();
                    }
                    return;
                }

                //new collections
                if(!self.get('collections.'+model.get('name'))){
                    var newCollection = new self.constructor({
                        mixins: [
                            {
                                type: collectionMixin,
                                model: model,
                                store: self
                            }
                        ]
                    });
                    model.set('collection', newCollection);
                    self.set('collections.'+model.get('name'), newCollection);
                }

                newModelLoop(cb);
            }

            var collectionList = [];
            var collections = self.get('collections');

            for(var key in collections){
                collectionList.push(key);
            }

            function removedModelLoop(cb){
                var collectionName = collectionList.shift();

                if(!collectionName){
                    if(cb){
                        cb();
                    }
                    return;
                }

                if(!self.get('models.'+collectionName)){
                    self.remove('collections.'+collectionName);
                }

                newModelLoop(cb);
            }

            newModelLoop(function(){
                removedModelLoop(function(){
                    if(callback){
                        callback();
                    }
                });
            });
        }
    };
    
    return mixin;
});