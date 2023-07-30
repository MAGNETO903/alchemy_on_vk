var start_game = function() {
	$('#main_menu_block').fadeOut()
	$('#game_viewport_block').fadeIn()
	var cur_date = dayjs().format('YYYY-MM-DD');
	game.data.last_visit_date = window.localStorageFallback.getItem('last_visit_date_')

    console.log(game.data.last_visit_date, cur_date, game.data.last_visit_date != cur_date)

    if (game.data.last_visit_date != cur_date) {
        game.daily_reward_shown = false
    } else {
        game.daily_reward_shown = true
    }

    if (game.data.last_visit_date == undefined) {
        game.data.last_visit_date = cur_date;
    }
   

    game.data.day_counter = Number(window.localStorageFallback.getItem('day_counter_'))

    if (game.data.day_counter == undefined) {
        game.data.day_counter = 0;
    }

    game.data.day_counter += 1;



    if (cur_date == '2022-04-01') {
    	game.is_event = true
    	game.event_day_counter = 1
    	if (game.bonus_catalog.includes('Spring_day1_1') == false) {
    		game.daily_reward_shown = false
    	}
    } else if (cur_date == '2022-04-02') {
    	game.is_event = true
    	game.event_day_counter = 2
    	if (game.bonus_catalog.includes('Spring_day2_1') == false) {
    		game.daily_reward_shown = false
    	}
    } else if (cur_date == '2022-04-03') {
    	game.is_event = true
    	game.event_day_counter = 3
    	if (game.bonus_catalog.includes('Spring_day3_1') == false) {
    		game.daily_reward_shown = false
    	}
    } else if (cur_date == '2022-04-04') {
    	game.is_event = true
    	game.event_day_counter = 4
    	if (game.bonus_catalog.includes('Spring_day4_1') == false) {
    		game.daily_reward_shown = false
    	}
    }



    setTimeout(function() {


		if (game.daily_reward_shown == false) {
			//console.log('6238472938')
			game.daily_reward_shown = true
			if (game.is_event) {

				setup_event_daily_reward(game.event_day_counter)
				open_event_daily_reward_block();
				
			} else {
				if ([1,2,3,4,5].includes(game.data.day_counter) || game.bonus_catalog.includes(130) == false) {
					// если день второй, но новый бонус не получен за первый
					if (game.data.day_counter > 1 && game.bonus_catalog.includes(130) == false) {
						game.data.day_counter = 1;
						window.localStorageFallback.setItem('day_counter_', game.data.day_counter)
					} 
					
					setup_daily_reward(game.data.day_counter)
					open_daily_reward_block();
				}
			}
			get_reward();
		}
	}, 100)

	window.localStorageFallback.setItem('last_visit_date_', cur_date)
	window.localStorageFallback.setItem('day_counter_', game.data.day_counter)

	resize_screen();
	if (game.user_type == 'pc' || game.user_type == 'sberportal') {
		$('#bottom_text').text(html_texts.bottom_text[cur_lang] + game.catalog.length)
	} else {
		$('#bottom_text').text(game.catalog.length + '/'+ COMMON_ELEMENTS_AMOUNT)
	}
    textFit($('#bottom_text'), {alignVert: true, multiLine: true, maxFontSize: 25})
}

var back_to_menu = function() {
	$('#main_menu_block').fadeIn()
	$('#game_viewport_block').fadeOut()
}

var open_catalog = function() {
	$('#catalog_block').fadeIn();
}

var close_catalog = function() {
	$('#catalog_block').fadeOut();

	

	show_safe_interistial_ad();
	setTimeout(function() {
		for (var i = 0; i < game.selected_from_catalog.length; i++) {
			var element_type = game.selected_from_catalog[i]
			console.log(element_type)
		 	$('#element_'+element_type+'_tick').css('display', 'none')
	        $('[data-id="'+element_type+'"]').css('opacity', '0.3')
	    }
	    $('.catalog_element_block').css('opacity', '1')
	    $('#catalog_block').css('display', 'none')
	    game.selected_from_catalog = [];
	}, 250)
}

var open_recipe_book = function() {
	$('#recipe_book_block').fadeIn()
}

