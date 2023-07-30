game.winW = $(window).width();
game.winH = $(window).height();


// ПРОПОРЦИИ НЕКОТОРЫХ БЛОКОВ
var proportions = {
    // БЛОК КНОПОК ГЛАВНОГО МЕНЮ
    "main_menu_buttons_block": [1026/768, 768/1026],
    "main_menu_button": [750/142, 142/750],
    "catalog_block": [1067/750, 750/1067],
    "catalog_title": [957/280, 280/957],
    "catalog_element_block": [483/621, 621/483],
    "recipe_middle_block": [1816/622, 622/1816],
    "recipe_right_block": [889/621, 621/889],
    "inner_hint_block2": [1694/1118, 1118/1694],
    "hint2_title": [1044/279, 279/1044],
    "recipes_book_line": [1004/45, 45/1004],
    "hint_block_mobile": [1111/1394, 1394/1111],
    "new_element_block": [1124/825, 825/1124],
    "new_element_title": [1263/279, 279/1263],
    "event_daily_reward_block": [1790/1117, 1117/1790],
    "event_daily_reward_block_mobile": [1111/1394, 1394/1111],
    "daily_reward_block": [1791/1118, 1118/1791],
    "achievement_block": [1124/825, 825/1124],
    "about_game_block": [2430/1605, 1605/2430],
    "mobile_about_game_block": [1091/2187, 2187/1091],
    "mobile_how_to_play_block": [1180/2141, 2141/1180],
    "send_report_title": [1443/280, 280/1443],
    "update_block": [1123/824, 824/1123]
}



function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}

 if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // код для мобильных устройств
    game.user_type = 'mobile';

    game.winW = $(window).width();
    game.winH = $(window).height();

    if (game.winW > game.winH) {
        game.user_type = 'sberportal'
    }
  } else {
    game.user_type = 'pc';
    // код для обычных устройств
}



//Hack to force scroll redraw
function scrollReDraw() {
    $('body').css('overflow', 'hidden').height();
    $('body').css('overflow', 'auto');
}

var noPX = function(string) {
    return string.slice(0, string.length-2);
}

var num = function(variable) {
    return Number(variable);
}

var set_size = function(el_id, w='none', h='none') {
    if (w != 'none') {
	   $(el_id).css('width', w);
	}
    if (h != 'none') {
        $(el_id).css('height', h);
    }
}

var set_pos = function(el_id, left, top) {
    $(el_id).css('left', left);
    $(el_id).css('top', top)
}

var set_pos2 = function(el_id, left='none', top='none') {
    if (left != 'none') {
        $(el_id).css('margin-left', left);
    }
    if (top != 'none') {
        $(el_id).css('margin-top', top)
    }
}

var get_pos = function(selector) {
    var el = $(selector);
    var x = num(noPX(el.css('left')));
    if (isNaN(x)) {
        x = num(noPX(el.css('margin-left')));
    }

    var y = num(noPX(el.css('top')));
    if (isNaN(y)) {
        y = num(noPX(el.css('margin-top')));
    }

	return {"x": x, "y": y}
}

var get_size = function(selector) {
	var el = $(selector);

	return {"x": num(noPX(el.css('width'))), "y": num(noPX(el.css('height')))}
}

var get_center = function(selector) {
    var size = get_size(selector)
    var pos = get_pos(selector)
    return {"x": pos.x + size.x/2, "y": pos.y + size.y/2}
}

var mouse_in_element = function(selector) {
    var pos = get_pos(selector);
    var size = get_size(selector);

    var x1 = pos.x;
    var y1 = pos.y;

    var x2 = x1 + size.x;
    var y2 = y1 + size.y;

    if (x1 < mouse_x && mouse_x < x2 &&
        y1 < mouse_y && mouse_y < y2) {
        return true
    } else {
        return false
    }
}

var get_optimal_font = function(text, block_x, constant, block_y=1000 ) {
    // текст на слова
    var words = text.split(" ")

    var max_len = 0

    for (var i in words) {
        if (words[i].length > max_len) {
            max_len = words[i].length
        }
    }

    
    return Math.min(block_x / max_len * 1.5 * constant, block_y * 0.7  / words.length * constant)
}

var make_disabled = function(selector) {
    var html_disable_block = '<div id="'+selector.slice(1, selector.length)+'_disabled" class="disable_block"></div>'

    $('body').append(html_disable_block)

    var pos = $(selector).offset()

    set_size(selector+'_disabled', get_size(selector).x, get_size(selector).y)
    set_pos(selector+'_disabled',pos.left+num(noPX($(selector).css('border-width'))), pos.top+num(noPX($(selector).css('border-width'))))
}

var make_enabled = function(selector) {
    document.getElementById(selector.slice(1, selector.length)+'_disabled').outerHTML = "";
}

var make_center_x = function(selector) {
    var size = get_size(selector)

    set_pos(selector, game.winW * 0.5 - size.x * 0.5)
}

var setup_main_menu_block = function(winW, winH, user_type) {
    if (user_type == 'pc') {
        // БЛОК ГЛАВНОГО МЕНЮ
        // Компоновка блока кнопок меню
        if (game.winW < game.winH * proportions.about_game_block[1]) {
            var block_w = winW * 0.75
        } else {
            // по высоте
            var block_w = winH * 0.9 * proportions.about_game_block[1]
        }
        set_size('#buttons_menu_block', block_w, block_w * proportions.about_game_block[1])
        make_center_x('#buttons_menu_block')

        // БЛОК ГЛАВНОГО МЕНЮ
        // Заголовок 
        $('#title_img').attr('width', get_size('#buttons_menu_block').x)

        // Блок кнопок
        set_size('#buttons_block', get_size('#buttons_menu_block').x, get_size('#buttons_menu_block').x*proportions.main_menu_buttons_block[1])

        // Сами кнопки
        set_size('.main_menu_button', get_size('#buttons_block').x, get_size('#buttons_block').x * proportions.main_menu_button[1])
        $('.main_menu_button').css('line-height', get_size('.main_menu_button').y + 'px')
        $('.main_menu_button').css('margin-top', (get_size('#buttons_block').y - get_size('.main_menu_button').y*3)/5 + 'px')
        $('.main_menu_button').css('font-size', get_size('.main_menu_button').y * 0.5)

        // Кнопка смены языка
        set_size('#change_lang_block', winH*0.1, winH*0.1)
        set_pos('#change_lang_block', get_size('#change_lang_block').x * 0.5, winH - get_size('#change_lang_block').x * 1.5)

        // Кнопка управления звуком
        set_size('#mute_block', winH*0.1, winH*0.1)
        set_pos('#mute_block', winW - get_size('#mute_block').x * 1.5, winH - get_size('#mute_block').x * 1.5)

        // кнопка поделиться
        set_size('#share_block', winH*0.1, winH*0.1)
        set_pos('#share_block', winW - get_size('#share_block').x * 2.75, winH - get_size('#share_block').x * 1.5)
    } else if (user_type == 'mobile') {
        // БЛОК ГЛАВНОГО МЕНЮ
        // Компоновка блока кнопок меню
        set_size('#buttons_menu_block', winW*0.9, winH)
        make_center_x('#buttons_menu_block')

        // БЛОК ГЛАВНОГО МЕНЮ
        // Заголовок 
        $('#title_img').attr('width', get_size('#buttons_menu_block').x)
        set_pos2('#title_img', 'none', get_size('#title_img').y*0.4)

        // Блок кнопок
        set_size('#buttons_block', get_size('#buttons_menu_block').x, get_size('#buttons_menu_block').x*proportions.main_menu_buttons_block[1])
        set_pos2('#buttons_block', 'none', (game.winH - get_size('#buttons_block').y)/2 - get_size('#title_img').y*1)

        // если эти 2 блока накладывают
        var block_1_pos =  get_size('#title_img').y*0.4
        var block_2_pos = block_1_pos + get_size('#title_img').y + get_pos('#buttons_block').y

        console.log('1, 2', block_1_pos, block_2_pos)

        if (Math.abs(block_2_pos - block_1_pos) < get_size('#title_img').y*0.5) {
            set_pos2('#title_img', 'none', '5%')
            set_pos2('#buttons_block', 'none', '-5%')
        }

        // Сами кнопки
        set_size('.main_menu_button', get_size('#buttons_block').x, get_size('#buttons_block').x * proportions.main_menu_button[1])

        $('.main_menu_button').css('line-height', get_size('.main_menu_button').y + 'px')
        $('.main_menu_button').css('margin-top', (get_size('#buttons_block').y - get_size('.main_menu_button').y*3)/5 + 'px')
        $('.main_menu_button').css('font-size', get_size('.main_menu_button').y * 0.5)

        // Кнопка смены языка
        set_size('#change_lang_block', winH*0.07, winH*0.07)
        set_pos('#change_lang_block', get_size('#change_lang_block').x * 0.25, winH - get_size('#change_lang_block').x * 1.25)

        // Кнопка управления звуком
        set_size('#mute_block', winW*0.1, winW*0.1)
        set_pos('#mute_block', winW - get_size('#mute_block').x * 1.5, winH - get_size('#mute_block').x * 1.5)

        // кнопка поделиться
        set_size('#share_block', winW*0.1, winW*0.1)
        set_pos('#share_block', winW - get_size('#share_block').x * 2.75, winH - get_size('#share_block').x * 1.5)

    }
}

