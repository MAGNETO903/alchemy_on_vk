
// инициализируем SDK

if (PLATFORM_TYPE != 'yandex') {
    load_progress()
}

$(document).ready(function() {
	
	
})

window.onload = function() {
	//console.log('BLAZY')
	//var bLazy = new Blazy();
	//resize_screen();
	console.log('игра загружена')
	console.log(performance.now() - start_time)
	console.log(game.sdk)
	//show_interistial_ad();
	game.launch_time = Date.now();



	// спрайты прогружены, прогресс считан, можно обновлять всё

	// дату последнего визита + счётчик дней
	var cur_date = dayjs().format('YYYY-MM-DD');

	// похоже игрок вернулся, ура!
	if (cur_date != game.data.last_visit_date) {
		game.data.last_visit_date = cur_date;
		game.data.day_counter += 1
	}
	
	//start_game();
	//open_send_report_block();
	//open_daily_reward_block();
	//open_achievement_block();
	//open_event_daily_reward_block();
	//open_new_element_block();
	//get_hint();
	//open_recipe_book();
	//open_hint2_block();
	//open_update_block();
	music_1_sound.play();
	$('#game_viewport_block').css('display', 'none')

	//open_about_game_block();
	setTimeout(function() {
		$('#preloader_block').fadeOut()
		setTimeout(function() {
			$('#main_menu_block').fadeIn()
			ym(82849870,'reachGoal','waited_for_game_loading')
		}, 500)
	}, 500)
	//alert('попробуем инициализировать')

	init_sdk();
	set_lang(cur_lang)
	load_progress();
	resize_screen();
	
	
}	



$('body').mousedown(function(event) {
	game.mouse_down = true
})

$('body').mouseup(function(event) {
	game.mouse_down = false
})