var close_recipe_book = function() {
	$('#recipe_book_block').fadeOut();
	show_safe_interistial_ad();
}

var open_hint2_block = function() {
	$('#hint_block2').fadeIn()
	textFit($('#hint2_text'), {multiLine: true, maxFontSize: 20})

}

var close_hint2_block = function() {
	$('#hint_block2').fadeOut();
	game.hint_level = 0;
	show_safe_interistial_ad();
}

var open_new_element_block = function() {
	$('#new_element_block').fadeIn()
}

var close_new_element_block = function() {
	$('#new_element_block').fadeOut();
	if (game.got_achievement) {
		game.got_achievement = false
		setTimeout(function() {
			open_achievement_block();
		}, 500)
	} else {
		//if (Date.now() - game.adv_show_last_time > 3*60*1000) {
			//show_sinteristial_ad();
		//}
	}

	if (game.catalog.length == 35) {
		setTimeout(function() {
			get_review();
		}, 25)
	}
	show_safe_interistial_ad();
}

var open_event_daily_reward_block = function() {
	$('#event_daily_reward_block').fadeIn();
}

var close_event_daily_reward_block = function() {
	$('#event_daily_reward_block').fadeOut();
	show_safe_interistial_ad();
}

var open_daily_reward_block = function() {
	if (game.user_type == 'pc' || game.user_type == 'sberportal') {
		$('#daily_reward_block').fadeIn();
	} else {
		$('#mobile_daily_reward_block').fadeIn();
	}
}

var close_daily_reward_block = function() {
	if (game.user_type == 'pc' || game.user_type == 'sberportal') {
		$('#daily_reward_block').fadeOut();
	} else {
		$('#mobile_daily_reward_block').fadeOut();
	}
	show_safe_interistial_ad();
}

var open_achievement_block = function() {
	$('#achievement_block').fadeIn()
}

var close_achievement_block = function() {
	$('#achievement_block').fadeOut()
	show_safe_interistial_ad();
}

var open_about_game_block = function() {
	ym(82849870,'reachGoal','about_game')
	$('#about_game_block').fadeIn()
}

var close_about_game_block = function() {
	$('#about_game_block').fadeOut()
}

var open_how_to_play_block = function() {
	ym(82849870,'reachGoal','tutorial')
	$('#how_to_play_block').fadeIn()
}

var close_how_to_play_block = function() {
	$('#how_to_play_block').fadeOut()
}

var open_send_report_block = function() {
	ym(82849870,'reachGoal','want_report')
	$('#send_report_block').fadeIn()
}

var close_send_report_block = function() {
	$('#send_report_block').fadeOut()
	show_safe_interistial_ad();
}

var open_update_block = function() {
	$('#update_block').fadeIn()
}

var close_update_block = function() {
	$('#update_block').fadeOut()
	show_safe_interistial_ad();
}

var change_lang = function() {
	if (cur_lang == 'ru') {
		set_lang('en')
		load_progress(true)
		resize_screen();
	} else {
		set_lang('ru')
		load_progress(true)
		resize_screen();
	}
}

