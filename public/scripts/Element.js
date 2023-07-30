var myElement = function(type, x, y, add_to_stage = true) {
	var main_obj = this;
	this.type = type;
	this.x = x;
	this.y = y;
	this.id = generate_id();
	this.destroyed = false
	this.pointer_down = false
	this.last_click_time = 0;
    
    //sprite.addListener('pointerupoutside', );
    
    this.select = function(e='none') {
    	if (game.user_type == 'pc' || game.user_type == 'sberportal') {
    		$('#top_text').text(html_texts.top_text[cur_lang] + all_elements[this.type][cur_lang])
        
    	} else if (game.user_type == 'mobile') {
    		$('#top_text').text(all_elements[this.type][cur_lang])
        
    	}
    	textFit($('#top_text'), {alignVert: true, multiLine: true, maxFontSize: 25})
        game.black_hole.alpha = 0.5
    	//console.log('up')
    	
    	game.selected_element = this
		this.pointer_down = true
		
		this.pixi_sprite.bringToFront();

		this.pixi_sprite.scale.set(this.select_scale)


		
		if ((game.user_type == 'mobile' || game.user_type == 'sberportal') && e != 'none') {
			game.mouse_x = e.data.originalEvent.changedTouches[0].clientX;
			game.mouse_y = e.data.originalEvent.changedTouches[0].clientY;
		}
		
		game.shift_x = this.x - (game.mouse_x) 
		game.shift_y = this.y - (game.mouse_y)

		//$('#top_text').text(html_text.game_viewport_top_text[game.cur_lang] + all_elements[main_obj.type][game.cur_lang])
		//save_elements_pos()
	    if (Date.now() - this.last_click_time < 300 && Date.now() - main_obj.last_click_time > 100) {
	    	game.elements.push( new myElement(this.type, this.x + this.width*0.75, this.y + this.height*0.75) )
	    	//this.pixi_sprite.scale.set(main_obj.normal_scale)

	    }
	    this.last_click_time = Date.now()
    }

    this.get_info = function() {
    	return {
    		"type": this.type,
    		"x": this.x,
    		"y": this.y,
    		"id": this.id,
    		"destroyed": this.destroyed,
    		"pointer_down": this.pointer_down,
    		"last_click_time": this.last_click_time
    	}
    }

	this.add_to_stage = function() {
		try {
			var texture = new PIXI.Texture(PIXI.Loader.shared.resources[this.type].texture)
			//var texture = PIXI.Texture.from('fire_200.png')
			var sprite = new PIXI.Sprite(texture)

			var zoom = (Math.min(game.winW, game.winH) / 7) / 175
			if (game.user_type == 'mobile') {
				zoom = (Math.min(game.winW, game.winH) / 5) / 175
			}

			zoom = Math.min(zoom, 1)
			
			this.width = texture.width*zoom
			this.height = texture.height*zoom
			
			sprite.scale.set(zoom, zoom)
			sprite.anchor.set(0.5)

			this.x = x
			this.y = y

			this.select_scale = zoom+0.1
			this.normal_scale = zoom

			sprite.x = x
			sprite.y = y
			
			sprite.interactive = true
			sprite.buttonMode = true

			this.pixi_sprite = sprite

			this.pixi_sprite.addListener('pointerdown', function(e) {

				main_obj.select(e);
				/*
				var real_nearest_element = search_nearest_element();

				
				if (real_nearest_element.id == main_obj.id) {
					//main_obj.pixi_sprite.scale.set(main_obj.pixi_sprite.scale._x + 0.1)
					
				} else {
					real_nearest_element.select(e)
				}
				*/
				
		    	
			});
			
		    this.pixi_sprite.addListener('pointerup', function() {
		    	//console.log('down')
		    	
		    	main_obj.pixi_sprite.scale.set(main_obj.normal_scale)
				
		    	main_obj.pointer_down = false

		    	var dist_to_hole = Math.sqrt(Math.pow(main_obj.x - (game.black_hole.x), 2) + Math.pow(main_obj.y - (game.black_hole.y), 2))
		    	
				if (dist_to_hole < game.black_hole.width * 0.3) {
					main_obj.destroyed = true
					game.black_hole.alpha = 0
				}

		    });
		    game.pixi_app.stage.addChild(this.pixi_sprite)
		} catch (e) {
			console.log(e)
			PIXI.Loader.shared.add(String(this.type), ('./images/elements/'+String(this.type)+'.webp'))
			PIXI.Loader.shared.load(function() {

				var texture = new PIXI.Texture(PIXI.Loader.shared.resources[this.type].texture)
				
				var sprite = new PIXI.Sprite(texture)

				var zoom = (Math.min(game.winW, game.winH) / 7) / 175
				if (game.user_type == 'mobile') {
					zoom = (Math.min(game.winW, game.winH) / 5) / 175
				}

				zoom = Math.min(zoom, 1)
				
				this.width = texture.width*zoom
				this.height = texture.height*zoom
				
				sprite.scale.set(zoom, zoom)
				sprite.anchor.set(0.5)

				this.x = x
				this.y = y

				this.select_scale = zoom+0.1
				this.normal_scale = zoom

				sprite.x = x
				sprite.y = y
				
				sprite.interactive = true
				sprite.buttonMode = true

				this.pixi_sprite = sprite

				this.pixi_sprite.addListener('pointerdown', function(e) {

					main_obj.select(e);
					/*
					var real_nearest_element = search_nearest_element();

					
					if (real_nearest_element.id == main_obj.id) {
						//main_obj.pixi_sprite.scale.set(main_obj.pixi_sprite.scale._x + 0.1)
						
					} else {
						real_nearest_element.select(e)
					}
					*/
					
			    	
				});
				
			    this.pixi_sprite.addListener('pointerup', function() {
			    	//console.log('down')
			    	
			    	main_obj.pixi_sprite.scale.set(main_obj.normal_scale)
					
			    	main_obj.pointer_down = false
			    	var dist_to_hole = Math.sqrt(Math.pow(main_obj.x - game.black_hole.x, 2) + Math.pow(main_obj.y - game.black_hole.y, 2))

					if (dist_to_hole < game.black_hole.width * 0.3) {
						main_obj.destroyed = true
						game.black_hole.alpha = 0
					}

			    });
			    game.pixi_app.stage.addChild(this.pixi_sprite)
			})
        
		}
		
		
	}
	
	if (add_to_stage) {
    	this.add_to_stage();	
    }
}



