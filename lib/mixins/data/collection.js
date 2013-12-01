if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(){
    var mixin = {
        name: 'FluxData/data/collection',
        //called when first mixing in the functionality
        init: function(cfg, callback){
            var self = this;
            var errs = false;
            
            for(var key in cfg){
                if(key!=='type'){
                    if(key=='query'){//deal with it later
                    }else{
                        self.set(key, cfg[key]);
                    }
                }
            }

            if(cfg.query){
                
                if((cfg.query instanceof self.constructor)===false){
                    var queryMixinCfg = {
                        type: 'FluxData/data/query'
                    };

                    for(var queryKey in cfg.query){
                        queryMixinCfg[queryKey] = cfg.query[queryKey];
                    }

                    var query = new self.constructor({
                        mixins:[
                            queryMixinCfg
                        ]
                    });

                    query.once('channel.ready', function(){
                        self.set('query', query);
                        if(callback){
                            callback(errs, self);
                        }
                    });
                }else{
                    self.set('query', cfg.query);
                    if(callback){
                        callback(errs, self);
                    }
                }
            }else{
                if(callback){
                    callback(errs, self);
                }
            }
        },
        count: function(callback){
            var self = this;


        },
        fetchRecordData: function(records, callback){
            var self = this;

            if(!Array.isArray(records)){
                records = [records];
            }

            for(var i=0;i<records.length;i++){
                var record = records[i];
                var localRecord = self.get('records.'+record.get('id'));
                for(var key in localData){
                    record.setValue(key, localData[key]);
                }
            }
        },
        saveRecordData: function(records, callback){
            var self = this;
            if(!Array.isArray(records)){
                records = [records];
            }

            for(var i=0;i<records.length;i++){
                var record = records[i];
                self.set('records.'+record.get('id'), record);
            }
        },
        /**
         * Fetch data from a store, with an optional query
         * @param  {FluxData/data/store}   store    the store to fetch the data from
         * @param  {Function} callback called when the data has been retrieved from the store
         */
        fetch: function(store, query, callback){
            var self = this;

            if((typeof store)=='function'){
                callback = store;
                query = false;
                store = false;
            }

            if((typeof query)=='function'){
                callback = query;
                query = false;
            }

            if(!store){
                store = self.get('store');
                if(!store){

                    self.emit('error', new Error('No store to fetch from'));
                    return;
                }
            }

            if(!query && !self.get('query')){
                
                //create a new query object
                query = new self.constructor({
                    mixins: [
                        {
                            type: 'FluxData/data/query',
                            model: self.get('model')
                        }
                    ]
                });

                self.set('query', query);
                
                query.once('channel.ready', function(){
                    // query.once('results.loaded', function(records){
                    //     self.set('records', records);
                    // });
                    store.query(query, function(err, results){
                        console.log(results);
                        self.set('records', results);
                        self.emit('collection.fetched', self);
                        if(callback){
                            callback(err, results);
                        }
                    });
                });
            }else{

                query = query || self.get('query');
                self.set('query', query);

                store.query(query, function(err, results){
                    self.set('records', results);
                    self.emit('collection.fetched', self);
                    if(callback){
                        callback(err, results);
                    }
                });
            }
        },
        /**
         * for non-queried collections, saves the data to the store
         * @param  {[type]}   store    [description]
         * @param  {Function} callback [description]
         * @return {[type]}            [description]
         */
        sync: function(store, callback){

        },
        //called when something is published to this channel
        publish: function(topic, data){
            switch(topic){
                case 'record':
                    if(self.get('query')){
                        self.emit('error', new Error('Cannot publish Records to read-only Collections'));
                    }else{
                         q
                        console.log('adding/updating record');
                    }
                    break;
            }
        }
    };
    
    return mixin;
});