if (game.user_type == 'pc') {
	$('.corner_block').mousedown(function(event) {
		game.mouse_down = true
		
		//console.log('mouse', game.mouse_x, game.mouse_y)

		game.new_element = new myElement(Number(event.target.id[event.target.id.length-1]), game.mouse_x, game.mouse_y)
		game.new_element.select(event);
		game.elements.push(game.new_element)
	})

	$('body').mouseup(function(event) {
		if (game.selected_element != 0) {
			game.selected_element.pixi_sprite.scale.set(game.selected_element.normal_scale)
			var dist_to_hole = Math.sqrt(Math.pow(game.selected_element.x - game.black_hole.x, 2) + Math.pow(game.selected_element.y - game.black_hole.y, 2))
			if (dist_to_hole < game.black_hole.width * 0.3) {
				game.selected_element.destroyed = true
				game.black_hole.alpha = 0
			}
		}
		if (game.new_element != 0) {
			var dist_to_hole = Math.sqrt(Math.pow(game.new_element.x - game.black_hole.x, 2) + Math.pow(game.new_element.y - game.black_hole.y, 2))

			if (dist_to_hole < game.black_hole.width * 0.3) {
				game.new_element.destroyed = true
				game.black_hole.alpha = 0
			}
		}
		game.selected_element = 0;
		game.new_element = 0;
		game.mouse_down = false
		$('#top_text').text(html_texts.top_text[cur_lang])
		var game_viewport_block_display = $('#game_viewport_block').css('display')
        $('#game_viewport_block').css('display', 'block')
        $('#game_viewport_block').css('opacity', '0')
        textFit($('#top_text'), {alignVert: true, multiLine: true, maxFontSize: 25})
        $('#game_viewport_block').css('opacity', '1')
        $('#game_viewport_block').css('display', game_viewport_block_display)
        game.black_hole.alpha = 0

		

		
	})

	$('body').mousemove(function(event) {
		game.mouse_x = event.pageX;
		game.mouse_y = event.pageY;

		if (game.new_element != 0) {
			game.new_element.x = game.mouse_x
			game.new_element.y = game.mouse_y
			game.new_element.pixi_sprite.x = game.mouse_x 
			game.new_element.pixi_sprite.y = game.mouse_y
			
		}
		if (game.selected_element != 0) {
			game.selected_element.x = game.mouse_x + game.shift_x
			game.selected_element.y = game.mouse_y + game.shift_y
			game.selected_element.pixi_sprite.x = game.mouse_x + game.shift_x;
			game.selected_element.pixi_sprite.y = game.mouse_y + game.shift_y;
			
		}
	})
} else {
	
	$(document).bind('touchstart', function(e) {
		var touches = e.originalEvent.touches || e.originalEvent.changedTouches;
		var touch = touches[touches.length-1]
		var x = touch.pageX;
		var y = touch.pageY;
		game.mouse_x = x;
		game.mouse_y = y;
        game.mouse_down = true;

        touch_start_x = x;
        touch_start_y = y;
      	touch_delta_x = 0;
      	touch_delta_y = 0;  
	})
	

	$(".corner_block").bind('touchstart', function(e) {
		var touches = e.originalEvent.touches || e.originalEvent.changedTouches;
		var touch = touches[touches.length-1]
		var x = touch.pageX;
		var y = touch.pageY;
		game.mouse_x = x;
		game.mouse_y = y;
        game.mouse_down = true;
		
        //console.log(e)

        game.new_element = new myElement(Number(e.target.id[e.target.id.length-1]), game.mouse_x, game.mouse_y)
		game.new_element.select();

		game.elements.push(game.new_element)
		
    })

	$(document).bind('touchend', function() {
		if (game.selected_element != 0) {
			game.selected_element.pixi_sprite.scale.set(game.selected_element.normal_scale)
			var dist_to_hole = Math.sqrt(Math.pow(game.selected_element.x - game.black_hole.x, 2) + Math.pow(game.selected_element.y - game.black_hole.y, 2))
			if (dist_to_hole < game.black_hole.width * 0.3) {
				game.selected_element.destroyed = true
				game.black_hole.alpha = 0
			}
		}
		if (game.new_element != 0) {
			var dist_to_hole = Math.sqrt(Math.pow(game.new_element.x - game.black_hole.x, 2) + Math.pow(game.new_element.y - game.black_hole.y, 2))

			if (dist_to_hole < game.black_hole.width * 0.3) {
				game.new_element.destroyed = true
				game.black_hole.alpha = 0
			}
		}
		game.selected_element = 0;
		game.new_element = 0;
		game.mouse_down = false

		
		if (game.user_type == 'sberportal') {
			game.selected_element = 0;
			game.new_element = 0;
			game.mouse_down = false
			$('#top_text').text(html_texts.top_text[cur_lang])
			var game_viewport_block_display = $('#game_viewport_block').css('display')
	        $('#game_viewport_block').css('display', 'block')
	        $('#game_viewport_block').css('opacity', '0')
	        textFit($('#top_text'), {alignVert: true, multiLine: true, maxFontSize: 25})
	        $('#game_viewport_block').css('opacity', '1')
	        $('#game_viewport_block').css('display', game_viewport_block_display)
	        game.black_hole.alpha = 0
		} else {
			$('#top_text').text('')
			 var game_viewport_block_display = $('#game_viewport_block').css('display')
	        $('#game_viewport_block').css('display', 'block')
	        $('#game_viewport_block').css('opacity', '0')
	        textFit($('#top_text'), {alignVert: true, multiLine: true, maxFontSize: 25})
	        $('#game_viewport_block').css('opacity', '1')
	        $('#game_viewport_block').css('display', game_viewport_block_display)
	        game.black_hole.alpha = 0
		}
       
	})

	$(document).bind('touchmove', function(e) {
		var touches = e.originalEvent.touches || e.originalEvent.changedTouches;
		var touch = touches[touches.length-1]
		var x = touch.pageX;
		var y = touch.pageY;
		game.mouse_x = x;
		game.mouse_y = y;
		 touch_delta_x = touch_start_x - x;
		 touch_delta_y = touch_start_y - y;

		

		if (game.new_element != 0) {
			game.new_element.x = game.mouse_x
			game.new_element.y = game.mouse_y
			game.new_element.pixi_sprite.x = game.mouse_x 
			game.new_element.pixi_sprite.y = game.mouse_y	
		}
		if (game.selected_element != 0) {
			game.selected_element.x = game.mouse_x + game.shift_x
			game.selected_element.y = game.mouse_y + game.shift_y
			game.selected_element.pixi_sprite.x = game.mouse_x + game.shift_x;
			game.selected_element.pixi_sprite.y = game.mouse_y + game.shift_y;			
		}
	})

	

	$(window).on("scroll", function() {
	    scrolling = true;
	    endScrolling = window.setTimeout(function() {
	        scrolling = false;
	        window.clearTimeout(endScrolling);
	    }, 20);
	});
}