var setup_game_viewport_block = function(winW, winH, user_type) {
    if (user_type == 'pc') {
         // БЛОК ИГРОВОГО ОКНА
        // компоновка кнопок-уголков
        var corner_block_size = Math.min(winW, winH)*0.163
        var margin = corner_block_size * 0.07
        set_size('.corner_block', corner_block_size, corner_block_size)
        set_pos('#basic_el_1', margin, margin)
        set_pos('#basic_el_4', margin, winH - corner_block_size - margin)
        set_pos('#basic_el_3', winW - corner_block_size - margin, margin)
        set_pos('#basic_el_2', winW - corner_block_size - margin, winH - corner_block_size - margin)

        // компоновка блока боковых кнопок
        var side_buttons_block_width = corner_block_size * 0.5
        set_size('#left_side_buttons_block, #right_side_buttons_block', side_buttons_block_width, side_buttons_block_width*5.66)
        set_pos('#right_side_buttons_block', winW - side_buttons_block_width*1.25, (winH - side_buttons_block_width*5.66) * 0.5)
        set_pos('#left_side_buttons_block', side_buttons_block_width*0.25, (winH - side_buttons_block_width*5.66) * 0.5)

        // верхний/нижний тексты
        set_size('#top_text, #bottom_text', game.winW - corner_block_size*4, corner_block_size*0.4)
        set_pos('#top_text', corner_block_size*2, 0)
        set_pos('#bottom_text', corner_block_size*2, game.winH - get_size('#bottom_text').y)

        // БЛОК ИГРОВОГО ОКНА
        // Боковые кнопки
        set_size('.side_ico', get_size('#right_side_buttons_block').x, get_size('#right_side_buttons_block').x)
        set_pos2('.side_ico', 'none', get_size('#right_side_buttons_block').x * 0.33)
    } else if (user_type == 'mobile') {
        // БЛОК ИГРОВОГО ОКНА
        // компоновка кнопок-уголков
        var corner_block_size = Math.min(winW, winH)*0.215
        var margin = corner_block_size * 0.07
        set_size('.corner_block', corner_block_size, corner_block_size)
        set_pos('#basic_el_1', margin, margin)
        set_pos('#basic_el_4', margin, winH - corner_block_size - margin)
        set_pos('#basic_el_3', winW - corner_block_size - margin, margin)
        set_pos('#basic_el_2', winW - corner_block_size - margin, winH - corner_block_size - margin)

        // компоновка блока боковых кнопок
        var side_buttons_block_width = corner_block_size * 0.55
        set_size('#left_side_buttons_block, #right_side_buttons_block', side_buttons_block_width, side_buttons_block_width*5.66)
        set_pos('#right_side_buttons_block', winW - side_buttons_block_width*1.25, (winH - side_buttons_block_width*5.66) * 0.3)
        set_pos('#left_side_buttons_block', side_buttons_block_width*0.25, (winH - side_buttons_block_width*5.66) * 0.3)

        // верхний/нижний тексты
        $('#top_text, #bottom_text').css('text-align', 'center')
        set_size('#top_text, #bottom_text', game.winW - corner_block_size*3.7, corner_block_size*0.6)
        set_pos('#top_text', (game.winW - get_size('#top_text').x)/2, 0)
        set_pos('#bottom_text', (game.winW - get_size('#bottom_text').x)/2, game.winH - get_size('#bottom_text').y)

        // БЛОК ИГРОВОГО ОКНА
        // Боковые кнопки
        set_size('.side_ico', get_size('#right_side_buttons_block').x, get_size('#right_side_buttons_block').x)
        set_pos2('.side_ico', 'none', get_size('#right_side_buttons_block').x * 0.33)

    }
}

var setup_catalog_block = function(winW, winH, user_type) {
    if (user_type == 'pc') {
        // БЛОК КАТАЛОГА
        // внутренний блок
        // если блок будет по ширине экрана
        if (game.winW < game.winH * proportions.catalog_block[0]) {
            var block_w = winW * 0.7
        } else {
            // по высоте
            var block_w = winH * 0.9 * proportions.catalog_block[0]
        }

        set_size('#inner_catalog_block', block_w, block_w * proportions.catalog_block[1])
        set_pos('#inner_catalog_block', (game.winW - block_w)/2, (game.winH - block_w * proportions.catalog_block[1])/2)

        // БЛОК КАТАЛОГА
        // заголовок

        $('#catalog_title').attr('width', get_size('#inner_catalog_block').x * 0.4)
        set_pos('#catalog_title', (get_size('#inner_catalog_block').x - get_size('#inner_catalog_block').x * 0.4)/2)
        
        // кнопка применить
        var btn_size = get_size('#inner_catalog_block').x * 0.4 * proportions.catalog_title[1] * 0.6
        set_size('#catalog_ok_btn', btn_size, btn_size)
        
        var margin = btn_size * 0.3
        
        set_pos('#catalog_ok_btn', get_size('#inner_catalog_block').x - btn_size - margin, margin)
        
        // блок с рядами
        var margin = get_size('#inner_catalog_block').y * 0.05
        
        set_size('#elements_block', get_size('#inner_catalog_block').x - margin*2, get_size('#inner_catalog_block').y - get_size('#catalog_title').y - margin)
        
        set_pos('#elements_block', margin, get_size('#catalog_title').y)
        
        // ширина блока элемента в каталоге
        var block_w = (get_size('#elements_block').x - (0.5*margin)*7)/6
        
        set_size('.catalog_element_block', block_w, block_w * proportions.catalog_element_block[1])
        
        // изображение элемента
        $('.element_img').attr('width', get_size('.catalog_element_block').x * 0.8 +'px')
        
        set_pos('.element_img', get_size('.catalog_element_block').x*0.1)
        
        // блок подписи элемента
        set_pos('.element_name', block_w*0.025, get_size('.catalog_element_block').x*0.8)
        set_size('.element_name', block_w*0.95, block_w * proportions.catalog_element_block[1] - block_w*0.7)

        
        // позиции блоков
        for (var i=0; i < game.catalog.length; i++) {
             //alert('trololo')
            set_pos('#element_'+(i+1), margin/2 + (i % 6)*margin/2 + (i%6)*block_w, Math.floor(i / 6) * block_w* proportions.catalog_element_block[1] + (Math.floor(i/6)+1)*(margin/2) )
            textFit($('#element_name_' + (i+1)), {multiLine: true, maxFontSize: 20})  
        }
        //textFit($('.ingredient_name_1, .ingredient_name_2'), {multiLine: true, maxFontSize: 20});
        // размер галочек
        set_size('.catalog_element_tick', block_w*0.25, block_w*0.25)
        set_pos('.catalog_element_tick', block_w*0.05, block_w*0.05)

    } else if (user_type == 'mobile') {
        // БЛОК КАТАЛОГА
        // внутренний блок
        // если блок будет по ширине экрана
        $('#inner_catalog_block').css('background', 'black')
        set_size('#inner_catalog_block', game.winW, game.winH)

        // БЛОК КАТАЛОГА
        // заголовок
        $('#catalog_title').attr('width', get_size('#inner_catalog_block').x * 0.8)
        set_pos('#catalog_title', (get_size('#inner_catalog_block').x - get_size('#catalog_title').x)/2)
        
        // блок с рядами
        var margin = get_size('#inner_catalog_block').x * 0.05
        // кнопка применить
        var btn_w = get_size('#inner_catalog_block').x * 0.6 
        set_size('#catalog_ok_btn_mobile', btn_w, btn_w * proportions.main_menu_button[1])

        set_pos('#catalog_ok_btn_mobile', (get_size('#inner_catalog_block').x - btn_w)/2, game.winH - get_size('#catalog_ok_btn_mobile').y - margin)

        textFit($('#catalog_ok_btn_mobile'), {alignVert: true, multiLine: true, maxFontSize: 20});

        

        set_size('#elements_block', get_size('#inner_catalog_block').x - margin*2, get_size('#inner_catalog_block').y - get_size('#catalog_title').y - get_size('#catalog_ok_btn_mobile').y - margin*2)
        set_pos('#elements_block', margin, get_size('#catalog_title').y)

        // ширина блока элемента в каталоге
        var block_w = (get_size('#elements_block').x - (0.5*margin)*4)/3
        set_size('.catalog_element_block', block_w, block_w * proportions.catalog_element_block[1])

        // изображение элемента
        $('.element_img').attr('width', get_size('.catalog_element_block').x * 0.8 +'px')
        set_pos('.element_img', get_size('.catalog_element_block').x*0.1)


        // блок подписи элемента
        set_pos('.element_name', block_w*0.025, get_size('.catalog_element_block').x*0.8)
        set_size('.element_name', block_w*0.95, block_w * proportions.catalog_element_block[1] - block_w*0.7)

        
        // позиции блоков
        for (var i=0; i < game.catalog.length; i++) {
            set_pos('#element_'+(i+1), margin/2 + (i % 3)*margin/2 + (i%3)*block_w, Math.floor(i / 3) * block_w* proportions.catalog_element_block[1] + (Math.floor(i/3)+1)*(margin/2) )
            textFit($('#element_name_' + (i+1)), {multiLine: true, maxFontSize: 20})  
            
        }

        // размер галочек
        set_size('.catalog_element_tick', block_w*0.25, block_w*0.25)
        set_pos('.catalog_element_tick', block_w*0.05, block_w*0.05)

    }
}

