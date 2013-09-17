if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(){
    var mixin = {
        collection: {
            findRecords: function(query, callback){
                var self = this;

                var errs = [];
                


                if(callback){
                    if(errs.length===0){
                        errs = false;
                    }
                    
                    callback(errs, record);
                }
            },
            syncRecords: function(records, callback){
                var self = this;

                var errs = [];
                
                //if no records were supplied, keep on moving
                if(records && records.length>0){
                    for (var i = records.length - 1; i >= 0; i--) {
                        var record = records[i];

                        var changes = record.getChanges();

                        
                    }
                }

                if(callback){
                    if(errs.length===0){
                        errs = false;
                    }
                    
                    callback(errs, record);
                }
            },
            deleteRecords: function(record, callback){
                var self = this;

                var errs = [];
                
                if(callback){
                    if(errs.length===0){
                        errs = false;
                    }
                    
                    var records = self.records;
                
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

            var adapter = self.get('adapter');

            if(!adapter){
                adapter = {
                    type: 'FluxData/data/adapters/memory'
                };
            }

            self.adapter = new self.constructor(adapter);
            self.adapter.once('channel.ready', function(){
                if(callback){
                    callback(errs, self);
                }
            });
            self.emit('data.collection.ready', cfg);
        },
        //called when something is published to this channel
        publish: function(topic, data){
            var self = this;

            switch(topic){
                case 'query':
                    
                    break;
                case 'save':
                    console.log('saving');
                    console.log(data);
                    break;
                case 'delete':
                    console.log('deleting');
                    console.log(data);
                    break;
            }
        }
    };
    
    return mixin;
});