$(document).click( function(e) {
	/*
	if (game.hint_level != 0) {
	    if ( $(e.target).closest('#inner_hint_block2').length ) {
	        // клик внутри элемента 
	        return;
	    }
	    // клик снаружи элемента 
	    $('#hint_block2').fadeOut();
	}
	*/
});

//Start the game loop 
game.pixi_app.ticker.add(delta => gameLoop(delta));

var iter=0;
var iter_2 = 0;
function gameLoop(delta) {

	if (game.game_ready) {

		// выявить пересечения элементов
		if (game.selected_element != 0 || game.new_element != 0) {
			game.black_hole.alpha = 0.5
			game.black_hole.scale.set(game.black_hole_normal_scale, game.black_hole_normal_scale)	
		}
		for (var i=0; i < game.elements.length; i++) {
			//var main_obj = game.elements[i]
			var dist_to_hole = Math.sqrt(Math.pow(game.elements[i].x - (game.black_hole.x ), 2) + Math.pow(game.elements[i].y - (game.black_hole.y), 2))

			if (dist_to_hole < game.black_hole.width * 0.3 && game.elements[i].destroyed == false) {
				game.black_hole.alpha = 1
				game.black_hole.scale.set(game.black_hole_normal_scale+0.05, game.black_hole_normal_scale+0.05)
			}
			for (var j=0; j < game.elements.length; j++) {
				if (i != j) {
					var product = merge(game.elements[i], game.elements[j]);

					if (product != false) {

						game.elements[i].destroyed = true
						game.elements[j].destroyed = true

						var new_el_x = (game.elements[i].x + game.elements[j].x)/2
						var new_el_y = (game.elements[i].y + game.elements[j].y)/2

						game.elements.push(new myElement(product, new_el_x, new_el_y))
						console.log(product, game.catalog, game.catalog.includes(product))
						if (game.catalog.includes(product) == false) {
							add_to_catalog(product)
							add_recipe(product)
							//resize_screen();
							//game.data.loaded_catalog.push(product)
							window.localStorageFallback.setItem('catalog_', JSON.stringify(game.data.loaded_catalog))
							if (game.user_type == 'pc'  || game.user_type == 'sberportal') {
					            $('#bottom_text').text(html_texts.bottom_text[cur_lang] + game.catalog.length)
					            textFit($('#bottom_text'), {alignVert: true, multiLine: true, maxFontSize: 25})
					                    
					        } else if (game.user_type == 'mobile') {
					            $('#bottom_text').text(game.catalog.length + '/'+ COMMON_ELEMENTS_AMOUNT)
					            textFit($('#bottom_text'), {alignVert: true, multiLine: true, maxFontSize: 25})
					        }

					        var new_element_block_display = $('#new_element_block').css('display')
					        $('#new_element_block').css('display', 'block')
					        $('#new_element_block').css('opacity', '0')

					        $('#new_element_element').attr('src', 'images/elements/'+product+'.webp')

					        $('#new_element_name').text(all_elements[product][cur_lang])

					        textFit($('#new_element_name'), {alignVert: true, multiLine: true, maxFontSize: 25})

					        $('#new_element_block').css('display', new_element_block_display)
					        $('#new_element_block').css('opacity', '1')

					        setTimeout(function() {
					        	open_new_element_block();
					        }, 500)

					        var achievement_block_display = $('#achievement_block').css('display')
    						$('#achievement_block').css('display', 'block')
    						$('#achievement_block').css('opacity', '0')
    						
    						$('#achievement_text').css('display', 'block')

    						if (game.catalog.length == 5) {
    							ym(82849870,'reachGoal','5_elements')
    						}

    						if (game.catalog.length == 15) {
    							ym(82849870,'reachGoal','15_elements')
    						}

    						if (game.catalog.length == 60) {
    							ym(82849870,'reachGoal','60_elements')
    						}

    						if (game.catalog.length == 75) {
    							ym(82849870,'reachGoal','75_elements')
    						}

    						if (game.catalog.length == 90) {
    							ym(82849870,'reachGoal','90_elements')
    						}

					        if (game.catalog.length == 10) {

					        	ym(82849870,'reachGoal','10_elements')
					        	game.got_achievement = true
					        	$('#achievement_text').text(html_texts.achievement_text_1[cur_lang])
					        	textFit($('#achievement_text'), {verticalAlign: true, maxFontSize: 30, multiLine: true})
					        } else if (game.catalog.length == 20) {
					        	ym(82849870,'reachGoal','20_elements')
					        	game.got_achievement = true
					        	$('#achievement_text').text(html_texts.achievement_text_2[cur_lang])
					        	textFit($('#achievement_text'), {verticalAlign: true, maxFontSize: 30, multiLine: true})
					        } else if (game.catalog.length == 30) {
					        	ym(82849870,'reachGoal','30_elements')
					        	game.got_achievement = true
					        	$('#achievement_text').text(html_texts.achievement_text_3[cur_lang])
					        	textFit($('#achievement_text'), {verticalAlign: true, maxFontSize: 30, multiLine: true})
					        } else if (game.catalog.length == 50) {
					        	ym(82849870,'reachGoal','50_elements')
					        	game.got_achievement = true
					        	$('#achievement_text').text(html_texts.achievement_text_4[cur_lang])
					        	textFit($('#achievement_text'), {verticalAlign: true, maxFontSize: 30, multiLine: true})
					        } else if (game.catalog.length == 80) {
					        	ym(82849870,'reachGoal','80_elements')
					        	game.got_achievement = true
					        	$('#achievement_text').text(html_texts.achievement_text_5[cur_lang])
					        	textFit($('#achievement_text'), {verticalAlign: true, maxFontSize: 30, multiLine: true})
					        } else if (game.catalog.length == 100) {
					        	ym(82849870,'reachGoal','100_elements')
					        	game.got_achievement = true
					        	$('#achievement_text').text(html_texts.achievement_text_6[cur_lang])
					        	textFit($('#achievement_text'), {verticalAlign: true, maxFontSize: 30, multiLine: true})
					        } else if (game.catalog.length == COMMON_ELEMENTS_AMOUNT) {
					        	ym(82849870,'reachGoal','all_elements')
					        	game.got_achievement = true
					        	$('#achievement_text').text(html_texts.achievement_text_7[cur_lang])
					        	textFit($('#achievement_text'), {verticalAlign: true, maxFontSize: 30, multiLine: true})
					        } else if (product == 48) {
					        	ym(82849870,'reachGoal','philosophical_stone')
					        	game.got_achievement = true
					        	$('#achievement_text').text(html_texts.achievement_text_7[cur_lang])
					        	textFit($('#achievement_text'), {verticalAlign: true, maxFontSize: 30, multiLine: true})
					        } 

					        $('#achievement_text').css('display', 'table')
					        $('#achievement_text span').css('display', 'table-cell')
					        $('#achievement_text span').css('vertical-align', 'middle')

					        $('#achievement_block').css('opacity', '1')
					        $('#achievement_block').css('display', achievement_block_display)

					        //get_review();
						}
					}
				}
			}
		}
		/*
		for (var i=0; i < game.elements.length; i++) {
			if (game.elements[i].x < game.winW * 0.00 || game.elements[i].x > game.winW * 1 || game.elements[i].y < game.winH * 0.00 || game.elements[i].y > game.winH * 0.1) {
				game.elements[i].destroyed = true
			}
		}
		*/

		// удалить удаленные элементы
		var i=0
		while (i < game.elements.length) {
			if (game.elements[i].destroyed) {
				game.pixi_app.stage.removeChild(game.elements[i].pixi_sprite)
				game.elements.splice(i, 1)
			}
			i++;
		}

		iter+=1
		//iter_2 += 1
		if (iter == 10) {
			//console.log('saved')
			game.data.elements = []
			for (var i=0; i < game.elements.length; i++) {
				game.data.elements.push({
					"type": game.elements[i].type,
					"x": game.elements[i].x,
					"y": game.elements[i].y
				})
			}

			window.localStorageFallback.setItem('elements_', JSON.stringify(game.data.elements))
			iter = 0;
		}

		//console.log(iter_2)
		if (iter_2 == 60*5) {
			//console.log('покажем рекламу')
			//show_interistial_ad();
			iter_2 = 0
		}
		
	}
}


