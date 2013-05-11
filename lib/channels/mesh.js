;!function(exports, undefined) {
	var channelCtr = require(__dirname+'/../channel');
	
	var channel = {
		name: 'mesh',
		
		init: function(callback){
			console.log('(((((((((((((((((((((((((    NEW '+this.name+'    )))))))))))))))))))))))))');
			var thisMesh = this;
			var inLinkFound = false;
			var outLinkFound = false;
			
			this.meshGlobals = {
				Channels:{}
			}
			
			for(var i=0;i<thisMesh.links.length;i++){
				var link = thisMesh.links[i];
				if(link.name=='MeshIn'){
					inLinkFound = true;
				}else{
					if(link.name=='MeshOut'){
						outLinkFound = false;
					}else{
						/*var chan = getChannel(link.name).meshGlobal; 
						if(chan && chan.meshGlobal===true){
							new channelCtr(chan, function(chan){
								thisMesh.meshGlobals.Channels[chan.name] = chan;
							});
						}*/
					}
				}
			}
			
			if(this.entities){
				for(var key in this.entities){
					this.entities[key] = this.ensureEntity(false, this.entities);
				}	
			}
			
			if(inLinkFound){
				this.created = new Date();
				console.log(this.name+' '+this.created+this.created.getMilliseconds());
				if(callback){
					callback(this);
				}	
			}else{
				throw new Error('Mesh does not Contain a MeshIn Link');
			}
		},
		publish: function(entity){
			var thisMesh = this;
			var meshChannels = {};
			console.log(thisMesh.name+' : Publish');
			entity = this.ensureEntity(false, entity);
			
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
	
	function getChannelByName(name){
		
	}
	
	function linkAttributes(thisMesh, source, event, entity){
		var links = thisMesh.attributeLinks;
		console.log(links);
		
	}
	var meshRun = {};
	
	function channelPublisher(thisMesh, source, event, entity){
		console.log('  '+thisMesh.name+' : '+source.name+' : '+event);
		
		var links = getLinks(thisMesh.links, source.name);
		for(var i=0;i<links.length;i++){
			if(links[i].source==event){
				console.log('     => '+links[i].target);	
			}
		}
		console.log('--------------------');
		function linkLoop(){
			if(links.length==0){//all links have been created, and published to
				return;
			}	
			
			
			var link = links.shift();
			
			if(!link.source){
				link.source = 'entity';
			}
			
			if(link.source!=event){
				linkLoop();
				return;
			}
			
			if(link.target=='MeshOut'){
				channel = thisMesh.meshGlobals.Channels.MeshOut;
				//if(!meshRun[thisMesh.name]){
					meshRun[thisMesh.name]=true;
					if(link.source==event){
						channel.emit(link.output?link.output:link.source, entity);
					}
				//}else{
				//	console.log('MESH FINISHED');
				//}
				
				//linkLoop();
			}else{
				var channelCfg = getChannel(thisMesh.channels, link.target);
				//TODO: PROCESS ATTRIBUTE LINKS FOR THE CHANNEL
				// we can do this by modifying the configuration object before we create the channel
				console.log(thisMesh.name+' '+thisMesh.created+' '+thisMesh.created.getMilliseconds());
				console.log(channelCfg);
				if(channelCfg.meshGlobal===true){
					console.log(thisMesh.meshGlobals);
					var channel = thisMesh.meshGlobals.Channels[channelCfg.name];
					//var channel = thisMesh.channels[channelCfg.name];
					if(!channel){
						console.log('GBL: '+channelCfg.name);
						console.log(channelCfg);
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
					}else{
						console.log('((((((((((((((((((( REU: '+channelCfg.name+')))))))))))))))))))');
						console.log(thisMesh.created+' - '+thisMesh.created.getMilliseconds());
						if(link.source==event){
							channel.publish(entity);	
						}
						linkLoop();
					}

				}else{
					console.log('CRT: '+channelCfg.name);
					
					new channelCtr.Channel(channelCfg, function(channel){
						var attrLinks = getAttributeLinks(thisMesh.attributeLinks, channel.name);
						
						/*for(var i=0;i<attrLinks.length;i++){
							console.log(attrLinks[i]);
							//channel.set(attrLinks[i].attribute, )
						}*/
						
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
	
	
	function getAttributeLinks(links, targetName){
		//console.log('finding attr links: '+targetName);
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