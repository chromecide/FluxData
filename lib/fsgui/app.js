require(["FluxData/index"], function(FluxData){
	var thisTab = new FluxData.Channel({
		mixins:[
			{
				type: "FluxData/lib/mixins/browser/tab"
			}
		]
	});

	thisTab.on('document.ready', function(){
		//add the control panel menu items
		thisTab.loadCSS('fsgui/css/fsgui.css');
		thisTab.publish('$', {
			selector: '.loader',
			method: 'hide'
		});
		
		var html = '';
		
		html+='<div class="fsgui">';
		html+='<div class="window main"><div class="nav"><ul><li class="mixins">Mixins</li><li class="data">Data</li><li class="save">Save</li><li class="start">Start</li><li class="restart">Restart</li><li class="stop">Stop</li></ul></div></div>';
		html+='<div class="window mixins"><div class="nav"><ul><li class="back">Back</li><li class="add">Add</li></ul></div></div>';
		html+='<div class="window data"><div class="nav"><ul><li class="back">Back</li><li class="add_string">Add String</li><li class="add_number">Add Number</li><li class="add_boolean">Add Boolean</li><li class="add_date">Add Date</li><li class="add_object">Add Object</li></ul></div><ul class="datalist"></ul><button class="save_data">Save</button></div></div>';
		
		thisTab.publish('$', {
			selector: 'body',
			method: 'append',
			args: [
				html
			]
		});
		
		$('.fsgui .window').hide();
		$('.fsgui .main').show();
		
		thisTab.onAny(function(){
			console.log(this.event);
		});
		
		thisTab.on('fsgui.data.add.*', function(data){
			var type = this.event.replace('fsgui.data.add.', '');
			var fieldName = prompt('Field Name:');
			
			if(fieldName){
				var fieldHtml = '';
				switch(type){
					case 'string':
						fieldHtml += '<li><label for="data_'+fieldName+'">'+fieldName+'</label><input type="text" name="data_'+fieldName+'" value="" data-type="string"/></li>';
						break;
					case 'number':
						fieldHtml += '<li><label for="data_'+fieldName+'">'+fieldName+'</label><input type="text" name="data_'+fieldName+'" value="" data-type="number"/></li>';
						break;
					case 'boolean':
						fieldHtml += '<li><label for="data_'+fieldName+'">'+fieldName+'</label><input type="checkbox" name="data_'+fieldName+'" data-type="boolean"/></li>';
						break;
					case 'date':
						fieldHtml += '<li><label for="data_'+fieldName+'">'+fieldName+'</label><input type="text" name="data_'+fieldName+'" value="" data-type="date"/></li>';
						break;
					case 'object':
						fieldHtml += '<li><label for="data_'+fieldName+'">'+fieldName+'</label><input type="text" name="data_'+fieldName+'" value="" data-type="object"/></li>';
						break;
				}
				
				
				$('.datalist').append(fieldHtml);
				
					
			}
		});
		
		$('.fsgui .window .nav .mixins').click(function(){
			thisTab.emit('fsgui.show', {
				window: 'mixins'
			});
		});
		
		$('.fsgui .window .nav .data').click(function(){
			thisTab.emit('fsgui.show', {
				window: 'data'
			});
		});
		
		$('.fsgui .window .nav .back').click(function(){
			thisTab.emit('fsgui.show', {
				window: 'main'
			});
		});
		
		$('.fsgui .window .nav .add_string').click(function(){
			console.log('add string');
			thisTab.emit('fsgui.data.add.string', {
				window: 'main'
			});
		});
		
		$('.fsgui .window .nav .add_number').click(function(){
			thisTab.emit('fsgui.data.add.number', {
				window: 'main'
			});
		});
		
		$('.fsgui .window .nav .add_boolean').click(function(){
			thisTab.emit('fsgui.data.add.boolean', {
				window: 'main'
			});
		});
		
		$('.fsgui .window .nav .add_date').click(function(){
			thisTab.emit('fsgui.data.add.date', {
				window: 'main'
			});
		});
		
		$('.fsgui .window .nav .add_object').click(function(){
			thisTab.emit('fsgui.data.add.object', {
				window: 'main'
			});
		});
		
		$('.fsgui .data .save_data').click(function(){
			var inputs = $('.fsgui input');
			var saveData = {};
			
			for(var i=0;i<inputs.length;i++){
				var fieldName = $(inputs[i]).attr('name');
				var fieldType = $(inputs[i]).attr('data-type');
				var fieldval = $(inputs[i]).val();
				
				if(fieldName.indexOf('data_')==0){
					saveData[fieldName.replace('data_','')] = {
						type: fieldType,
						value: undefined
					}
					
					switch(fieldType){
						case 'string':
							saveData[fieldName.replace('data_','')].value = fieldval;
							break;
						case 'number':
							saveData[fieldName.replace('data_','')].value = fieldval*1;
							break;
						case 'date':
							saveData[fieldName.replace('data_','')].value = fieldval;
							break;
						case 'boolean':
							fieldval = $(inputs[i]).val();
							saveData[fieldName.replace('data_','')].value = fieldval=='on'?true:false;
							break;
						case 'object':
							saveData[fieldName.replace('data_','')].value = fieldval;
							break;
					}	
				}
				
			}
			
			$.post('fsgui/data', saveData, function(data){
				data = JSON.parse(data);
				if(data.success==true){
					alert('saved');
				}else{
					console.log(data);
					alert(data.err);
				}
			});
		});
	});
	
	thisTab.on('fsgui.show', function(data){
		switch(data.get('window')){
			case 'main':
				thisTab.publish('$', {
					selector: '.fsgui .window',
					method: 'hide'
				});
				
				thisTab.publish('$', {
					selector: '.fsgui div.main',
					method: 'show'
				});
				break;
			case 'mixins':
				thisTab.publish('$', {
					selector: '.fsgui .window',
					method: 'hide'
				});
				
				thisTab.publish('$', {
					selector: '.fsgui div.mixins',
					method: 'show'
				});
				break;
			case 'data':
				thisTab.publish('$', {
					selector: '.fsgui .window',
					method: 'hide'
				});
				thisTab.publish('$', {
					selector: '.fsgui div.data',
					method: 'show'
				});
				
				$.getJSON('data', function(data) {
					$('.datalist li').remove();
					for(var key in data){
						
						console.log(typeof data[key]);
						switch(typeof data[key]){
							case 'string':
								$('.datalist').append('<li><label for="data_'+key+'">'+key+'</label><input type="text" name="data_'+key+'" value="'+data[key]+'"/></li>');
								break;
							case 'boolean':
								$('.datalist').append('<li><label for="data_'+key+'">'+key+'</label><input type="checkbox" name="data_'+key+'" data-type="boolean" checked="'+data[key]+'"/></li>');
								break;
							case 'number':
								$('.datalist').append('<li><label for="data_'+key+'">'+key+'</label><input type="text" name="data_'+key+'" value="'+data[key]+'"/></li>');
								break;
							case 'object':
								
								break;
							default: 
								console.log(typeof data[key]);
								break;
						}
						
					}
				});
				
				break;
		}
	});
});