var setup_recipes_book_block = function(winW, winH, user_type) {
    if (user_type == 'pc') {
         // БЛОК КНИГИ РЕЦЕПТОВ
        // внутренний блок
        // если блок будет по ширине экрана
        if (game.winW < game.winH * proportions.catalog_block[0]) {
            var block_w = winW * 0.7
        } else {
            // по высоте
            var block_w = winH * 0.9 * proportions.catalog_block[0]
        }

        set_size('#inner_recipe_book_block', block_w, block_w * proportions.catalog_block[1])
        set_pos('#inner_recipe_book_block', (game.winW - block_w)/2, (game.winH - block_w * proportions.catalog_block[1])/2)

        // БЛОК КНИГИ РЕЦЕПТОВ
        // заголовок
        $('#recipe_book_title').attr('width', get_size('#inner_recipe_book_block').x * 0.5)
        set_pos('#recipe_book_title', (get_size('#inner_recipe_book_block').x - get_size('#inner_recipe_book_block').x * 0.5)/2)

        // кнопка применить
        var btn_size = get_size('#inner_recipe_book_block').x * 0.5 * proportions.catalog_title[1] * 0.4
        set_size('#recipe_book_ok_btn', btn_size, btn_size)
        var margin = btn_size * 0.3
        set_pos('#recipe_book_ok_btn', get_size('#inner_recipe_book_block').x - btn_size - margin, margin)

        // блок с рядами
        var margin = get_size('#inner_recipe_book_block').y * 0.025

        set_size('#recipes_block', get_size('#inner_recipe_book_block').x - margin*2, get_size('#inner_recipe_book_block').y - get_size('#recipe_book_title').y - margin)
        set_pos('#recipes_block', margin, get_size('#recipe_book_title').y)

        // сами рецепты
        var h = 100;
        var w1 = h * proportions.catalog_element_block[0];
        var w2 = h * proportions.recipe_middle_block[0];
        var w3 = h * proportions.recipe_right_block[0];

        var s = w1 + w2 + w3;
        w1 = w1/s;
        w2 = w2/s;
        w3 = w3/s;

        var w = (get_size('#recipes_block').x - margin * 2) * 0.95;
        w1 = w*w1;
        w2 = w*w2;
        w3 = w*w3;


        set_size('.recipe', get_size('#recipes_block').x, w1 * proportions.catalog_element_block[1] + margin)

        set_size('.recipe_left_block', w1, w1 * proportions.catalog_element_block[1])

        set_size('.recipe_middle_block', w2, w2 * proportions.recipe_middle_block[1])
        set_pos('.recipe_middle_block', w1 + margin)

        set_size('.recipe_right_block', w3, w3 * proportions.recipe_right_block[1])
        set_pos('.recipe_right_block', w1 + margin + w2 + margin)


        // изображение элемента
        $('.recipe_element_img').attr('width', w1*0.8+'px')

        set_pos('.recipe_element_img', w1*0.1)    

        // блок подписи элемента
        set_pos('.recipe_element_name', w1 * 0.025, w1*0.8)
        set_size('.recipe_element_name', w1*0.95, w1 * proportions.catalog_element_block[1] - w1*0.7)

        // ингредиенты
        // ширина блока элемента в каталоге
        if (game.game_ready && (game.catalog.length > 4 || game.bonus_catalog.length > 0) ) { 
            //alert("trololo")
            // шрифт текста описания
            
            $('.recipe_middle_block').css('font-size', Math.min(get_size('.recipe_middle_block').y * 0.15, 20) + "px")
            var block_w = get_size('.recipe_right_block').x ;

            var block_w_2 = block_w / 2 * 0.9
            
            // изображение элемента
            $('.ingredient_img_1, .ingredient_img_2').attr('width', block_w_2+'px')
            //set_pos('.ingredient_img_1, .ingredient_img_2', block_w_2*0.1)

            set_pos('.ingredient_img_2', block_w - block_w_2)

            // блок подписи элемента
            set_size('.ingredient_name_1, .ingredient_name_2',  block_w_2*0.95,  block_w_2 * proportions.catalog_element_block[1] - block_w_2*0.7)

            set_pos('.ingredient_name_1',  block_w_2*0.025, get_size('.recipe_right_block').y*0.68)
            set_pos('.ingredient_name_2', block_w - block_w_2 + block_w_2*0.025, get_size('.recipe_right_block').y*0.68)
        }

        for (var i=0; i <= game.recipes_amount; i++) {

            textFit($('#recipe_'+(i+4)+' .recipe_element_name'), {multiLine: true, maxFontSize: 20});
            ////console.log('#recipe_'+(i+1)+' .ingredient_name_1')
            
            textFit($('#ingredient_name_1_'+(i+4)), {multiLine: true, maxFontSize: 20});
            textFit($('#ingredient_name_2_'+(i+4)), {multiLine: true, maxFontSize: 20});
        }
    } else if (user_type == 'mobile') {
        // БЛОК КНИГИ РЕЦЕПТОВ
        // внутренний блок
        // если блок будет по ширине экрана
        if (game.winW < game.winH * proportions.catalog_block[0]) {
            set_size('#inner_recipe_book_block', game.winW, game.winW * proportions.catalog_block[1])
            set_pos('#inner_recipe_book_block', 0, (game.winH - game.winW * proportions.catalog_block[1])/2)
        } else {
            // по высоте
            set_size('#inner_recipe_book_block', game.winH* proportions.catalog_block[0], game.winH)
            set_pos('#inner_recipe_book_block', (game.winW - game.winH* proportions.catalog_block[0])/2)
        }

        // БЛОК КНИГИ РЕЦЕПТОВ
       
        $('#recipe_book_ok_btn').css('display', 'none')


        $('#inner_recipe_book_block').css('background', 'black')
        set_size('#inner_recipe_book_block', game.winW, game.winH)
        set_pos('#inner_recipe_book_block', 0, 0)

        // заголовок
        $('#recipe_book_title').attr('width', get_size('#inner_recipe_book_block').x*0.95)
        set_pos('#recipe_book_title', (get_size('#inner_recipe_book_block').x - get_size('#recipe_book_title').x) / 2 )


         // кнопка применить
        var btn_w = get_size('#inner_recipe_book_block').x * 0.6 
        set_size('#recipe_book_ok_btn_mobile', btn_w, btn_w * proportions.main_menu_button[1])

        set_pos('#recipe_book_ok_btn_mobile', (get_size('#inner_catalog_block').x - btn_w)/2, game.winH - get_size('#recipe_book_ok_btn_mobile').y*1.5)

        textFit($('#recipe_book_ok_btn_mobile'), {alignVert: true, multiLine: true, maxFontSize: 20});

        // ингредиенты
        // ширина блока элемента в каталоге
        if (game.game_ready && (game.catalog.length > 4 || game.bonus_catalog.length > 0) ) { 
            // БЛОК КНИГИ РЕЦЕПТОВ
            

            // кнопка применить
            /*
            var btn_size = get_size('#inner_recipe_book_block').x * 0.5 * proportions.catalog_title[1] * 0.4
            set_size('#recipe_book_ok_btn', btn_size, btn_size)
            var margin = btn_size * 0.3
            set_pos('#recipe_book_ok_btn', get_size('#inner_recipe_book_block').x - btn_size - margin, margin)

            */

            
            // блок с рядами
            var margin = get_size('#inner_recipe_book_block').y * 0.01

            set_size('#recipes_block', get_size('#inner_recipe_book_block').x - margin*2, get_size('#inner_recipe_book_block').y - get_size('#recipe_book_title').y  - get_size('#recipe_book_ok_btn_mobile').y - get_size('#inner_catalog_block').x * 0.05*2)
            set_pos('#recipes_block', margin, get_size('#recipe_book_title').y)

            // сами рецепты
            var h = 100;
            var w1 = h * proportions.catalog_element_block[0];
            var w2 = h * proportions.recipe_middle_block[0];
            var w3 = h * proportions.recipe_right_block[0];

            var s = w1 + w2 + w3;
            w1 = w1/s;
            w2 = w2/s;
            w3 = w3/s;

            var w = (get_size('#recipes_block').x - margin * 2) * 0.95;
            w1 = w*w1;
            w2 = w*w2;
            w3 = w*w3;


            set_size('.recipe', get_size('#recipes_block').x,  get_size('#recipes_block').x * proportions.recipe_middle_block[1]*2 + (get_size('#recipes_block').x* proportions.recipes_book_line[1]*2 + margin) )

            // разделительная линия
            $('.recipe_line').attr('width', get_size('#recipes_block').x)

            set_size('.recipe_left_block', get_size('#recipes_block').x * proportions.recipe_middle_block[1] * proportions.catalog_element_block[0] * 1.11, get_size('#recipes_block').x * proportions.recipe_middle_block[1] * 1.11)
 
            set_size('.recipe_middle_block', get_size('#recipes_block').x, get_size('#recipes_block').x * proportions.recipe_middle_block[1])
            set_pos('.recipe_middle_block', 0, get_size('#recipes_block').x * proportions.recipe_middle_block[1] * 1.11 + get_size('#recipes_block').x * proportions.recipes_book_line[1] + margin)



            set_size('.recipe_right_block', get_size('#recipes_block').x * proportions.recipe_middle_block[1] * proportions.recipe_right_block[0] * 1.11, get_size('#recipes_block').x * proportions.recipe_middle_block[1] * 1.11)
            set_pos('.recipe_right_block', get_size('#recipes_block').x - get_size('.recipe_right_block').x)

            $('.recipe_ravno_block').attr('width', get_size('.recipe').x - get_size('.recipe_left_block').x - get_size('.recipe_right_block').x)
            set_pos('.recipe_ravno_block', get_size('.recipe_left_block').x, get_size('.recipe_line').y)

            // изображение элемента
            $('.recipe_element_img').attr('width', get_size('.recipe_left_block').x*0.8+'px')

            // блок подписи элемента
            set_pos('.recipe_element_name', get_size('.recipe_left_block').x*0.025, get_size('.recipe_left_block').x*0.8)
            set_size('.recipe_element_name', get_size('.recipe_left_block').x*0.95, get_size('.recipe_left_block').x * proportions.catalog_element_block[1] - get_size('.recipe_left_block').x*0.7)

            // шрифт текста названия

            var block_w = get_size('.recipe_right_block').x ;

            var block_w_2 = block_w / 2 * 0.9
            
            // изображение элемента
            $('.ingredient_img_1, .ingredient_img_2').attr('width', block_w_2+'px')
            //set_pos('.ingredient_img_1, .ingredient_img_2', block_w_2*0.1)

            set_pos('.ingredient_img_2', block_w - block_w_2)

            // блок подписи элемента
            set_size('.ingredient_name_1, .ingredient_name_2',  block_w_2*0.95,  block_w_2 * proportions.catalog_element_block[1] - block_w_2*0.7)

            set_pos('.ingredient_name_1',  block_w_2*0.025, get_size('.recipe_right_block').y*0.68)
            set_pos('.ingredient_name_2', block_w - block_w_2 + block_w_2*0.025, get_size('.recipe_right_block').y*0.68)
           
        }

        for (var i=0; i <= game.recipes_amount; i++) {
            textFit($('#recipe_'+(i+4)+' .recipe_element_name'), {multiLine: true, maxFontSize: 20});
            ////console.log('#recipe_'+(i+1)+' .ingredient_name_1')
            
            textFit($('#ingredient_name_1_'+(i+4)), {multiLine: true, maxFontSize: 20});
            textFit($('#ingredient_name_2_'+(i+4)), {multiLine: true, maxFontSize: 20});
        }  
    }
}

