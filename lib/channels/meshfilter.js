;!function(exports, undefined) {
	var channelCtr = require(__dirname+'/../channel');
	
	var channel = {
		name: 'meshfilter',
		meshGlobals:{
			Channels:{}
		},
		init: function(callback){
			
			var thisMesh = this;
			var inLinkFound = false;
			var outLinkFound = false;
			
			for(var i=0;i<thisMesh.links.length;i++){
				var link = thisMesh.links[i];
				if(link.name=='MeshIn'){
					inLinkFound = true;
				}else{
					if(link.name=='MeshOut'){
						outLinkFound = false;
					}else{
						var chan = getChannel(link.name).meshGlobal; 
						if(chan && chan.meshGlobal===true){
							new channelCtr(chan, function(chan){
								thisMesh.meshGlobals.Channels[chan.name] = chan;
							});
						}
					}
				}
			}
			
			if(this.entities){
				for(var key in this.entities){
					this.entities[key] = this.ensureEntity(false, this.entities);
				}	
			}
			
			
			if(inLinkFound){
				if(callback){
					console.log('calling back');
					callback(this);
				}	
			}else{
				throw new Error('Mesh does not Contain a MeshIn Link');
			}
		},
		publish: function(entity){
			var thisMesh = this;
			var meshChannels = {};
			
			this.filterEntity = this.ensureEntity(false, entity);
			
			new channelCtr.Channel('MeshIn', {name: 'MeshIn'}, function(inChan){
				thisMesh.meshGlobals.Channels.MeshIn = inChan;
				new channelCtr.Channel('MeshOut', {name: 'MeshOut'}, function(outChan){
					thisMesh.meshGlobals.Channels.MeshOut = outChan;
					
					thisMesh.meshGlobals.Channels.MeshOut.onAny(function(entity){
						thisMesh.emit(this.event, entity);
					});
					
					thisMesh.meshGlobals.Channels.MeshIn.on('entity', function(inEntity){
						channelPublisher(thisMesh, this, 'entity', inEntity);
					});
					
					thisMesh.meshGlobals.Channels.MeshIn.publish(entity);
				});
			});
		}
	}
	
	function channelPublisher(thisMesh, source, event, entity){
		console.log(source.name, event);
		var links = getLinks(thisMesh.links, source.name);
		
		function linkLoop(){
			if(links.length==0){//all links have been created, and published to
				return;
			}	
			
			var link = links.shift();
			
			if(!link.source){
				link.source = 'entity';
			}
			
			if(link.target=='MeshOut'){
				channel = thisMesh.meshGlobals.Channels.MeshOut;
				
				if(link.source==event){
					//channel.emit(link.source, thisMesh.filterEntity);
					channel.emit(link.output?link.output:link.source, thisMesh.filterEntity);	
				}
				linkLoop();
				
			}else{
				var channelCfg = getChannel(thisMesh.channels, link.target);
				
				if(channelCfg.meshGlobal===true){
					var channel = thisMesh.meshGlobals.Channels[channelCfg.name];
					if(!channel){
						new channelCtr.Channel(channelCfg, function(channel){
							
							thisMesh.meshGlobals.Channels[channelCfg.name] = channel;
								
							channel.onAny(function(ent){
								channelPublisher(thisMesh, this, this.event, ent);
							});
							
							if(link.source==event){
								channel.publish(entity);	
							}
							
							linkLoop();	
						});
					}

				}else{
					new channelCtr.Channel(channelCfg, function(channel){
						channel.onAny(function(ent){
							channelPublisher(thisMesh, this, this.event, ent);
						});
						
						if(link.source==event){
							channel.publish(entity);	
						}
						linkLoop();	
					});
				}
				
				
			}
		}
		linkLoop();
	}
	
	function getChannel(channels, name){
		for(var i=0;i<channels.length;i++){
			if(channels[i].name==name){
				return channels[i];
			}
		}
		
		return false;
	}
	
	function getLinks(links, targetName){
		var returnLinks = [];
		for(var i=0;i<links.length;i++){
			var link = links[i];
			if(link.name==targetName){
				returnLinks.push(link);
			}
		}
		
		return returnLinks;
	}
	
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return channel;
		});
	} else {
		exports.Channel = channel;
	}

}(typeof process !== 'undefined' && typeof process.title !== 'undefined' && typeof exports !== 'undefined' ? exports : window);