var set_lang = function(lang) {
	cur_lang = lang
	if (lang == 'en') {
		$('#change_lang_block').attr('src', 'images/eng_200.webp')
	} else {
		$('#change_lang_block').attr('src', 'images/rus_200.webp')
	}
	document.title = html_texts.title[lang]

	$('#title_img').attr('src', html_texts.title_img_src[lang])
	$('#main_menu_button_1').text(html_texts.main_menu_button_1[lang])
	$('#main_menu_button_2').text(html_texts.main_menu_button_2[lang])
	$('#main_menu_button_3').text(html_texts.main_menu_button_3[lang])
	
	// 

	$('#top_text').text(html_texts.top_text[lang])
	$('#bottom_text').text(html_texts.bottom_text[lang])

	$('#catalog_title').attr('src', html_texts.catalog_title_src[lang])
	$('#catalog_ok_btn_mobile').text(html_texts.ok[lang])

	$('#recipe_book_title').attr('src', html_texts.recipe_book_title_src[lang])
	$('#recipe_book_ok_btn_mobile').text(html_texts.ok[lang])

	$('#hint2_text').html(html_texts.hint2_html_text[lang])
	$('#hint2_title').attr('src', html_texts.hint2_title_src[lang])

	// ЗДЕСЬ НАДО БЫТЬ АККУРАТНЫМ!
	$('#hint_ingredient_1_name').text(html_texts.hint_ingredient_1_name[lang])
	// ЗДЕСЬ НАДО БЫТЬ АККУРАТНЫМ!
	$('#hint_ingredient_2_name').text(html_texts.hint_ingredient_2_name[lang])
	
	$('#hint2_btn_1').text(html_texts.ok[lang])

	// ЗДЕСЬ НАДО БЫТЬ АККУРАТНЫМ!
	$('#hint2_btn_2').html(html_texts.hint2_btn_2_html_text[lang])

	$('#new_element_title').attr('src', html_texts.new_element_title_src[lang])

	$('#new_element_btn').text(html_texts.ok[lang])


	$('#inner_daily_reward_block').css('background', "url('"+html_texts.inner_daily_reward_block_background_src[lang]+"')")
	$('#inner_daily_reward_block').css('background-size', '100%')

	$('#mobile_inner_daily_reward_block').css('background', "url('"+html_texts.mobile_inner_daily_reward_block_background_src[lang]+"')")
	$('#mobile_inner_daily_reward_block').css('background-size', '100%')

	$('#mobile_daily_reward_btn').text(html_texts.mobile_daily_reward_btn_text[lang])
	$("#daily_reward_btn").text(html_texts.mobile_daily_reward_btn_text[lang])

	$('#inner_achievement_block').css("background", "url('"+html_texts.inner_achievement_block_background_src[lang]+"')")
	$('#inner_achievement_block').css('background-size', '100%')

	if (game.user_type == 'pc' || game.user_type == 'sberportal') {
		$('#about_game_text').attr('src', html_texts.about_game_text_src[lang])
	} else if (game.user_type == 'mobile') {
		$('#about_game_text').attr('src', html_texts.about_game_text_mobile_src[lang])
	}

	$('#about_game_ok_btn').text(html_texts.ok[lang])

	if (game.user_type == 'pc' || game.user_type == 'sberportal') {
		$('#how_to_play_text').attr('src', html_texts.how_to_play_text_src[lang])
	} else if (game.user_type == 'mobile') {
		$('#how_to_play_text').attr('src', html_texts.how_to_play_text_mobile_src[lang])
	}

	$('#how_to_play_ok_btn').text(html_texts.ok[lang])

	$('#send_report_title').attr('src', html_texts.send_report_title_src[lang])
	$("#send_report_textarea").attr('placeholder', html_texts.send_report_textarea_placeholder_text[lang])

	$('#send_report_btn_1').text(html_texts.send_report_btn_1_text[lang])
	$('#send_report_btn_2').text(html_texts.send_report_btn_2_text[lang])

	$('#reward_day_1').text(html_texts.reward_day_1_text[lang])
	$('#reward_day_2').text(html_texts.reward_day_2_text[lang])
	$('#reward_day_3').text(html_texts.reward_day_3_text[lang])
	$('#reward_day_4').text(html_texts.reward_day_4_text[lang])
	$('#reward_day_5').text(html_texts.reward_day_5_text[lang])

	$('#daily_reward_element_1_name').text(all_elements[130][lang])
	$('#daily_reward_element_2_name').text(all_elements[131][lang])
	$('#daily_reward_element_3_name').text(all_elements[132][lang])
	$('#daily_reward_element_4_name').text(all_elements[133][lang])
	$('#daily_reward_element_5_name').text(all_elements[134][lang])


}



var open_test_ad = function() {
	$('#test_ad').css('display', 'block')
	$('#test_ad_status').text('Video Ad example ends in ' + SAMPLE_AD_DURATION)
	test_ad_time = 0
	update_test_ad();
}

var update_test_ad = function() {
	if (test_ad_time < SAMPLE_AD_DURATION) {
		$('#test_ad_status').text('Video Ad example ends in ' + (SAMPLE_AD_DURATION-test_ad_time))
		test_ad_time += 1
		setTimeout(update_test_ad, 1000)
	} else {
		close_test_ad();
	}
}

var close_test_ad = function() {
	$('#test_ad').css('display', 'none')
}