document.addEventListener("visibilitychange", function(){
	if (document.hidden) {
		music_1_sound.stop()
		music_2_sound.stop()
	} else {
		if (game.muted == false) {
			music_1_sound.play();
		}
	}
});


if (allow_sw == true) {

	function invokeServiceWorkerUpdateFlow(registration) {
	    // TODO implement your own UI notification element
	    open_update_block();
	    //notification.show("New version of the app is available. Refresh now?");
	    //notification.addEventListener('click', () => {
	    $('#update_btn_1').on('click', function() {

	        
	        if (registration.waiting) {
	            // let waiting Service Worker know it should became active
	            registration.waiting.postMessage('SKIP_WAITING')
	        }
	    })

	    $('#update_btn_1').on('touchstart', function() {

	        
	        if (registration.waiting) {
	            // let waiting Service Worker know it should became active
	            registration.waiting.postMessage('SKIP_WAITING')
	        }
	    })
	}


	// check if the browser supports serviceWorker at all
	if ('serviceWorker' in navigator) {
	    // wait for the page to load
	    window.addEventListener('load', async () => {
	        // register the service worker from the file specified
	        const registration = await navigator.serviceWorker.register('sw.js')

	        // ensure the case when the updatefound event was missed is also handled
	        // by re-invoking the prompt when there's a waiting Service Worker
	        if (registration.waiting) {
	            invokeServiceWorkerUpdateFlow(registration)
	        }

	        // detect Service Worker update available and wait for it to become installed
	        registration.addEventListener('updatefound', () => {
	            if (registration.installing) {
	                // wait until the new Service worker is actually installed (ready to take over)
	                registration.installing.addEventListener('statechange', () => {
	                    if (registration.waiting) {
	                        // if there's an existing controller (previous Service Worker), show the prompt
	                        if (navigator.serviceWorker.controller) {
	                            invokeServiceWorkerUpdateFlow(registration)
	                        } else {
	                            // otherwise it's the first install, nothing to do
	                            console.log('Service Worker initialized for the first time')
	                        }
	                    }
	                })
	            }
	        })

	        let refreshing = false;

	        // detect controller change and refresh the page
	        navigator.serviceWorker.addEventListener('controllerchange', () => {
	            if (!refreshing) {
	                window.location.reload()
	                refreshing = true
	            }
	        })
	    })
}

}