var setup_hint_block = function(winW, winH, user_type) {
    if (user_type == 'pc') {
        // БЛОК ПОЛУЧЕННОЙ ПОДСКАЗКИ
        // внутренний блок
        if (game.winW < game.winH * proportions.inner_hint_block2[0]) {
            var block_w = winW * 0.7
        } else {
            // по высоте
            var block_w = winH * 0.7 * proportions.inner_hint_block2[0]
        }
        //var block_w = game.winW * 0.5
        set_size('#inner_hint_block2', block_w, block_w * proportions.inner_hint_block2[1])
        set_pos('#inner_hint_block2', (game.winW - get_size('#inner_hint_block2').x)/2, (game.winH - get_size('#inner_hint_block2').y)/2 )

        // БЛОК ПОЛУЧЕННОЙ ПОДСКАЗКИ
        // заголовок
        var block_w = get_size('#inner_hint_block2').x
        var block_h = block_w * proportions.inner_hint_block2[1]
        $('#hint2_title').attr('width', block_w * 0.7)
        set_pos2('#hint2_title', (block_w - get_size('#hint2_title').x)/2 )

        // блок текста
        set_size('#hint2_text', block_w * 0.9, block_w * proportions.hint2_title[1] * 0.5)
        set_pos2('#hint2_text', (block_w - get_size('#hint2_text').x)/2 )
        
        // блок кнопок
        set_size('#hint2_buttons', block_w, block_w * proportions.hint2_title[1]*0.5)

        var margin = block_h * 0.05
        set_size('.hint_2_button', (block_w - margin*4) / 2, (block_w - margin*4) / 2 * proportions.main_menu_button[1])
        set_pos('#hint2_btn_1', margin, (get_size('#hint2_buttons').y - get_size('.hint_2_button').y)/2 +(block_h - get_size('#hint2_buttons').y))
        set_pos('#hint2_btn_2', block_w - margin - get_size('#hint2_btn_2').x, (get_size('#hint2_buttons').y - get_size('.hint_2_button').y)/2+(block_h - get_size('#hint2_buttons').y))

        // блок картинок
        set_size('#hint2_images', block_w, block_h - block_w*proportions.hint2_title[1]*0.7 - get_size('#hint2_text').y - get_size('#hint2_buttons').y)
        
        // средний элемент
        // размер блока
        set_size('#hint_element, #hint_ingredient_1, #hint_ingredient_2', get_size('#hint2_images').y * proportions.catalog_element_block[0], get_size('#hint2_images').y)
        // изображение элемента
        $('#hint_element_img').attr('width', get_size('#hint_element').x*0.8+'px')
        set_pos('#hint_element_img',get_size('#hint_element').x*0.1, get_size('#hint_element').x*0.05 )
        set_size('#hint_ingredient_1_img, #hint_ingredient_2_img', get_size('#hint_element').x*0.8, get_size('#hint_element').x*0.8)
        // блок подписи элемента
        set_pos('#hint_element_name, #hint_ingredient_1_name, #hint_ingredient_2_name', get_size('#hint_element').x*0.025, get_size('#hint_element').x*0.8)
        set_size('#hint_element_name, #hint_ingredient_1_name, #hint_ingredient_2_name', get_size('#hint_element').x*0.95, get_size('#hint_element').x * proportions.catalog_element_block[1] - get_size('#hint_element').x*0.7)
        // шрифт текста названия

        // позиция подсказанного элемента
        set_pos('#hint_ingredient_1', (block_w - get_size('#hint_element').x) * 0.2 )
        set_pos('#hint_element', (block_w - get_size('#hint_element').x)/2 )
        set_pos('#hint_ingredient_2', (block_w - get_size('#hint_element').x) * 0.8 )
    } else if (user_type == 'mobile') {
        // БЛОК ПОЛУЧЕННОЙ ПОДСКАЗКИ
        // внутренний блок
        var block_w = game.winW * 0.95
        set_size('#inner_hint_block2', block_w, block_w * proportions.hint_block_mobile[1])
        set_pos('#inner_hint_block2', (game.winW - get_size('#inner_hint_block2').x)/2, (game.winH - get_size('#inner_hint_block2').y)/2 )

        // БЛОК ПОЛУЧЕННОЙ ПОДСКАЗКИ
        // заголовок
        var block_w = get_size('#inner_hint_block2').x
        var block_h = block_w * proportions.hint_block_mobile[1]
        $('#hint2_title').attr('width', block_w * 0.9)
        set_pos2('#hint2_title', (block_w - get_size('#hint2_title').x)/2 )

        // блок текста
        set_size('#hint2_text', block_w * 0.9, block_w * proportions.hint2_title[1] * 1.5)
        set_pos2('#hint2_text', (block_w - get_size('#hint2_text').x)/2 )
        

       // блок кнопок
        set_size('#hint2_buttons', block_w, block_w * proportions.hint2_title[1]*0.5)

        var margin = block_h * 0.05
        //$('#hint2_btn_1, #hint2_btn_2').css('position', 'relative')
        set_size('.hint_2_button', (block_w - margin*4) / 2, (block_w - margin*4) / 2 * proportions.main_menu_button[1])
        //set_pos('#hint2_btn_1', margin, (get_size('#hint2_buttons').y - get_size('.hint_2_button').y)/2)
        //set_pos('#hint2_btn_2', block_w - margin - get_size('#hint2_btn_2').x, (get_size('#hint2_buttons').y - get_size('.hint_2_button').y)/2)
        //set_pos('#hint2_btn_1', margin, margin)
        //set_pos('#hint2_btn_2', block_w - margin - get_size('#hint2_btn_2').x, margin)
        // блок картинок
        set_size('#hint2_images', block_w, block_h - block_w*proportions.hint2_title[1] - get_size('#hint2_text').y - get_size('#hint2_buttons').y)
        

        // средний элемент
        // размер блока

        var margin = get_size('#hint2_images').x * 0.05

        var element_w = (get_size('#hint2_images').x - margin * 4) / 3

        set_size('#hint_element, #hint_ingredient_1, #hint_ingredient_2', element_w , element_w * proportions.catalog_element_block[1])
        // изображение элемента
        $('#hint_element_img').attr('width', get_size('#hint_element').x*0.8+'px')
        set_pos('#hint_element_img',get_size('#hint_element').x*0.1,  get_size('#hint_element').x*0.05)

        set_size('#hint_ingredient_1_img, #hint_ingredient_2_img', get_size('#hint_element').x*0.8, get_size('#hint_element').x*0.8)
        // блок подписи элемента
        set_pos('#hint_element_name, #hint_ingredient_1_name, #hint_ingredient_2_name', get_size('#hint_element').x*0.025, get_size('#hint_element').x*0.8)
        set_size('#hint_element_name, #hint_ingredient_1_name, #hint_ingredient_2_name', get_size('#hint_element').x*0.95, get_size('#hint_element').x * proportions.catalog_element_block[1] - get_size('#hint_element').x*0.7)
        // шрифт текста названия


        // позиция подсказанного элемента
        set_pos('#hint_ingredient_1', margin )
        set_pos('#hint_element', element_w + margin*2 )
        set_pos('#hint_ingredient_2', element_w*2 + margin*3 )
    }
}

var setup_opened_element_block = function(winW, winH, user_type) {
    if (user_type == 'pc') {
        // БЛОК ОТКРЫТОГО ЭЛЕМЕНТА
        // внутренний блок
        if (game.winW < game.winH * proportions.new_element_block[0]) {
            var block_w = winW * 0.7
        } else {
            // по высоте
            var block_w = winH * 0.7 * proportions.new_element_block[0]
        }
        //var block_w = game.winW * 0.5
        set_size('#inner_new_element_block', block_w, block_w * proportions.new_element_block[1])
        set_pos('#inner_new_element_block', (game.winW - get_size('#inner_new_element_block').x)/2, (game.winH - get_size('#inner_new_element_block').y)/2 )

        // БЛОК ОТКРЫТОГО ЭЛЕМЕНТА
        // заголовок
        var block_w = get_size('#inner_new_element_block').x
        var block_h = block_w * proportions.new_element_block[1]
        var margin = block_h * 0.05
        $('#new_element_title').attr('width', block_w * 0.9)
        set_pos2('#new_element_title', (block_w - get_size('#new_element_title').x)/2 )

        // блок кнопки
        set_size('#new_element_btn', get_size('#new_element_title').y * proportions.main_menu_button[0] *0.5, get_size('#new_element_title').y*0.5)

        // блок элемента
        set_size('#new_element', block_w, block_h - get_size('#new_element_title').y - get_size('#new_element_btn').y*1.1 - margin)

        $('#new_element_glow').attr('width', block_w*0.5)
        set_pos('#new_element_glow', (get_size('#new_element').x - get_size('#new_element_glow').x)/2,  (get_size('#new_element').y - get_size('#new_element_glow').y)/2 + get_size('#new_element_title').y*0.75)
        $('#new_element_element').attr('width', block_w*0.25)

        set_pos('#new_element_element', (get_size('#new_element').x - get_size('#new_element_element').x)/2,  (get_size('#new_element').y - get_size('#new_element_element').y)/2 + get_size('#new_element_title').y*0.75)
        
        set_size('#new_element_name', block_w*0.5, block_h*0.1)
        set_pos('#new_element_name', (get_size('#new_element').x - get_size('#new_element_name').x)/2, get_size('#new_element_element').y*1.25 + get_size('#new_element_title').y )

        set_pos2('#new_element_btn', 'none', margin/2)
        textFit($('#new_element_name'), {alignVert: true, multiLine: true, maxFontSize: 20})

        console.log(get_size('#new_element_btn'))
        if (get_size('#new_element_btn').x != 0) {
            textFit($('#new_element_btn'), {alignVert: true, multiLine: true, maxFontSize: 20})
        }

    } else if (user_type == 'mobile') {
        // БЛОК ОТКРЫТОГО ЭЛЕМЕНТА
        // внутренний блок
        var block_w = game.winW*0.9

        //var block_w = game.winW * 0.5
        set_size('#inner_new_element_block', block_w, block_w * proportions.new_element_block[1])
        set_pos('#inner_new_element_block', (game.winW - get_size('#inner_new_element_block').x)/2, (game.winH - get_size('#inner_new_element_block').y)/2 )

        // БЛОК ОТКРЫТОГО ЭЛЕМЕНТА
        // заголовок
        var block_w = get_size('#inner_new_element_block').x
        var block_h = block_w * proportions.new_element_block[1]
        var margin = block_h * 0.05
        $('#new_element_title').attr('width', block_w * 0.9)
        set_pos2('#new_element_title', (block_w - get_size('#new_element_title').x)/2 )

        // блок кнопки
        set_size('#new_element_btn', get_size('#new_element_title').y * proportions.main_menu_button[0] *0.5, get_size('#new_element_title').y*0.5)

        // блок элемента
        set_size('#new_element', block_w, block_h - get_size('#new_element_title').y - get_size('#new_element_btn').y*1.1 - margin)

        $('#new_element_glow').attr('width', block_w*0.5)
        set_pos('#new_element_glow', (get_size('#new_element').x - get_size('#new_element_glow').x)/2,  (get_size('#new_element').y - get_size('#new_element_glow').y)/2 + get_size('#new_element_title').y*0.75)
        $('#new_element_element').attr('width', block_w*0.25)

        set_pos('#new_element_element', (get_size('#new_element').x - get_size('#new_element_element').x)/2,  (get_size('#new_element').y - get_size('#new_element_element').y)/2 + get_size('#new_element_title').y*0.75)
        
        set_size('#new_element_name', block_w*0.5, block_h*0.1)
        set_pos('#new_element_name', (get_size('#new_element').x - get_size('#new_element_name').x)/2, get_size('#new_element_element').y*1.25 + get_size('#new_element_title').y )

        set_pos2('#new_element_btn', 'none', margin/2)
        textFit($('#new_element_name'), {alignVert: true, multiLine: true, maxFontSize: 20})
        if (get_size('#new_element_btn').x != 0) {
            textFit($('#new_element_btn'), {alignVert: true, multiLine: true, maxFontSize: 20})
        }
    }
}

