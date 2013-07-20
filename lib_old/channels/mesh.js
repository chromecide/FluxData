;!function(exports, undefined) {
	console.log('INCLUDING MESH');
	//var channelCtr = require(__dirname+'/../channel');
	
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
			
			//if(inLinkFound){
				this.created = new Date();
				//console.log(this.name+' '+this.created+this.created.getMilliseconds());
				if(callback){
					callback(this);
				}	
			//}else{
			//	throw new Error('Mesh does not Contain a MeshIn Link');
			//}
		},
		publish: function(topic, entity){
			var thisMesh = this;
			var meshChannels = {};
			if((typeof topic)!='string'){
				entity = topic;
				topic = 'entity';
			}
			
			entity = this.ensureEntity(false, entity);
			
			if(topic=='entity'){
				new thisMesh.constructor({name: 'Publish', type: 'MeshIn'}, function(inChan){
					thisMesh.meshGlobals.Channels.MeshIn = inChan;
					thisMesh.meshGlobals.Channels.MeshIn.on('entity', function(inEntity){
						channelPublisher(thisMesh, this, 'entity', inEntity);
					});
					thisMesh.meshGlobals.Channels.MeshIn.publish('entity', entity);
				});	
			}else{
				if(this.inputs){
					for(var i=0;i<this.inputs.length;i++){
						if(this.inputs[i].name==topic){
							new thisMesh.constructor(this.inputs[i], function(inChan){
								thisMesh.meshGlobals.Channels[inChan.name] = inChan;
								thisMesh.meshGlobals.Channels[inChan.name].on('entity', function(inEntity){
									channelPublisher(thisMesh, this, 'entity', inEntity);
								});
								thisMesh.meshGlobals.Channels[inChan.name].publish('entity', entity);
							});
							continue;
						}
					}
				}
			}
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
				if(!links[i].target_in){
					links[i].target_in = 'entity';
				}
				console.log('     => '+links[i].target+'.'+links[i].target_in);	
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
			
			var isOutput = false;
			if(link.target=='Entity'){
				isOutput = true;
			}else{
				if(thisMesh.outputs){
					for(var i=0;i<thisMesh.outputs.length;i++){
						if(thisMesh.outputs[i].name==link.target){
							isOutput = true;
							continue;
						}
					}	
				}
			}
			
			if(isOutput){
				console.log('GOING OUT');
				channel = thisMesh.meshGlobals.Channels.MeshOut;
				//if(!meshRun[thisMesh.name]){
					meshRun[thisMesh.name]=true;
					if(link.source==event){
						console.log(link);
						thisMesh.emit(link.output?link.output:link.source, entity);
					}
				//}else{
				//	console.log('MESH FINISHED');
				//}
				
				//linkLoop();
			}else{
				var channelCfg = getChannel(thisMesh.channels, link.target);
				//TODO: PROCESS ATTRIBUTE LINKS FOR THE CHANNEL
				// we can do this by modifying the configuration object before we create the channel
				
				//see if the channel is a meshGlobal
				var channel = thisMesh.meshGlobals.Channels[channelCfg.name];
				
				if(channel){
					console.log('reusing global');
					if(link.source==event){
						channel.publish(link.target_in, entity);	
					}
				}else{
					
					new thisMesh.constructor(channelCfg, function(channel){
						
						if(channel.meshGlobal){
							var channel = thisMesh.meshGlobals.Channels[channel.name] = channel;
						}
						
						channel.onAny(function(ent){
							channelPublisher(thisMesh, this, this.event, ent);
						});
						
						if(link.source==event){
							console.log(link.target_in);
							channel.publish(link.target_in, entity);	
						}else{
							console.log('not publishing');
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