var setup_event_daily_reward_block = function(winW, winH, user_type) {
    if (user_type == 'pc') {
        // БЛОК ЕЖЕДНЕВНОЙ НАГРАДЫ ВЕСЕННЕЕ НАСТРОЕНИЕ 
        // внутренний блок
        if (game.winW < game.winH * proportions.event_daily_reward_block[0]) {
            var block_w = winW * 0.7
        } else {
            // по высоте
            var block_w = winH * 0.7 * proportions.event_daily_reward_block[0]
        }
        //var block_w = game.winW * 0.5
        set_size('#inner_event_daily_reward_block', block_w, block_w * proportions.event_daily_reward_block[1])
        set_pos('#inner_event_daily_reward_block', (game.winW - get_size('#inner_event_daily_reward_block').x)/2, (game.winH - get_size('#inner_event_daily_reward_block').y)/2 )

         // БЛОК ЕЖЕДНЕВНОЙ НАГРАДЫ ВЕСЕННЕЕ НАСТРОЕНИЕ 
        // блок бонусных элементов
        var block_w = get_size('#inner_event_daily_reward_block').x;
        var block_h = get_size('#inner_event_daily_reward_block').y;

        var margin = block_w * 0.03

        set_size('#reward_elements_block', block_w*0.55, (block_w*0.55 - margin*2)/3 * proportions.catalog_element_block[1])
        set_pos2('#reward_elements_block', (block_w - get_size('#reward_elements_block').x)*0.5, (block_h - get_size('#reward_elements_block').y)*0.55 )

        set_size('#reward_element_1, #reward_element_2, #reward_element_3', get_size('#reward_elements_block').y * proportions.catalog_element_block[0], get_size('#reward_elements_block').y)

        // ширина блока элемента в каталоге
        var block_element_w = get_size('#reward_elements_block').y * proportions.catalog_element_block[0]
        
        // изображение элемента
        $('.reward_element_img').attr('width', get_size('.reward_element_block').x*0.8+'px')
        set_pos('.reward_element_img', get_size('.reward_element_block').x*0.1)

        // блок подписи элемента
        set_pos('.reward_element_name', block_element_w * 0.025, get_size('.reward_element_block').x*0.8)
        set_size('.reward_element_name', block_element_w * 0.95, block_element_w * proportions.catalog_element_block[1] - block_element_w*0.7)

        // шрифт текста названия
        //textFit($('.reward_element_name'), {alignVert: true, multiLine: true, maxFontSize: 20});


        set_pos('#reward_element_2', block_element_w + margin)
        set_pos('#reward_element_3', block_element_w*2 + margin*2)

        // 
        var margin = block_h * 0.03
        set_size('#day_counter', block_element_w*0.5, ((block_h - get_size('#reward_elements_block').y)/2 - margin*4)/2 )
        set_pos2('#day_counter', 'none', margin)

        set_size('#event_daily_reward_btn', ((block_h - get_size('#reward_elements_block').y)/2 - margin*3)/2 * proportions.main_menu_button[0],  ((block_h - get_size('#reward_elements_block').y)/2 - margin*3)/2)
        //set_pos2('#event_daily_reward_btn', 'none', margin)
    } else if (user_type == 'mobile') {
        // БЛОК ЕЖЕДНЕВНОЙ НАГРАДЫ ВЕСЕННЕЕ НАСТРОЕНИЕ 
        // внутренний блок
        var block_w = game.winW * 0.9
        set_size('#inner_event_daily_reward_block', block_w, block_w * proportions.event_daily_reward_block_mobile[1])
        set_pos('#inner_event_daily_reward_block', (game.winW - get_size('#inner_event_daily_reward_block').x)/2, (game.winH - get_size('#inner_event_daily_reward_block').y)/2 )
        
        // БЛОК ЕЖЕДНЕВНОЙ НАГРАДЫ ВЕСЕННЕЕ НАСТРОЕНИЕ 
        // блок бонусных элементов
        var block_w = get_size('#inner_event_daily_reward_block').x;
        var block_h = get_size('#inner_event_daily_reward_block').y;

        var margin = block_w * 0.01

        set_size('#reward_elements_block', block_w - margin*6, (block_w - margin*6 - margin*2)/3 * proportions.catalog_element_block[1])
        set_pos2('#reward_elements_block', (block_w - get_size('#reward_elements_block').x)*0.5, (block_h - get_size('#reward_elements_block').y)*0.55 )

        set_size('#reward_element_1, #reward_element_2, #reward_element_3', get_size('#reward_elements_block').y * proportions.catalog_element_block[0], get_size('#reward_elements_block').y)

        // ширина блока элемента в каталоге
        var block_element_w = get_size('#reward_elements_block').y * proportions.catalog_element_block[0]
        
        // изображение элемента
        $('.reward_element_img').attr('width', get_size('.reward_element_block').x+'px')

        // блок подписи элемента
         // изображение элемента
        $('.reward_element_img').attr('width', get_size('.reward_element_block').x*0.8+'px')
        set_pos('.reward_element_img', get_size('.reward_element_block').x*0.1)

        // блок подписи элемента
        set_pos('.reward_element_name', block_element_w * 0.025, get_size('.reward_element_block').x*0.8)
        set_size('.reward_element_name', block_element_w * 0.95, block_element_w * proportions.catalog_element_block[1] - block_element_w*0.7)

        set_pos('#reward_element_2', block_element_w + margin)
        set_pos('#reward_element_3', block_element_w*2 + margin*2)

        // 
        var margin = block_h * 0.01
        set_size('#day_counter', block_element_w*0.5, block_element_w*0.5*0.5 )
        set_pos2('#day_counter', 'none', margin)

        set_size('#event_daily_reward_btn', block_w * 0.5,  block_w * 0.5 * proportions.main_menu_button[1])
        set_pos2('#event_daily_reward_btn', 'none', margin)

    }
}

var setup_daily_reward_block = function(winW, winH, user_type) {
    if (user_type == 'pc') {
        // БЛОК ЕЖЕДНЕВНОЙ НАГРАДЫ ОБЫЧНОЙ
        if (game.winW < game.winH * proportions.daily_reward_block[0]) {
            var block_w = winW * 0.7
        } else {
            // по высоте
            var block_w = winH * 0.7 * proportions.daily_reward_block[0]
        }
        //var block_w = game.winW * 0.5
        set_size('#inner_daily_reward_block', block_w, block_w * proportions.daily_reward_block[1])
        set_pos('#inner_daily_reward_block', (game.winW - get_size('#inner_daily_reward_block').x)/2, (game.winH - get_size('#inner_daily_reward_block').y)/2 )
        
        // БЛОК ЕЖЕДНЕВНОЙ НАГРАДЫ ОБЫЧНОЙ
        // блок бонусных элементов
        var block_w = get_size('#inner_daily_reward_block').x;
        var block_h = get_size('#inner_daily_reward_block').y;

        var margin = block_w * 0.03
        set_size('#daily_reward_elements_block', block_w*0.9, block_h*0.45)
        set_pos2('#daily_reward_elements_block', (block_w - get_size('#daily_reward_elements_block').x)*0.5, (block_h - get_size('#daily_reward_elements_block').y)*0.65 )

        var block_element_w = (block_w*0.9 - margin*6)/5

        set_size('.daily_reward_element_block', block_element_w, block_element_w * proportions.catalog_element_block[1])

        // изображение элемента
        $('.daily_reward_element_img').attr('width', get_size('.daily_reward_element_block').x*0.8+'px')
        set_pos('.daily_reward_element_img', get_size('.daily_reward_element_block').x * 0.1)

        // блок подписи элемента
        set_pos('.daily_reward_element_name', block_element_w * 0.025, get_size('.daily_reward_element_block').x*0.8)
        set_pos('.reward_day_num', 'none', get_size('.daily_reward_element_block').y)
        set_size('.daily_reward_element_name, .reward_day_num', block_element_w * 0.95, block_element_w * proportions.catalog_element_block[1] - block_element_w*0.7)

        for (var i=1; i <= 5; i++) {
            set_pos('#daily_reward_element_' + (i), (block_element_w + margin)*(i-1)+margin)
            set_pos('#reward_day_'+ (i),  (block_element_w + margin)*(i-1) + margin)
        }

        // шрифт текста названия
        textFit($('.daily_reward_element_name, .reward_day_num'), {alignVert: true, multiLine: true, maxFontSize: 20});

        var btn_h = block_h *0.15

        set_size('#daily_reward_btn', btn_h * proportions.main_menu_button[0],  btn_h)
    } else if (user_type == 'mobile') {
        // БЛОК ЕЖЕДНЕВНОЙ НАГРАДЫ ОБЫЧНОЙ
        var block_w = game.winW * 0.9
        set_size('#mobile_inner_daily_reward_block', block_w, block_w * proportions.event_daily_reward_block_mobile[1])
        set_pos('#mobile_inner_daily_reward_block', (game.winW - get_size('#mobile_inner_daily_reward_block').x)/2, (game.winH - get_size('#mobile_inner_daily_reward_block').y)/2 )

        // БЛОК ЕЖЕДНЕВНОЙ НАГРАДЫ ОБЫЧНОЙ
        // блок бонусных элементов
        var block_w = get_size('#mobile_inner_daily_reward_block').x;
        var block_h = get_size('#mobile_inner_daily_reward_block').y;

        var margin = block_w * 0.01

        set_size('#mobile_reward_elements_block', block_w - margin*6, (block_w - margin*6 - margin*2)/3 * proportions.catalog_element_block[1])
        set_pos2('#mobile_reward_elements_block', (block_w - get_size('#mobile_reward_elements_block').x)*0.5, (block_h - get_size('#mobile_reward_elements_block').y)*0.55 )

        set_size('#mobile_reward_element_2', get_size('#reward_elements_block').y * proportions.catalog_element_block[0], get_size('#reward_elements_block').y)


        // ширина блока элемента в каталоге
        var big_block_element_w = get_size('#mobile_reward_element_2').y * proportions.catalog_element_block[0]
        
        // изображение элемента
        $('#mobile_reward_element_2_img').attr('width', get_size('#mobile_reward_element_2').x*0.8+'px')
        set_pos('#mobile_reward_element_2_img', get_size('#mobile_reward_element_2').x*0.1+'px')

        // блок подписи элемента
        set_pos('#mobile_reward_element_2_name', block_element_w * 0.025, get_size('#mobile_reward_element_2').x*0.75)
        set_size('#mobile_reward_element_2_name', block_element_w*0.95, block_element_w * proportions.catalog_element_block[1] - block_element_w*0.7)

        // шрифт текста названия
        //textFit($('#mobile_reward_element_2_name'), {alignVert: true, multiLine: true, maxFontSize: 20});


        set_pos('#mobile_reward_element_2', (block_w - big_block_element_w)/2)

        set_size('#mobile_reward_element_1, #mobile_reward_element_3', big_block_element_w * 0.8, big_block_element_w * 0.8 * proportions.catalog_element_block[1])

        // изображение элемента
        $('#mobile_reward_element_1_img, #mobile_reward_element_3_img').attr('width', get_size('#mobile_reward_element_1').x*0.8+'px')
        set_pos('#mobile_reward_element_1_img, #mobile_reward_element_3_img', get_size('#mobile_reward_element_1').x*0.1 + 'px')

        // блок подписи элемента
        set_pos('#mobile_reward_element_1_name, #mobile_reward_element_3_name', block_element_w * 0.025 * 0.8, get_size('#mobile_reward_element_1').x*0.75)
        set_size('#mobile_reward_element_1_name, #mobile_reward_element_3_name', block_element_w * 0.95 * 0.8, 0.8 * (block_element_w * proportions.catalog_element_block[1] - block_element_w*0.7))

        // шрифт текста названия
        //textFit($('#mobile_reward_element_1_name, #mobile_reward_element_3_name'), {alignVert: true, multiLine: true, maxFontSize: 20});

        var margin = block_w * 0.05
        set_pos('#mobile_reward_element_1', margin, block_h * 0.4)
        set_pos('#mobile_reward_element_3', block_w - big_block_element_w*0.8-margin, block_h * 0.4)

        // 
        var margin = block_h * 0.01
        set_size('#mobile_day_counter', block_element_w*0.5, block_element_w*0.5*0.5 )
        set_pos2('#mobile_day_counter', 'none', margin)

        set_size('#mobile_daily_reward_btn', block_w * 0.5,  block_w * 0.5 * proportions.main_menu_button[1])
        set_pos2('#mobile_daily_reward_btn', 'none', margin)

    }
}

var setup_achievement_block = function(winW, winH, user_type) {
    if (user_type == 'pc') {
        // БЛОК ДОСТИЖЕНИЙ
        if (game.winW < game.winH * proportions.achievement_block[0]) {
            var block_w = winW * 0.7
        } else {
            // по высоте
            var block_w = winH * 0.7 * proportions.achievement_block[0]
        }
        //var block_w = game.winW * 0.5
        set_size('#inner_achievement_block', block_w, block_w * proportions.achievement_block[1])
        set_pos('#inner_achievement_block', (game.winW - get_size('#inner_achievement_block').x)/2, (game.winH - get_size('#inner_achievement_block').y)/2 )
        
        // БЛОК ДОСТИЖЕНИЙ
        var block_w = get_size('#inner_achievement_block').x;
        var block_h = get_size('#inner_achievement_block').y;

        set_size('#achievement_text', block_w * 0.7, block_h * 0.5)
        set_pos('#achievement_text', (block_w - get_size('#achievement_text').x)/2, (block_h - get_size('#achievement_text').y)/2)

        set_size('#achievement_ok_btn', block_w * 0.5, block_w * 0.5 * proportions.main_menu_button[1])
        set_pos('#achievement_ok_btn', (block_w - get_size('#achievement_ok_btn').x)/2, block_h * 0.95 - get_size('#achievement_ok_btn').y)

        textFit($('#achievement_ok_btn'), {alignVert: true, multiLine: true, maxFontSize: 20})
    } else if (user_type == 'mobile') {
        // БЛОК ДОСТИЖЕНИЙ
        var block_w = game.winW * 0.9
        set_size('#inner_achievement_block', block_w, block_w * proportions.achievement_block[1])
        set_pos('#inner_achievement_block', (game.winW - get_size('#inner_achievement_block').x)/2, (game.winH - get_size('#inner_achievement_block').y)/2 )
    
        // БЛОК ДОСТИЖЕНИЙ
        var block_w = get_size('#inner_achievement_block').x;
        var block_h = get_size('#inner_achievement_block').y;

        set_size('#achievement_text', block_w * 0.7, block_h * 0.5)
        set_pos('#achievement_text', (block_w - get_size('#achievement_text').x)/2, (block_h - get_size('#achievement_text').y)/2)

        set_size('#achievement_ok_btn', block_w * 0.5, block_w * 0.5 * proportions.main_menu_button[1])
        set_pos('#achievement_ok_btn', (block_w - get_size('#achievement_ok_btn').x)/2, block_h * 0.95 - get_size('#achievement_ok_btn').y)

        textFit($('#achievement_ok_btn'), {alignVert: true, multiLine: true, maxFontSize: 20})

    }
}

var setup_about_game_block = function(winW, winH, user_type) {
    if (user_type == 'pc') {
        // БЛОК ОБ ИГРЕ
        if (game.winW < game.winH * proportions.about_game_block[0]) {
            var block_w = winW * 0.9
        } else {
            // по высоте
            var block_w = winH * 0.7 * proportions.about_game_block[0]
        }
        //var block_w = game.winW * 0.5
        //set_size('#about_game_text', block_w, block_w * proportions.about_game_block[1])
        $('#about_game_text').attr('width', block_w)
        $('#about_game_text').attr('height', block_w * proportions.about_game_block[1])
        set_pos('#about_game_text', (game.winW - get_size('#about_game_text').x)/2, (game.winH - get_size('#about_game_text').y)*0.3 )
    
        // БЛОК ОБ ИГРЕ
        var block_w = get_size('#about_game_block').x;
        var block_h = get_size('#about_game_block').y;

        set_size('#about_game_ok_btn', block_h* 0.1* proportions.main_menu_button[0], block_h * 0.1)
        set_pos('#about_game_ok_btn', 'none', block_h * 0.95 - get_size('#about_game_ok_btn').y)

        textFit($('#about_game_ok_btn'), {alignVert: true, multiLine: true, maxFontSize: 20})
    } else if (user_type == 'mobile') {
        // БЛОК ОБ ИГРЕ
        if (game.winW < game.winH * proportions.mobile_about_game_block[0]) {
            var block_w = winW * 0.99
        } else {
            // по высоте
            var block_w = winH * 0.9 * proportions.mobile_about_game_block[0]
        }
        //$('#about_game_text').attr('src', 'images/About_v.webp')
        //var block_w = game.winW * 0.5
        //set_size('#about_game_text', block_w, block_w * proportions.about_game_block[1])
        $('#about_game_text').attr('width', block_w)
        $('#about_game_text').attr('height', block_w * proportions.mobile_about_game_block[1])
        
        set_pos('#about_game_text', (game.winW - get_size('#about_game_text').x)/2, 0 )

        // БЛОК ОБ ИГРЕ
        var block_w = get_size('#about_game_block').x;
        var block_h = get_size('#about_game_block').y;

        set_size('#about_game_ok_btn', block_w* 0.7, block_w * 0.7 * proportions.main_menu_button[1])
        set_pos('#about_game_ok_btn', 'none', get_pos('#about_game_text').y + get_size('#about_game_text').y + get_size('#about_game_ok_btn').y/4)

        textFit($('#about_game_ok_btn'), {alignVert: true, multiLine: true, maxFontSize: 20})

    }
}

var setup_how_to_play_block = function(winW, winH, user_type) {
    if (user_type == 'pc') {
        // БЛОК КАК ИГРАТЬ
        if (game.winW < game.winH * proportions.about_game_block[0]) {
            var block_w = winW * 0.9
        } else {
            // по высоте
            var block_w = winH * 0.7 * proportions.about_game_block[0]
        }
        //var block_w = game.winW * 0.5
        //set_size('#about_game_text', block_w, block_w * proportions.about_game_block[1])
        $('#how_to_play_text').attr('width', block_w)
        $('#how_to_play_text').attr('height', block_w * proportions.about_game_block[1])
        set_pos('#how_to_play_text', (game.winW - get_size('#how_to_play_text').x)/2, (game.winH - get_size('#how_to_play_text').y)*0.3 )
        
         // БЛОК КАК ИГРАТЬ
        var block_w = get_size('#how_to_play_block').x;
        var block_h = get_size('#how_to_play_block').y;

        set_size('#how_to_play_ok_btn', block_h* 0.1* proportions.main_menu_button[0], block_h * 0.1)
        set_pos('#how_to_play_ok_btn', 'none', block_h * 0.95 - get_size('#how_to_play_ok_btn').y)

        textFit($('#how_to_play_ok_btn'), {alignVert: true, multiLine: true, maxFontSize: 20})
    } else if (user_type == 'mobile') {
        // БЛОК КАК ИГРАТЬ
        var block_w = winW * 0.95

        //$('#how_to_play_text').attr('src', 'images/How_v.webp')
        //var block_w = game.winW * 0.5
        //set_size('#about_game_text', block_w, block_w * proportions.about_game_block[1])
        $('#how_to_play_text').attr('width', block_w)
        $('#how_to_play_text').attr('height', block_w * proportions.mobile_how_to_play_block[1])
        set_pos('#how_to_play_text', (game.winW - get_size('#how_to_play_text').x)/2, 0 )

        // БЛОК КАК ИГРАТЬ
        var block_w = get_size('#how_to_play_block').x;
        var block_h = get_size('#how_to_play_block').y;

        set_size('#how_to_play_ok_btn', block_w* 0.7, block_w * 0.7 * proportions.main_menu_button[1])
        set_pos('#how_to_play_ok_btn', 'none', get_pos('#how_to_play_text').y + get_size('#how_to_play_text').y + get_size('#how_to_play_ok_btn').y/4)

        textFit($('#how_to_play_ok_btn'), {alignVert: true, multiLine: true, maxFontSize: 20})

    }
}

var setup_bug_report_block = function(winW, winH, user_type) {
    if (user_type == 'pc') {
        // БЛОК ОТПРАВКИ СООБЩЕНИЯ ОБ ОШИБКЕ
        // внутренний блок
        if (game.winW < game.winH * proportions.inner_hint_block2[0]) {
            var block_w = winW * 0.7
        } else {
            // по высоте
            var block_w = winH * 0.7 * proportions.inner_hint_block2[0]
        }
        //var block_w = game.winW * 0.5
        set_size('#inner_send_report_block', block_w, block_w * proportions.inner_hint_block2[1])
        set_pos('#inner_send_report_block', (game.winW - get_size('#inner_hint_block2').x)/2, (game.winH - get_size('#inner_hint_block2').y)/2 )

        // БЛОК ОТПРАВИТЬ СООБЩЕНИЕ ОБ ОШИБКЕ
        // заголовок
        var block_w = get_size('#inner_send_report_block').x
        var block_h = block_w * proportions.inner_hint_block2[1]
        $('#send_report_title').attr('width', block_w * 0.7)
        set_pos2('#send_report_title', (block_w - get_size('#hint2_title').x)/2 )

        
        // блок кнопок
        set_size('#send_report_buttons', block_w, block_w * proportions.hint2_title[1]*0.5)

        var margin = block_h * 0.05
        set_size('.send_report_button', (block_w - margin*4) / 2, (block_w - margin*4) / 2 * proportions.main_menu_button[1])
        set_pos('#send_report_btn_1', margin, (get_size('#send_report_buttons').y - get_size('.send_report_button').y)/2 +(block_h - get_size('#send_report_buttons').y))
        set_pos('#send_report_btn_2', block_w - margin - get_size('#send_report_btn_2').x, (get_size('#send_report_buttons').y - get_size('.send_report_button').y)/2+(block_h - get_size('#send_report_buttons').y))

        // блок картинок
        set_size('#send_report_textarea', block_w*0.9, block_h - block_w*proportions.send_report_title[1]*0.9 - get_size('#hint2_buttons').y)
    } else if (user_type == 'mobile') {
        // БЛОК ОТПРАВКИ СООБЩЕНИЯ ОБ ОШИБКЕ
        // внутренний блок
        var block_w = game.winW * 0.95
        set_size('#inner_send_report_block', block_w, block_w * proportions.hint_block_mobile[1])
        set_pos('#inner_send_report_block', (game.winW - get_size('#inner_send_report_block').x)/2, (game.winH - get_size('#inner_send_report_block').y)/2 )
        
        // БЛОК ОТПРАВИТЬ СООБЩЕНИЕ ОБ ОШИБКЕ
        var block_w = get_size('#inner_send_report_block').x
        var block_h = block_w * proportions.hint_block_mobile[1]
        $('#send_report_title').attr('width', block_w * 0.9)
        set_pos2('#send_report_title', (block_w - get_size('#hint2_title').x)/2 )

        
        // блок кнопок
        set_size('#send_report_buttons', block_w, block_w * proportions.hint2_title[1]*0.5)

        var margin = block_h * 0.05
        set_size('.send_report_button', (block_w - margin*4) / 2, (block_w - margin*4) / 2 * proportions.main_menu_button[1])
        set_pos('#send_report_btn_1', margin, (get_size('#send_report_buttons').y - get_size('.send_report_button').y)/2 +(block_h - get_size('#send_report_buttons').y))
        set_pos('#send_report_btn_2', block_w - margin - get_size('#send_report_btn_2').x, (get_size('#send_report_buttons').y - get_size('.send_report_button').y)/2+(block_h - get_size('#send_report_buttons').y))

        // блок картинок
        set_size('#send_report_textarea', block_w*0.9, block_h - block_w*proportions.send_report_title[1]*1.25 - get_size('#hint2_buttons').y)
    
    }
}

var setup_update_block = function(winW, winH, user_type) {
    if (user_type == 'pc') {
        // БЛОК ОБ ОБНОВЛЕНИИ
        if (game.winW < game.winH * proportions.update_block[0]) {
            var block_w = winW * 0.7
        } else {
            // по высоте
            var block_w = winH * 0.7 * proportions.update_block[0]
        }
        //var block_w = game.winW * 0.5
        set_size('#inner_update_block', block_w, block_w * proportions.update_block[1])
        set_pos('#inner_update_block', (game.winW - get_size('#inner_update_block').x)/2, (game.winH - get_size('#inner_update_block').y)/2 )

        // БЛОК ОБ ОБНОВЛЕНИИ
        var block_w = get_size('#inner_update_block').x
        var block_h = block_w * proportions.update_block[1]

        var margin_x = block_w*0.05;
        var margin_y = block_h * 0.81 + get_pos('#inner_update_block').y;

        set_size('#update_btn_1, #update_btn_2', block_w*0.4, block_w*0.4*proportions.main_menu_button[1])

        set_pos('#update_btn_1', margin_x+ get_pos('#inner_update_block').x, margin_y)
        set_pos('#update_btn_2', block_w - margin_x - get_size('#update_btn_2').x+ get_pos('#inner_update_block').x, margin_y)

        textFit($('#update_btn_1, #update_btn_2'), {maxFontSize: 20, multiLine: true, alignVert: true})

    } else if (user_type == 'mobile') {
        // БЛОК ОБ ОБНОВЛЕНИИ
        
        var block_w = game.winW * 0.9
        set_size('#inner_update_block', block_w, block_w * proportions.update_block[1])
        set_pos('#inner_update_block', (game.winW - get_size('#inner_update_block').x)/2, (game.winH - get_size('#inner_update_block').y)/2 )

        // БЛОК ОБ ОБНОВЛЕНИИ
        var block_w = get_size('#inner_update_block').x
        var block_h = block_w * proportions.update_block[1]

        var margin_x = block_w*0.05;
        var margin_y = block_h * 0.81+ get_pos('#inner_update_block').y;

        set_size('#update_btn_1, #update_btn_2', block_w*0.4, block_w*0.4*proportions.main_menu_button[1])

        set_pos('#update_btn_1', margin_x+ get_pos('#inner_update_block').x, margin_y)
        set_pos('#update_btn_2', block_w - margin_x - get_size('#update_btn_2').x+ get_pos('#inner_update_block').x, margin_y)

        textFit($('#update_btn_1, #update_btn_2'), {maxFontSize: 20, multiLine: true, alignVert: true})

    }
}



// PC horizontal
var profile_1 = function(winW, winH, force_user_type = 'none') {
    // делаем все текст фиты
    $('.element_name, .recipe_element_name, .reward_element_name, .daily_reward_element_name, .mobile_reward_element_name, .ingredient_name_1, .ingredient_name_2').css('display', 'block')
    
    
    var ss = document.styleSheets[0];

    ss.insertRule('::-webkit-scrollbar {width: 4px}', 0)

    ss.insertRule('::-webkit-scrollbar {box-shadow: inset 0 0 5px grey}', 0);
    ss.insertRule('::-webkit-scrollbar {border-radius: 10px}', 0);

    ss.insertRule('::-webkit-scrollbar-thumb {background: #ffc95c}', 0)
    ss.insertRule('::-webkit-scrollbar-thumb {border-radius: 10px}', 0)
    ss.insertRule('::-webkit-scrollbar-thumb {width: 2px}', 0)

    profile = 1
    // Компоненты, которые не нужны
    $('#catalog_ok_btn_mobile').css("display", 'none')
    $('#recipe_book_ok_btn_mobile').css('display', 'none')

    // ГЛОБАЛЬНАЯ КОМПОНОВКА
    if (force_user_type == 'none') {

        // ГЛОБАЛЬНАЯ КОМПОНОВКА
        setup_main_menu_block(winW, winH, game.user_type)
        setup_game_viewport_block(winW, winH, game.user_type)
        setup_catalog_block(winW, winH, game.user_type);
        setup_recipes_book_block(winW, winH, game.user_type)
        setup_hint_block(winW, winH, game.user_type)
        setup_opened_element_block(winW, winH, game.user_type)
        setup_event_daily_reward_block(winW, winH, game.user_type)
        setup_daily_reward_block(winW, winH, game.user_type)
        setup_achievement_block(winW, winH, game.user_type)
        setup_about_game_block(winW, winH, game.user_type)
        setup_how_to_play_block(winW, winH, game.user_type)
        setup_bug_report_block(winW, winH, game.user_type)
        setup_update_block(winW, winH, game.user_type)
    
    } else {
        setup_main_menu_block(winW, winH, force_user_type)
        setup_game_viewport_block(winW, winH, force_user_type)
        setup_catalog_block(winW, winH, force_user_type);
        setup_recipes_book_block(winW, winH, force_user_type)
        setup_hint_block(winW, winH, force_user_type)
        setup_opened_element_block(winW, winH, force_user_type)
        setup_event_daily_reward_block(winW, winH, force_user_type)
        setup_daily_reward_block(winW, winH, force_user_type)
        setup_achievement_block(winW, winH, force_user_type)
        setup_about_game_block(winW, winH, force_user_type)
        setup_how_to_play_block(winW, winH, force_user_type)
        setup_bug_report_block(winW, winH, force_user_type)
        setup_update_block(winW, winH, force_user_type)
    }
    textFit($('#hint2_text'), {alignVert: true, multiLine: true, maxFontSize: 20})
    textFit($('.send_report_button'), {alignVert: true, multiLine: true, maxFontSize: 20});
    
    textFit($('.hint_2_button'), {alignVert: true, multiLine: true, maxFontSize: 20});
    textFit($('#hint_element_name'), {alignVert: true, multiLine: true, maxFontSize: 20});
    textFit($('#hint_ingredient_1_name'), {alignVert: true, multiLine: true, maxFontSize: 20})
    textFit($('#hint_ingredient_2_name'), {alignVert: true, multiLine: true, maxFontSize: 20}) 
    textFit($('#bottom_text'), {alignVert: true, multiLine: true, maxFontSize: 25})
    textFit($('#top_text'), {alignVert: true, multiLine: true, maxFontSize: 25})
    textFit($('#day_counter'), {alignVert: true, multiLine: true, maxFontSize: 20});
    textFit($('#event_daily_reward_btn'), {alignVert: true, multiLine: true, maxFontSize: 20});
    textFit($('#daily_reward_btn'), {alignVert: true, multiLine: true, maxFontSize: 20});
    textFit($('.mobile_reward_element_name'), {multiLine: true, maxFontSize: 20})
    textFit($('.daily_reward_element_name'), {multiLine: true, maxFontSize: 20})
    
     
     //console.log('МАСШТАБИРОВАНИЕ ТЕКСТА', performance.now() - s)
    //var s = performance.now()   
}

// mobile vertical
var profile_2 = function(winW, winH, force_user_type = 'none') {

   // делаем все текст фиты
    $('.element_name, .recipe_element_name, .reward_element_name, .daily_reward_element_name, .mobile_reward_element_name, .ingredient_name_1, .ingredient_name_2').css('display', 'block')
    
    // Компоненты, которые не нужны
    $('#catalog_ok_btn').css('display', 'none')
    // изменим блок подсказки
    $('#inner_hint_block2').css('background', "url('images/HintBlock_vert.png')")
    $('#inner_hint_block2').css('background-size', '100%')
    $('#top_text').text('')

    $('#inner_event_daily_reward_block').css('background', "url('images/SpringTextBlock2.webp')")
    $('#inner_event_daily_reward_block').css('background-size', "100%")

    $('#inner_send_report_block').css('background', "url('images/HintBlock_vert.png')")
    $('#inner_send_report_block').css('background-size', '100%')
    
    profile = 2

    if (force_user_type == 'none') {

        // ГЛОБАЛЬНАЯ КОМПОНОВКА
        setup_main_menu_block(winW, winH, game.user_type)
        setup_game_viewport_block(winW, winH, game.user_type)
        setup_catalog_block(winW, winH, game.user_type);
        setup_recipes_book_block(winW, winH, game.user_type)
        setup_hint_block(winW, winH, game.user_type)
        setup_opened_element_block(winW, winH, game.user_type)
        setup_event_daily_reward_block(winW, winH, game.user_type)
        setup_daily_reward_block(winW, winH, game.user_type)
        setup_achievement_block(winW, winH, game.user_type)
        setup_about_game_block(winW, winH, game.user_type)
        setup_how_to_play_block(winW, winH, game.user_type)
        setup_bug_report_block(winW, winH, game.user_type)
        setup_update_block(winW, winH, game.user_type)
    
    } else {
        setup_main_menu_block(winW, winH, force_user_type)
        setup_game_viewport_block(winW, winH, force_user_type)
        setup_catalog_block(winW, winH, force_user_type);
        setup_recipes_book_block(winW, winH, force_user_type)
        setup_hint_block(winW, winH, force_user_type)
        setup_opened_element_block(winW, winH, force_user_type)
        setup_event_daily_reward_block(winW, winH, force_user_type)
        setup_daily_reward_block(winW, winH, force_user_type)
        setup_achievement_block(winW, winH, force_user_type)
        setup_about_game_block(winW, winH, force_user_type)
        setup_how_to_play_block(winW, winH, force_user_type)
        setup_bug_report_block(winW, winH, force_user_type)
        setup_update_block(winW, winH, force_user_type)
    }
    
    

    
    
    
    
    
    
     
    
    
    
    // ЛОКАЛЬНАЯ КОМПОНОВКА

    

    
    
    
        
    
    
     
    
    
    
    
    
    textFit($('#hint2_text'), {alignVert: true, multiLine: true, maxFontSize: 20})
    textFit($('.hint_2_button'), {alignVert: true, multiLine: true, maxFontSize: 20});
    textFit($('#hint_element_name'), {alignVert: true, multiLine: true, maxFontSize: 20});
    textFit($('#hint_ingredient_1_name'), {alignVert: true, multiLine: true, maxFontSize: 20})
    textFit($('#hint_ingredient_2_name'), {alignVert: true, multiLine: true, maxFontSize: 20}) 
    textFit($('#bottom_text'), {alignVert: true, multiLine: true, maxFontSize: 25})
    textFit($('#top_text'), {alignVert: true, multiLine: true, maxFontSize: 25})
    textFit($('#day_counter'), {alignVert: true, multiLine: true, maxFontSize: 20});
    textFit($('#event_daily_reward_btn'), {alignVert: true, multiLine: true, maxFontSize: 20});
    textFit($('#mobile_daily_reward_btn'), {alignVert: true, multiLine: true, maxFontSize: 20});
    textFit($('.mobile_reward_element_name'), {multiLine: true, maxFontSize: 20})
    textFit($('.daily_reward_element_name'), {multiLine: true, maxFontSize: 20})
    $('.element_name, .recipe_element_name, .reward_element_name, .daily_reward_element_name, .mobile_reward_element_name, .ingredient_name_1, .ingredient_name_2').css('display', 'table')
    $('.element_name span, .recipe_element_name span, .reward_element_name span, .daily_reward_element_name span, .mobile_reward_element_name span, .ingredient_name_1 span, .ingredient_name_2 span').css('display', 'table-cell')

} 

// PC-sqaure
var profile_3 = function(winW, winH) {

}

var resize_screen = function() {
    
    var s = performance.now()
    var main_menu_block_display = $('#main_menu_block').css('display')
    var game_viewport_block_display = $('#game_viewport_block').css('display')
    var catalog_block_display = $('#catalog_block').css('display')
    var recipe_book_block_display = $('#recipe_book_block').css('display')
    var hint_block2_display = $('#hint_block2').css('display')
    var new_element_block_display = $('#new_element_block').css('display')
    var event_daily_reward_block_display = $('#event_daily_reward_block').css('display')
    var daily_reward_block_display = $('#daily_reward_block').css('display')
    var mobile_daily_reward_block_display = $('#mobile_daily_reward_block').css('display')
    var achievement_block_display = $('#achievement_block').css('display')
    var about_game_block_display = $('#about_game_block').css('display')
    var how_to_play_block_display = $('#how_to_play_block').css('display')
    var send_report_block_display = $('#send_report_block').css('display')
    var update_block_display = $('#update_block').css('display')

    $('#main_menu_block').css('display', 'block')
    $('#game_viewport_block').css('display', 'block')
    $('#catalog_block').css('display', 'block')
    $('#recipe_book_block').css('display', 'block')
    $('#hint_block2').css('display', 'block')
    $('#new_element_block').css('display', 'block')
    $('#event_daily_reward_block').css('display', 'block')
    $('#daily_reward_block').css('display', 'block')
    $('#mobile_daily_reward_block').css('display', 'block')
    $('#achievement_block').css('display', 'block')
    $('#about_game_block').css('display', 'block')
    $('#how_to_play_block').css('display', 'block')
    $('#send_report_block').css('display', 'block')
    $('#update_block').css('display', 'block')

    $('#main_menu_block').css('opacity', '0')
    $('#game_viewport_block').css('opacity', '0')
    $('#catalog_block').css('opacity', '0')
    $('#recipe_book_block').css('opacity', '0')
    $('#hint_block2').css('opacity', '0')
    $('#new_element_block').css('opacity', '0')
    $("#event_daily_reward_block").css('opacity', '0')
    $("#daily_reward_block").css('opacity', '0')
    $('#mobile_daily_reward_block').css('opacity', '0')
    $('#achievement_block').css('opacity', '0')
    $('#about_game_block').css('opacity', '0')
    $('#how_to_play_block').css('opacity', '0')
    $('#send_report_block').css('opacity', '0')
    $('#update_block').css('opacity', '0')

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // код для мобильных устройств
        game.user_type = 'mobile';
        game.winW = $(window).width();
        game.winH = $(window).height();
        if (game.winW > game.winH) {
            game.user_type = 'sberportal'
        }
    } else {
        game.user_type = 'pc';
        // код для обычных устройств
    }
    /*
    if (detectDevice() == 'sberportal') {
        game.user_type = 'sberportal'
    }
    */


    
    game.winW = $(window).width();
    game.winH = $(window).height();

    if (PLATFORM_TYPE == 'sber') {
        game.winH *= 0.9
    }

    if (game.user_type == 'sberportal') {
        game.winH *= 0.95
    }

    var winW = game.winW;
    var winH = game.winH;


    set_size('.fullscreen_block', game.winW, game.winH)

    // размер блока рендера
    $('#render_block').attr('width', (winW)*2)
    $('#render_block').attr('height', (winH)*2)


    game.pixi_app.view.style.width = (winW) + 'px';
    game.pixi_app.view.style.height = (winH) + 'px';

    game.pixi_app.stage.scale.set(2, 2)


    if (game.game_ready) {
        if (game.user_type == 'pc' || game.user_type == 'sberportal') {
            var tex_size = Math.min(game.winW, game.winH) * 0.3;
        } else {
            var tex_size = Math.min(game.winW, game.winH) * 0.4;
        }
        var scale = tex_size/game.pixi_corners[0].texture.width;
        var hole_scale = tex_size / game.black_hole.texture.width;


        game.pixi_corners[0].scale.set(scale, scale)
        game.pixi_corners[1].scale.set(scale, scale)
        game.pixi_corners[2].scale.set(scale, scale)
        game.pixi_corners[3].scale.set(scale, scale)
        game.black_hole.scale.set(hole_scale, hole_scale)

        game.black_hole_normal_scale = hole_scale

        game.pixi_corners[0].position.x = 0
        game.pixi_corners[0].position.y = 0

        game.pixi_corners[3].position.x = 0
        game.pixi_corners[3].position.y = game.winH - tex_size;

        game.pixi_corners[2].position.x = game.winW - tex_size;
        game.pixi_corners[2].position.y = 0

        game.pixi_corners[1].position.x = game.winW - tex_size;
        game.pixi_corners[1].position.y = game.winH - tex_size;

        game.black_hole.position.x = game.winW/2;
        game.black_hole.position.y = game.winH - tex_size * 0.6;

    }

     $('#hint2_btn_2').css('display', 'block')
     $('.element_name, .recipe_element_name, .reward_element_name, .daily_reward_element_name, .mobile_reward_element_name, .ingredient_name_1, .ingredient_name_2').css('display', 'block')
    
     console.log('detectDevice', detectDevice('sberportal'), detectDevice('sberportal') == 'sberportal')

    if (game.user_type == 'pc' || game.user_type == 'sberportal') {
        //game.user_type = 'pc'
        profile_1(game.winW, game.winH, 'pc')
        $('#test_ad').css('display', 'block')
        set_size('#test_ad', winW, winH)
        //set_size('#close_test_ad_btn', winW * 0.3, winH * 0.1)
        //$('#close_test_ad_btn').css('font-size', winH*0.035 + 'px')
        //set_pos('#close_test_ad_btn', winW*0.7, winH*0.05)
        set_size('#test_ad_text', winW * 0.5, winH*0.5)
        set_pos('#test_ad_text', winW * 0.25, winH * 0.25)
        $('#test_ad').css('display', 'none')

    } else {
        profile_2(game.winW, game.winH)
        $('#sound_ico').attr('ontouchend', 'mute();')
        $('#sound_ico').attr('onclick', '')
         $('#test_ad').css('display', 'block')
        set_size('#test_ad', winW, winH)
        //set_size('#close_test_ad_btn', winW * 0.3, winH * 0.1)
        //$('#close_test_ad_btn').css('font-size', winH*0.035 + 'px')
        //set_pos('#close_test_ad_btn', winW*0.7, winH*0.05)
        set_size('#test_ad_text', winW * 0.5, winH*0.5)
        set_pos('#test_ad_text', winW * 0.25, winH * 0.25)
        $('#test_ad').css('display', 'none')
    }

    if (PLATFORM_TYPE != 'vk') {
        $('#share_block').css('display', 'none')
    }

    if (PLATFORM_TYPE == 'vk') {
        $('#link_to_group').css('display', 'block')
        if (game.user_type == 'mobile') {
            $('#link_to_group').text('Вступайте в группу!')
        }
        set_pos('#link_to_group', (game.winW - get_size('#link_to_group').x) * 0.5, (game.winH - get_size('#link_to_group').y)*0.9 )
    } else {
        $('#link_to_group').css('display', 'none')
    }

    if (PLATFORM_TYPE == 'sber') {
        $('#error_ico').css('display', 'none')
    }

    $('.element_name, .recipe_element_name, .reward_element_name, .daily_reward_element_name, .mobile_reward_element_name, .ingredient_name_1, .ingredient_name_2').css('display', 'table')
    $('.element_name span, .recipe_element_name span, .reward_element_name span, .daily_reward_element_name span, .mobile_reward_element_name span, .ingredient_name_1 span, .ingredient_name_2 span').css('display', 'table-cell')
    $('.element_name span, .recipe_element_name span, .reward_element_name span, .daily_reward_element_name span, .mobile_reward_element_name span, .ingredient_name_1 span, .ingredient_name_2 span').css('content-align', 'center')
     $('.element_name span, .recipe_element_name span, .reward_element_name span, .daily_reward_element_name span, .mobile_reward_element_name span, .ingredient_name_1 span, .ingredient_name_2 span').css('vertical-align', 'middle')


    $('#main_menu_block').css('opacity', '1')
    $('#game_viewport_block').css('opacity', '1')
    $('#catalog_block').css('opacity', '1')
    $('#recipe_book_block').css('opacity', '1')
    $('#hint_block2').css('opacity', '1')
    $('#new_element_block').css('opacity', '1')
    $('#event_daily_reward_block').css('opacity', '1')
    $('#daily_reward_block').css('opacity', '1')
    $('#mobile_daily_reward_block').css('opacity', '1')
    $('#achievement_block').css('opacity', '1')
    $('#about_game_block').css('opacity', '1')
    $('#how_to_play_block').css('opacity', '1')
    $('#send_report_block').css('opacity', '1')
    $('#update_block').css('opacity', '1')

    $('#main_menu_block').css('display', main_menu_block_display)
    $('#game_viewport_block').css('display', game_viewport_block_display)
    $('#catalog_block').css('display', catalog_block_display)
    $('#recipe_book_block').css('display', recipe_book_block_display)
    $('#hint_block2').css('display', hint_block2_display)
    $('#new_element_block').css('display', new_element_block_display)
    $('#event_daily_reward_block').css('display', event_daily_reward_block_display)
    $('#daily_reward_block').css('display', daily_reward_block_display)
    $('#mobile_daily_reward_block').css('display', mobile_daily_reward_block_display)
    $('#achievement_block').css('display', achievement_block_display)
    $('#about_game_block').css('display', about_game_block_display )
    $('#how_to_play_block').css('display', how_to_play_block_display)
    $('#send_report_block').css('display', send_report_block_display)
    $('#update_block').css('display', update_block_display)

    //console.log('resize_screen()', performance.now() - s)

}

