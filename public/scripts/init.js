
var detectDevice = function(force_state = 'none') {

    let ret = "unknown";
    let nav = window.navigator.userAgent.toLocaleLowerCase();
    
    if(/sberbox/.test(nav) || /satellite/.test(nav) || /tv/.test(nav) || /time/.test(nav)){
        ret = "sberbox";
    } else if((/sberportal/.test(nav)) || (/stargate/.test(nav))){
        ret = "sberportal";
    } else if(/ipad|iphone|ipod/.test(nav)){
            ret = "ios";
    } else {
        let platform = navigator.platform;
        if (['iPad Simulator','iPhone Simulator','iPod Simulator','iPad','iPhone','iPod'].includes(platform)){
            ret = "ios";
        }
    }

    if (force_state != 'none') {
        return force_state
    } else {
         return ret;
    }
   
}   

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function removeItemAll(arr, value) {
  var i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
  return arr;
}

PIXI.Sprite.prototype.bringToFront = function() {   
    if (this.parent) {      
        var parent = this.parent;       
        parent.removeChild(this);       
        parent.addChild(this);  
    }
}

var click_sound = new Howl({
  src: ['sounds/click.wav'],
  autoplay: false,
  loop: false,
  volume: 0.5,
});

var music_1_sound = new Howl({
  src: ['sounds/music_1.mp3'],
  autoplay: false,
  loop: false,
  volume: 0.5,
  onend: function() {
    music_2_sound.play()
  }
});

var music_2_sound = new Howl({
  src: ['sounds/music_2.mp3'],
  autoplay: false,
  loop: false,
  volume: 0.5,
  onend: function() {
    music_1_sound.play()
  }
});

PIXI.settings.ROUND_PIXELS = true
PIXI.settings.RESOLUTION = 0


// Все данные игры
var game = {
    "pixi_app": new PIXI.Application({ 
        width: Math.floor($(window).width())*2,
        height: Math.floor($(window).height())*2,
        resolution: 1
    }),
    "winW": $(window).width(),
    "winH": $(window).height(),
    "user_type": "",
    "mouse_down": false,
    "catalog": [],
    "bonus_catalog": [],
    "mouse_x": 0,
    "mouse_y": 0,
    "elements": [],
    "cur_lang": "ru",
    "selected_element": 0,
    "new_element": 0,
    "shift_x": 0,
    "shift_y": 0,
    "data": {
        "loaded_catalog": [],
        "loaded_bonus_catalog": [],
        "last_visit_date": "",
        "day_counter": 0,
        "elements": []
    },
    "platform": "yandex",
    "game_ready": false,
    "selected_from_catalog": [],
    "recipes_book_loaded": false,
    "hint_level": 0,
    "hint_ingredient_1": 0,
    "hint_ingredient_2": 0,
    "hint_product": 0,
    "pixi_corners": [],
    "errors": [],
    "muted": false,
    "daily_reward_shown": false,
    "event_day_counter": 1,
    "is_event": false,
    "recipes_amount": 0,
    "got_achievement": false,
    "recipes": [],
    "sdk_ready": true,
    "sdk": '',
    "adv_show_last_time": 0,
    "black_hole": 0,
    "game_black_hole_normal_scale": 1,
    "launch_time": Date.now()
}

var scrolling = false;
var endScrolling;
var touch_start_x = 0;
var touch_start_y = 0;
var touch_delta_x = 0;
var touch_delta_y = 0;

if (PLATFORM_TYPE == 'yandex') {
YaGames
    .init({
        adv: {
            onAdvClose: wasShown => {
                console.info('adv closed!');
            }
        }
    })
    .then(y_sdk => {
        y_sdk.getStorage().then(safeStorage => Object.defineProperty(window, 'localStorage', { get: () => safeStorage }))
        .then(() => {
           localStorage.setItem('key', 'safe storage is working');
           console.log(localStorage.getItem('key'))
           //load_progress();
        })
        game.sdk = y_sdk;
        if (PLATFORM_TYPE == 'yandex') {
            game.sdk_ready = true
        }
        console.log('YSDK ГОТОВ!')
        //show_interistial_ad();
    })
}



var process_date = function() {
    var date = new Date();
    return date.getFullYear() + "-" + (Number(date.getMonth())+1) + "-" + date.getDate() + "|" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
}

window.onerror = function myErrorHandler(a, b, c, d, full_info) {  
    //console.log(full_info)
    if (full_info != null) {
        //console.log(typeof(full_info), full_info)
        game.errors.push({
            "time": process_date(),
            "json_info": JSON.stringify(full_info, Object.getOwnPropertyNames(full_info)),
        })
    }
    //Do some  stuff 
    //console.log('!!!!', err, url, line) // Uncaught SyntaxError: Invalid or unexpected token at Line no:- 1
    return false;   // so you still log errors into console 
}

var delete_copies = function(arr) {
    var new_arr = [...new Set(arr)];

    return new_arr;
}

var random_element = function(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

function hexToRgb(hex) {
    hex = hex.slice(1, hex.length)
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return [r, g, b]
}

var ysdk;

var load_progress = function(changing_lang = false) {
    //if (changing_lang == false) {
    game.data.loaded_catalog = JSON.parse(window.localStorageFallback.getItem('catalog_'))

    if (typeof(game.data.loaded_catalog) != 'object' || game.data.loaded_catalog == null || game.data.loaded_catalog.length == 0) {
        game.data.loaded_catalog = [1,2,3,4]
        game.catalog = game.data.loaded_catalog;
    }

    game.data.loaded_catalog = delete_copies(game.data.loaded_catalog)
    game.catalog = game.data.loaded_catalog

    game.data.loaded_bonus_catalog = JSON.parse(window.localStorageFallback.getItem('bonus_catalog_'))

    if (typeof(game.data.loaded_bonus_catalog) != 'object') {
        game.data.loaded_bonus_catalog = [];
    }

    game.data.loaded_bonus_catalog = delete_copies(game.data.loaded_bonus_catalog)
    game.bonus_catalog = game.data.loaded_bonus_catalog;
    console.log('game_bonus_catalog', game.bonus_catalog)

    game.data.elements = JSON.parse(window.localStorageFallback.getItem('elements_'))

    if (typeof(game.data.elements) != 'object' || game.data.elements == null) {
        game.data.elements = [];

    }
//add_everything();



    console.log("Загружено:")
    console.log(game.data)
    console.log(game.data.loaded_catalog)
    console.log(game.catalog)
    //console.log('начинаем загрузку ресурсов')
    load_assets(changing_lang);
    
}

var save_progress = function() {
    window.localStorageFallback.setItem('catalog_', JSON.stringify(game.data.loaded_catalog))
    window.localStorageFallback.setItem('bonus_catalog_', JSON.stringify(game.data.loaded_bonus_catalog))
    window.localStorageFallback.setItem('last_visit_date_', game.data.last_visit_date)
    window.localStorageFallback.setItem('day_counter_', game.data.day_counter)
    window.localStorageFallback.setItem('elements_', JSON.stringify(game.data.elements))
}

var reset_progress = function() {
    window.localStorageFallback.setItem('catalog_', JSON.stringify([1,2,3,4]))
    window.localStorageFallback.setItem('bonus_catalog_', JSON.stringify([]))
    //window.localStorageFallback.setItem('last_visit_date_', game.data.last_visit_date)
    window.localStorageFallback.setItem('day_counter_', 1)
    window.localStorageFallback.setItem('elements_', JSON.stringify([]))

    for (var i in game.elements) {
        game.elements[i].destroyed = true
    }

    game.catalog = [];
    resize_screen();
}






game.pixi_app.renderer.autoDensity = true;
game.pixi_app.renderer.view.style.position = "absolute";
game.pixi_app.view.id = 'render_block'
$('#game_viewport_block').append(game.pixi_app.view)


PIXI.Loader.shared.add('corner_1', './images/Fire_big.webp')
PIXI.Loader.shared.add('corner_4', './images/Water_big.webp')
PIXI.Loader.shared.add('corner_3', './images/Air_big.webp')
PIXI.Loader.shared.add('corner_2', './images/Earth_big.webp')
PIXI.Loader.shared.add('black_hole', './images/BlackHole.png')

var load_assets = function(changing_lang = false) {
    if (changing_lang == false) {
        for (var i=0; i < game.catalog.length; i++) {
            //console.log(game.catalog[i])
            //console.log('loader->', game.catalog[i])
            PIXI.Loader.shared.add(String(game.catalog[i]), ('./images/elements/'+String(game.catalog[i])+'.webp'))
        }
    }

    PIXI.Loader.shared.load(function() {
        if (changing_lang == false) {

            var corner_1_texture = new PIXI.Texture(PIXI.Loader.shared.resources['corner_1'].texture)
            var corner_1 = new PIXI.Sprite(corner_1_texture)

            var corner_2_texture = new PIXI.Texture(PIXI.Loader.shared.resources['corner_2'].texture)
            var corner_2 = new PIXI.Sprite(corner_2_texture)

            var corner_3_texture = new PIXI.Texture(PIXI.Loader.shared.resources['corner_3'].texture)
            var corner_3 = new PIXI.Sprite(corner_3_texture)

            var corner_4_texture = new PIXI.Texture(PIXI.Loader.shared.resources['corner_4'].texture)
            var corner_4 = new PIXI.Sprite(corner_4_texture)

            var black_hole_texture = new PIXI.Texture(PIXI.Loader.shared.resources['black_hole'].texture)
            var black_hole = new PIXI.Sprite(black_hole_texture)

            if (game.user_type == 'pc') {
                var tex_size = Math.min(game.winW, game.winH) * 0.3;
            } else {
                var tex_size = Math.min(game.winW, game.winH) * 0.4;
            }

            
            var scale = tex_size/corner_1_texture.width;
            var hole_scale = tex_size / black_hole_texture.width;

            corner_1.scale.set(scale, scale)
            corner_2.scale.set(scale, scale)
            corner_3.scale.set(scale, scale)
            corner_4.scale.set(scale, scale)
                    black_hole.anchor.set(0.5)

            black_hole.scale.set(hole_scale, hole_scale)

            corner_1.position.x = 0
            corner_1.position.y = 0

            corner_4.position.x = 0
            corner_4.position.y = game.winH - tex_size;

            corner_3.position.x = game.winW - tex_size;
            corner_3.position.y = 0

            corner_2.position.x = game.winW - tex_size;
            corner_2.position.y = game.winH - tex_size;

            black_hole.position.x = game.winW/2;
            black_hole.position.y = game.winH - tex_size * 0.6;

            game.pixi_app.stage.addChild(corner_1);
            game.pixi_app.stage.addChild(corner_2);
            game.pixi_app.stage.addChild(corner_3);
            game.pixi_app.stage.addChild(corner_4);
            game.pixi_app.stage.addChild(black_hole)

            game.pixi_corners.push(corner_1)
            game.pixi_corners.push(corner_2)
            game.pixi_corners.push(corner_3)
            game.pixi_corners.push(corner_4)
            game.black_hole = black_hole
            game.black_hole_normal_scale = hole_scale

            game.black_hole.alpha = 0

            // подгружаем остальные элементы
            for (var i=1; i <= 138; i++) {
                if (game.catalog.includes(i) == false) {
                    //console.log('loader ->', i)
                    PIXI.Loader.shared.add(String(i), ('./images/elements/'+String(i)+'.webp'))
                }
            }

            if (game.catalog.includes('day_1') == false) {
                PIXI.Loader.shared.add('day_1', './images/elements/day_1.webp')
            }
            
            if (game.catalog.includes('day_2') == false) {
                PIXI.Loader.shared.add('day_2', './images/elements/day_2.webp')
            }

            if (game.catalog.includes('day_3') == false) {
                PIXI.Loader.shared.add('day_3', './images/elements/day_3.webp')
            }

            if (game.catalog.includes('day_4') == false) {
                PIXI.Loader.shared.add('day_4', './images/elements/day_4.webp')
            }

            if (game.catalog.includes('day_5') == false) {
                PIXI.Loader.shared.add('day_5', './images/elements/day_5.webp')
            }
     
            for (var i=1; i <= 4; i++) {
                if (game.catalog.includes('Spring_day' + (i) + '_1') == false) {
                    PIXI.Loader.shared.add('Spring_day' + (i) + '_1', './images/elements/Spring_day' + (i) + '_1.webp')
                }
                if (game.catalog.includes('Spring_day' + (i) + '_2') == false) {
                    PIXI.Loader.shared.add('Spring_day' + (i) + '_2', './images/elements/Spring_day' + (i) + '_2.webp')
                }
                if (game.catalog.includes('Spring_day' + (i) + '_3') == false) {
                    PIXI.Loader.shared.add('Spring_day' + (i) + '_3', './images/elements/Spring_day' + (i) + '_3.webp')
                }
            }

            console.log('1111111', game.user_type)
            // добавляем элементы
            for (var i=0; i < game.data.elements.length; i++) {
                //console.log(game.data.elements[i].type)
                if (game.catalog.includes(game.data.elements[i].type)) {
                    game.elements.push(new myElement(game.data.elements[i].type, game.data.elements[i].x, game.data.elements[i].y))
                }
            } 
        }

        console.log('начинаем добавлять элементы')



         

        // сами ряды

        $('#elements_block').empty();
        $('#recipes_block').empty();



        if (game.user_type == 'pc' || game.user_type == 'sberportal') {
            for (var i=0; i < game.catalog.length; i++) {
                
                $('#elements_block').append(`
                    <div data-id=`+game.catalog[i]+` id="element_`+(i+1)+`" class="catalog_element_block popup_block" onclick="select_element_from_catalog(this);">
                        <img class="element_img popup_block" src="images/elements/`+game.catalog[i]+`.webp">
                        <div id="element_name_`+(i+1)+`" class="element_name popup_block ">
                            `+all_elements[game.catalog[i]][cur_lang]+`
                        </div>
                        <div id="element_`+game.catalog[i]+`_tick" class="catalog_element_tick popup_block" >
                            
                        </div>
                    </div>
                `)

            
                if (game.catalog[i] != 1 && game.catalog[i] != 2 && game.catalog[i] != 3 && game.catalog[i] != 4) {
                    if (game.recipes.includes(game.catalog[i]) == false || changing_lang == true) {
                        $('#recipes_block').append(`
                            <div id="recipe_`+i+`" class="recipe">
                                <div class="recipe_left_block popup_block">
                                    <img class="recipe_element_img popup_block" src="images/elements/`+game.catalog[i]+`.webp">
                                    <div class="recipe_element_name popup_block ">
                                        `+all_elements[game.catalog[i]][cur_lang]+`
                                    </div>
                                </div>
                                <div class="recipe_middle_block popup_block">
                                   `+descriptions[String(game.catalog[i])][cur_lang]+`
                                </div>
                                <div class="recipe_right_block popup_block">
                                    <img class="ingredient_img_1 popup_block" src="images/elements/`+ingredients[game.catalog[i]][0]+`.webp">
                                    <div id="ingredient_name_1_`+(i)+`" class="ingredient_name_1 popup_block ">
                                        `+all_elements[ingredients[game.catalog[i]][0]][cur_lang]+`
                                    </div>

                                    <img class="ingredient_img_2 popup_block" src="images/elements/`+ingredients[game.catalog[i]][1]+`.webp">
                                    <div id="ingredient_name_2_`+(i)+`" class="ingredient_name_2 popup_block ">
                                        `+all_elements[ingredients[game.catalog[i]][1]][cur_lang]+`
                                    </div>
                                </div>
                            </div>
                        `)
                        game.recipes.push(game.catalog[i])
                        game.recipes_amount += 1
                    }
                    
                }
            }


            for (var i=0; i < game.bonus_catalog.length; i++) {
                if (game.catalog.includes(game.bonus_catalog[i]) == false) {
                    console.log(game.bonus_catalog[i], all_elements[game.bonus_catalog[i]])
                    if (game.recipes.includes(game.bonus_catalog[i]) == false || changing_lang == true) {
                        $('#recipes_block').append(`
                            <div id="recipe_`+(i+ + game.catalog.length)+`" class="recipe">
                                <div class="recipe_left_block popup_block">
                                    <img class="recipe_element_img popup_block" src="images/elements/`+game.bonus_catalog[i]+`.webp">
                                    <div class="recipe_element_name popup_block ">
                                        `+all_elements[game.bonus_catalog[i]][cur_lang]+`
                                    </div>
                                </div>
                                <div class="recipe_middle_block popup_block">
                                   `+descriptions[String(game.bonus_catalog[i])][cur_lang]+`
                                </div>
                                <div class="recipe_right_block popup_block">
                                    <img class="ingredient_img_1 popup_block" src="images/elements/`+ingredients[game.bonus_catalog[i]][0]+`.webp">
                                    <div id="ingredient_name_1_`+(i+ game.catalog.length)+`" class="ingredient_name_1 popup_block ">
                                        `+all_elements[ingredients[game.bonus_catalog[i]][0]][cur_lang]+`
                                    </div>

                                    <img class="ingredient_img_2 popup_block" src="images/elements/`+ingredients[game.bonus_catalog[i]][1]+`.webp">
                                    <div id="ingredient_name_2_`+(i+ game.catalog.length)+`" class="ingredient_name_2 popup_block ">
                                        `+all_elements[ingredients[game.bonus_catalog[i]][1]][cur_lang]+`
                                    </div>
                                </div>
                            </div>
                        `)
                        game.recipes_amount += 1
                        game.recipes.push(game.bonus_catalog[i])
                    }
                }
            }


        } else if (game.user_type == 'mobile') {
            
            for (var i=0; i < game.catalog.length; i++) {
               //console.log(i)
                $('#elements_block').append(`
                    <div data-id=`+game.catalog[i]+` id="element_`+(i+1)+`" class="catalog_element_block popup_block" ontouchend="select_element_from_catalog(this);">
                        <img class="element_img popup_block" src="images/elements/`+game.catalog[i]+`.webp">
                        <div id="element_name_`+(i+1)+`" class="element_name popup_block ">
                            `+all_elements[game.catalog[i]][cur_lang]+`
                        </div>
                        <div id="element_`+game.catalog[i]+`_tick" class="catalog_element_tick popup_block" >
                            
                        </div>
                    </div>
                `)
                
                if (game.catalog[i] != 1 && game.catalog[i] != 2 && game.catalog[i] != 3 && game.catalog[i] != 4) {
                    $('#recipes_block').append(`
                        <div  id="recipe_`+i+`" class="recipe">
                            <img class="recipe_line" src="images/Line.webp">
                            <div class="recipe_left_block popup_block">
                                <img class="recipe_element_img popup_block" src="images/elements/`+game.catalog[i]+`.webp">
                                <div class="recipe_element_name popup_block ">
                                    `+all_elements[game.catalog[i]][cur_lang]+`
                                </div>
                            </div>
                            <img class="recipe_ravno_block popup_block" src="images/RavnoBlock.png">
                            <div class="recipe_middle_block popup_block">
                                `+descriptions[String(game.catalog[i])][cur_lang]+`
                            </div>
                            <div class="recipe_right_block popup_block">
                                <img class="ingredient_img_1 popup_block" src="images/elements/`+ingredients[game.catalog[i]][0]+`.webp">
                                <div  id="ingredient_name_1_`+(i)+`" class="ingredient_name_1 popup_block ">
                                    `+all_elements[ingredients[game.catalog[i]][0]][cur_lang]+`
                                </div>

                                <img class="ingredient_img_2 popup_block" src="images/elements/`+ingredients[game.catalog[i]][1]+`.webp">
                                <div  id="ingredient_name_2_`+(i)+`" class="ingredient_name_2 popup_block ">
                                    `+all_elements[ingredients[game.catalog[i]][1]][cur_lang]+`
                                </div>
                            </div>
                        </div>
                    `)
                    game.recipes_amount += 1
                }
            }

            for (var i=0; i < game.bonus_catalog.length; i++) {
                if (game.catalog.includes(game.bonus_catalog[i]) == false || changing_lang == true) {
                    console.log(i, game.bonus_catalog[i])
                    $('#recipes_block').append(`
                        <div id="recipe_`+(i+ + game.catalog.length)+`"  class="recipe">
                            <img class="recipe_line" src="images/Line.webp">
                            <div class="recipe_left_block popup_block">
                                <img class="recipe_element_img popup_block" src="images/elements/`+game.bonus_catalog[i]+`.webp">
                                <div class="recipe_element_name popup_block ">
                                    `+all_elements[game.bonus_catalog[i]][cur_lang]+`
                                </div>
                            </div>
                            <img class="recipe_ravno_block popup_block" src="images/RavnoBlock.png">
                            <div class="recipe_middle_block popup_block">
                                `+descriptions[String(game.bonus_catalog[i])][cur_lang]+`
                            </div>
                            <div class="recipe_right_block popup_block">
                                <img class="ingredient_img_1 popup_block" src="images/elements/`+ingredients[game.bonus_catalog[i]][0]+`.webp">
                                <div  id="ingredient_name_1_`+(i+ game.catalog.length)+`"  class="ingredient_name_1 popup_block ">
                                    `+all_elements[ingredients[game.bonus_catalog[i]][0]][cur_lang]+`
                                </div>

                                <img class="ingredient_img_2 popup_block" src="images/elements/`+ingredients[game.bonus_catalog[i]][1]+`.webp">
                                <div  id="ingredient_name_2_`+(i+ game.catalog.length)+`"  class="ingredient_name_2 popup_block ">
                                    `+all_elements[ingredients[game.bonus_catalog[i]][1]][cur_lang]+`
                                </div>
                            </div>
                        </div>
                    `)
                    game.recipes_amount += 1
                }
            }


        }

        if (game.user_type == 'pc' || game.user_type == 'sberportal') {
            $('#bottom_text').text(html_texts.bottom_text[cur_lang] + game.catalog.length)
            //textFit($('#bottom_text'), {alignVert: true, multiLine: true, maxFontSize: 25})
                    
        } else if (game.user_type == 'mobile') {
            $('#bottom_text').text(game.catalog.length + '/'+ COMMON_ELEMENTS_AMOUNT)
            //textFit($('#bottom_text'), {alignVert: true, multiLine: true, maxFontSize: 25})
        }

        game.game_ready = true
        
        if (changing_lang == false) {
            resize_screen();
        }

        window.addEventListener('resize', resize_screen, false);
        window.addEventListener('fullscreenchange', resize_screen, false)

        
    })
}



var search_nearest_element = function() {
    var min_dist = 1000;
    var nearest_element;
    for (var i=0; i < game.elements.length; i++) {
        var dist = Math.sqrt(Math.pow(game.elements[i].x - game.mouse_x, 2) + Math.pow(game.elements[i].y - game.mouse_y, 2))

        if (dist < min_dist) {
            min_dist = dist
            nearest_element = game.elements[i]
        }
    }

    return nearest_element
}

var generate_id = function() {
    var unique = false
    var id;
    while (unique == false) {
        unique = true
        id = Math.floor(Math.random() * 10000)

        for (var i=0; i < game.elements.length; i++) {
            if (id == game.elements[i].id) {
                unique = false
            }
        }
    }

    return id
}



var merge = function(el_1, el_2) {
    if (el_1.destroyed == false && el_2.destroyed == false && game.mouse_down == false) {
        var dist = Math.sqrt(Math.pow(el_1.x - el_2.x, 2) + Math.pow(el_1.y - el_2.y, 2))

        if (dist < el_1.width*0.5) {
            var product = false
            for (var j=0; j < reactions.length; j++) {
                if ((el_1.type == reactions[j][0] && el_2.type == reactions[j][1]) || (el_2.type == reactions[j][0] && el_1.type == reactions[j][1])) {
                    return reactions[j][2]
                }
            }

            return product
        } else {
            return false
        }
    } else {
        return false
    }
}

var clear_all = function() {
    for (var i=0; i < game.elements.length; i++) {
        game.elements[i].destroyed = true;
    }
}

var select_element_from_catalog = function(el) {
    var scrolling = false

    if (Math.abs(touch_delta_y) > 30) {
        scrolling = true
    }

    if (scrolling == false) {
        var id = el.id
        var element_type = el.dataset.id
        console.log('id', id)
        console.log('type', element_type)

        if (game.selected_from_catalog.includes(element_type) == false) {
            game.selected_from_catalog.push(element_type)
            $('#element_'+element_type+'_tick').css('display', 'block')
            
            $('.catalog_element_block').css('opacity', '0.3')
            for (var i=0; i < game.selected_from_catalog.length; i++) {
                $('[data-id="'+game.selected_from_catalog[i]+'"]').css('opacity', '1')
            }
        } else {
            removeItemAll(game.selected_from_catalog, element_type)
            $('#element_'+element_type+'_tick').css('display', 'none')
            $('[data-id="'+element_type+'"]').css('opacity', '0.3')
            if (game.selected_from_catalog.length == 0) {
                $('.catalog_element_block').css('opacity', '1')
            }
        }
    }
}

var put_elements_from_catalog = function() {
    $('#catalog_block').fadeOut()
    for (var i=0; i < game.selected_from_catalog.length; i++) {
        var x = Math.floor(Math.random() * game.winW * 0.7) + game.winW * 0.15;
        var y = Math.floor(Math.random() * game.winH * 0.7) + game.winH * 0.15;

        game.elements.push(new myElement(game.selected_from_catalog[i], x, y))
    }

    //game.selected_from_catalog = [];
    close_catalog();
}


// получение самой подсказки
var get_hint = function() {
    // если это будет первая подсказка
    if (game.hint_level == 0) {
        ym(82849870,'reachGoal','hint_1')
        $('#hint2_btn_2').css('display', 'block')
        var block_w = get_size('#inner_hint_block2').x
        var block_h = block_w * proportions.inner_hint_block2[1]
        var margin = block_h * 0.05
        set_size('.hint_2_button', (block_w - margin*4) / 2, (block_w - margin*4) / 2 * proportions.main_menu_button[1])
        //if (game.user_type == 'mobile') {
            //set_pos('#hint2_btn_1', margin, (get_size('#hint2_buttons').y - get_size('.hint_2_button').y)/2 +(block_h - get_size('#hint2_buttons').y) + get_pos('#inner_hint_block2').y)
            //set_pos('#hint2_btn_2', block_w - margin - get_size('#hint2_btn_2').x, (get_size('#hint2_buttons').y - get_size('.hint_2_button').y)/2+(block_h - get_size('#hint2_buttons').y) + get_pos('#inner_hint_block2').y)

        //} else {
            set_pos('#hint2_btn_1', margin )
            set_pos('#hint2_btn_2', block_w - margin - get_size('#hint2_btn_2').x)

        //}
        
        
        // ищем доступные элементы
        var candidates = []
        for (var i=0; i < reactions.length; i++) {
            var el_1 = reactions[i][0]
            var el_2 = reactions[i][1]

            var product = reactions[i][2]

            if (game.catalog.includes(el_1) && game.catalog.includes(el_2) && game.catalog.includes(product) == false && bonus_elements.includes(product) == false) {
                candidates.push(reactions[i])
            }
        }
        if (candidates.length > 0) {
            game.hint_level += 1
            var hint_reaction = random_element(candidates)
            game.hint_product = hint_reaction[2]
            game.hint_ingredient_1 = hint_reaction[0]
            game.hint_ingredient_2 = hint_reaction[1]

            var hint_block2_display = $('#hint_block2').css('display')
            $('#hint_block2').css('display', 'block')
            $('#hint_block2').css('opacity', '0')

            $('#hint_element_img').attr('src', 'images/elements/'+game.hint_product + '.webp')
            $('#hint_element_name').text(all_elements[game.hint_product][cur_lang])

            $('#hint2_btn_2').html(html_texts.hint2_btn_2_html_text[cur_lang])
            textFit($('.hint_2_button'), {alignVert: true, multiLine: true, maxFontSize: 20});
    


            $('#hint_ingredient_1_name').text(html_texts.hint_ingredient_1_name[cur_lang])
            

            $('#hint_ingredient_2_name').text(html_texts.hint_ingredient_2_name[cur_lang])
            

            // цвета реагентов
            var color_1_1 = hexToRgb(get_color(game.hint_ingredient_1)[0]);
            var color_1_2 = hexToRgb(get_color(game.hint_ingredient_1)[1]);
            
            var color_2_1 = hexToRgb(get_color(game.hint_ingredient_2)[0]);
            var color_2_2 = hexToRgb(get_color(game.hint_ingredient_2)[1]);
            
            $('#hint_ingredient_1_img').css('background-image', `
                linear-gradient(
                    45deg,
                    rgba(`+color_1_1[0]+`,`+color_1_1[1]+`,`+color_1_1[2]+`, 0.5),
                    rgba(`+color_1_2[0]+`,`+color_1_2[1]+`,`+color_1_2[2]+`, 0.5)
                    ), url('images/BallColor.webp')
            `)

            $('#hint_ingredient_2_img').css('background-image', `
                linear-gradient(
                    45deg,
                    rgba(`+color_2_1[0]+`,`+color_2_1[1]+`,`+color_2_1[2]+`, 0.5),
                    rgba(`+color_2_2[0]+`,`+color_2_2[1]+`,`+color_2_2[2]+`, 0.5)
                    ), url('images/BallColor.webp')
            `)

            $('#hint_ingredient_1_img').css('background-blend-mode', 'color');
            $('#hint_ingredient_2_img').css('background-blend-mode', 'color');

            $('#hint_block2').css('opacity', '1')
            open_hint2_block();
            textFit($('#hint_element_name'), {alignVert: true, multiLine: true, maxFontSize: 20});
            textFit($('#hint_ingredient_1_name'), {alignVert: true, multiLine: true, maxFontSize: 20});
            textFit($('#hint_ingredient_2_name'), {alignVert: true, multiLine: true, maxFontSize: 20});
        }

    } else if (game.hint_level == 1) {
        ym(82849870,'reachGoal','got_hint_2')
        var hint_block2_display = $('#hint_block2').css('display')
        $('#hint_block2').css('display', 'block')
        $('#hint_block2').css('opacity', '0')
        // раскроем первый элемент
        $('#hint_ingredient_1_img').css('background-image', 'url("images/elements/'+game.hint_ingredient_1+'.webp"), url("images/BallSimple.webp")')
        $('#hint_ingredient_1_name').text(all_elements[game.hint_ingredient_1][cur_lang])
        textFit($('#hint_ingredient_1_name'), {alignVert: true, multiLine: true, maxFontSize: 20});

        $('#hint_ingredient_1_img').css('background-blend-mode', 'normal');
        game.hint_level += 1
        $('#hint2_btn_2').html(html_texts.hint2_btn_2_html_text_alt[cur_lang])
        textFit($('.hint_2_button'), {alignVert: true, multiLine: true, maxFontSize: 20});
        $('#hint_block2').css('opacity', '1')
        $('#hint_block2').css('display', hint_block2_display)
        open_hint2_block();
    } else if (game.hint_level == 2) {
        ym(82849870,'reachGoal','get_hint_3')
        // раскроем второй элемент
        $('#hint_ingredient_2_img').css('background-image', 'url("images/elements/'+game.hint_ingredient_2+'.webp"), url("images/BallSimple.webp")')
        $('#hint_ingredient_2_name').text(all_elements[game.hint_ingredient_2][cur_lang])
        textFit($('#hint_ingredient_2_name'), {alignVert: true, multiLine: true, maxFontSize: 20});
        $('#hint_ingredient_2_img').css('background-blend-mode', 'normal');
        
        $('#hint2_btn_2').css('display', 'none')
        set_pos('#hint2_btn_1', (get_size('#hint2_buttons').x - get_size('#hint2_btn_1').x)/2 )
        
        game.hint_level = 0;
    }

}

var get_color = function(el) {
    for (var i=0; i < gradients.length; i++) {
        if (gradients[i][0] == el) {
            return [gradients[i][1], gradients[i][2]]
        }
    }
}

var add_to_catalog = function(el) {
    var catalog_block_display = $('#catalog_block').css('display')
    $('#catalog_block').css('display', 'block')
    $('#catalog_block').css('opacity', '0')
    
    $('.element_name, .recipe_element_name, .reward_element_name, .daily_reward_element_name, .mobile_reward_element_name, .ingredient_name_1, .ingredient_name_2').css('display', 'block')
    

    game.catalog.push(el)
    if (game.user_type == 'pc') {
        document.getElementById('elements_block').insertAdjacentHTML('beforeend', 
            `
            <div data-id=`+el+` id="element_`+(game.catalog.length)+`" class="catalog_element_block popup_block" onclick="select_element_from_catalog(this);">
                <img class="element_img popup_block" src="images/elements/`+el+`.webp">
                <div id="element_name_`+(game.catalog.length)+`" class="element_name popup_block ">
                    `+all_elements[el][cur_lang]+`
                </div>
                <div id="element_`+el+`_tick" class="catalog_element_tick popup_block" >
                    
                </div>
            </div>
        `)

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
        var block_w = (get_size('#inner_catalog_block').x - margin*2 - (0.5*margin)*7)/6
        
        set_size('.catalog_element_block', block_w, block_w * proportions.catalog_element_block[1])
        
        // изображение элемента
        $('.element_img').attr('width', get_size('.catalog_element_block').x * 0.8 +'px')
        
        set_pos('.element_img', get_size('.catalog_element_block').x*0.1)
        
        // блок подписи элемента
        set_pos('.element_name', block_w*0.025, get_size('.catalog_element_block').x*0.8)
        set_size('.element_name', block_w*0.95, block_w * proportions.catalog_element_block[1] - block_w*0.7)

        
        // позиции блоков
        var i = game.catalog.length-1;
        
        set_pos('#element_'+(game.catalog.length), margin/2 + (i % 6)*margin/2 + (i%6)*block_w, Math.floor(i / 6) * block_w* proportions.catalog_element_block[1] + (Math.floor(i/6)+1)*(margin/2) )
        textFit($('#element_name_' + (game.catalog.length)), {multiLine: true, maxFontSize: 20})  
    
        //textFit($('.ingredient_name_1, .ingredient_name_2'), {multiLine: true, maxFontSize: 20});
        // размер галочек
        set_size('.catalog_element_tick', block_w*0.25, block_w*0.25)
        set_pos('.catalog_element_tick', block_w*0.05, block_w*0.05)


    } else if (game.user_type == 'mobile') {

        $('#elements_block').append(`
            <div data-id=`+el+` id="element_`+(game.catalog.length)+`" class="catalog_element_block popup_block" ontouchend="select_element_from_catalog(this);">
                <img class="element_img popup_block" src="images/elements/`+el+`.webp">
                <div id="element_name_`+(game.catalog.length)+`" class="element_name popup_block ">
                    `+all_elements[el][cur_lang]+`
                </div>
                <div id="element_`+el+`_tick" class="catalog_element_tick popup_block" >
                    
                </div>
            </div>
        `)

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
        var i = game.catalog.length-1;
        set_pos('#element_'+(i+1), margin/2 + (i % 3)*margin/2 + (i%3)*block_w, Math.floor(i / 3) * block_w* proportions.catalog_element_block[1] + (Math.floor(i/3)+1)*(margin/2) )
        textFit($('#element_name_' + (i+1)), {multiLine: true, maxFontSize: 20})  
        var margin = get_size('#inner_catalog_block').x * 0.05
        var block_w = (get_size('#elements_block').x - (0.5*margin)*4)/3
        set_size('.catalog_element_tick', block_w*0.25, block_w*0.25)
        set_pos('.catalog_element_tick', block_w*0.05, block_w*0.05)
    }

    // блок с рядами

    
   
    $('.element_name, .recipe_element_name, .reward_element_name, .daily_reward_element_name, .mobile_reward_element_name, .ingredient_name_1, .ingredient_name_2').css('display', 'table')
    $('.element_name span, .recipe_element_name span, .reward_element_name span, .daily_reward_element_name span, .mobile_reward_element_name span, .ingredient_name_1 span, .ingredient_name_2 span').css('display', 'table-cell')
    

    $('#catalog_block').css('opacity', '1')
    $('#catalog_block').css('display', catalog_block_display)

    //resize_screen();
}

var add_recipe = function(el) {
    if (game.recipes.includes(el) == false) {
        var recipe_book_block_display = $('#recipe_book_block').css('display')
        game.recipes.push(el)
        $('#recipe_book_block').css('display', 'block')

        $('#recipe_book_block').css('opacity', '0')
        $('.element_name, .recipe_element_name, .reward_element_name, .daily_reward_element_name, .mobile_reward_element_name, .ingredient_name_1, .ingredient_name_2').css('display', 'block')
        

        if (game.user_type == 'pc') {
            $('#recipes_block').append(`
                <div id="recipe_`+(game.recipes_amount+4)+`" class="recipe">
                    <div class="recipe_left_block popup_block">
                        <img class="recipe_element_img popup_block" src="images/elements/`+el+`.webp">
                        <div class="recipe_element_name popup_block ">
                            `+all_elements[el][cur_lang]+`
                        </div>
                    </div>
                    <div class="recipe_middle_block popup_block">
                       `+descriptions[String(el)][cur_lang]+`
                    </div>
                    <div class="recipe_right_block popup_block">
                        <img class="ingredient_img_1 popup_block" src="images/elements/`+ingredients[el][0]+`.webp">
                        <div id="ingredient_name_1_`+(game.recipes_amount+4)+`"  class="ingredient_name_1 popup_block ">
                            `+all_elements[ingredients[el][0]][cur_lang]+`
                        </div>

                        <img class="ingredient_img_2 popup_block" src="images/elements/`+ingredients[el][1]+`.webp">
                        <div  id="ingredient_name_2_`+(game.recipes_amount+4)+`" class="ingredient_name_2 popup_block ">
                            `+all_elements[ingredients[el][1]][cur_lang]+`
                        </div>
                    </div>
                </div>
            `)

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

            
                textFit($('#recipe_'+(game.recipes_amount+4)+' .recipe_element_name'), {multiLine: true, maxFontSize: 20});
                //console.log('#recipe_'+(i+1)+' .ingredient_name_1')
                
                textFit($('#ingredient_name_1_'+(game.recipes_amount+4)), {multiLine: true, maxFontSize: 20});
                textFit($('#ingredient_name_2_'+(game.recipes_amount+4)), {multiLine: true, maxFontSize: 20});
            



        } else if (game.user_type == 'mobile') {
            $('#recipes_block').append(`
                <div  id="recipe_`+(game.recipes_amount+4)+`"  class="recipe">
                    <img class="recipe_line" src="images/Line.webp">
                    <div class="recipe_left_block popup_block">
                        <img class="recipe_element_img popup_block" src="images/elements/`+el+`.webp">
                        <div class="recipe_element_name popup_block ">
                            `+all_elements[el][cur_lang]+`
                        </div>
                    </div>
                    <img class="recipe_ravno_block popup_block" src="images/RavnoBlock.png">
                    <div class="recipe_middle_block popup_block">
                        `+descriptions[el][cur_lang]+`
                    </div>
                    <div class="recipe_right_block popup_block">
                        <img class="ingredient_img_1 popup_block" src="images/elements/`+ingredients[el][0]+`.webp">
                        <div id="ingredient_name_1_`+(game.recipes_amount+4)+`" class="ingredient_name_1 popup_block ">
                            `+all_elements[ingredients[el][0]][cur_lang]+`
                        </div>

                        <img class="ingredient_img_2 popup_block" src="images/elements/`+ingredients[el][1]+`.webp">
                        <div id="ingredient_name_2_`+(game.recipes_amount+4)+`" class="ingredient_name_2 popup_block ">
                            `+all_elements[ingredients[el][1]][cur_lang]+`
                        </div>
                    </div>
                </div>
            `)

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

            
                textFit($('#recipe_'+(game.recipes_amount+4)+' .recipe_element_name'), {multiLine: true, maxFontSize: 20});
                //console.log('#recipe_'+(i+1)+' .ingredient_name_1')
                
                textFit($('#ingredient_name_1_'+(game.recipes_amount+4)), {multiLine: true, maxFontSize: 20});
                textFit($('#ingredient_name_2_'+(game.recipes_amount+4)), {multiLine: true, maxFontSize: 20});
            
        }

        game.recipes_amount += 1

        
         $('.element_name, .recipe_element_name, .reward_element_name, .daily_reward_element_name, .mobile_reward_element_name, .ingredient_name_1, .ingredient_name_2').css('display', 'table')
        $('.element_name span, .recipe_element_name span, .reward_element_name span, .daily_reward_element_name span, .mobile_reward_element_name span, .ingredient_name_1 span, .ingredient_name_2 span').css('display', 'table-cell')


        $('#recipe_book_block').css('opacity', '1')
        $('#recipe_book_block').css('display', recipe_book_block_display)
        //resize_screen();
    }
}

var send_report = function() {
    ym(82849870,'reachGoal','send_report')
    console.log($('#send_report_textarea').val())
    var report = {
        "winW": game.winW,
        "winH": game.winH,
        "user_type": game.user_type,
        "mouse_down": game.mouse_down,
        "catalog": game.catalog,
        "bonus_catalog": game.bonus_catalog,
        "mouse_x": game.mouse_x,
        "mouse_y": game.mouse_y,
        "elements": [],
        "cur_lang": game.cur_lang,
        "selected_element": 0,
        "new_element": 0,
        "shift_x": game.shift_x,
        "shift_y": game.shift_y,
        "data": game.data,
        "platform": game.platform,
        "game_ready": game.game_ready,
        "selected_from_catalog": game.selected_from_catalog,
        "recipes_book_loaded": game.recipes_book_loaded,
        "hint_level": game.hint_level,
        "hint_ingredient_1": game.hint_ingredient_1,
        "hint_ingredient_2": game.hint_ingredient_2,
        "hint_product": game.hint_product,
        "errors": game.errors,
        "USER_MESSAGE": $('#send_report_textarea').val()
    };

    for (var i=0; i < game.elements.length; i++) {
        report.elements.push(game.elements[i].get_info())
    }

    if (game.selected_element != 0) {
        report.selected_element = game.selected_element.get_info()
    }

    if (game.new_element != 0) {
        report.new_element = game.new_element.get_info()
    }


    // генерируем репорт


    console.log(report)
    console.log(JSON.stringify(report))

   //let url = "http://localhost:3000/2";

   // 1. Создаём новый объект XMLHttpRequest
    var xhr = new XMLHttpRequest();
    
    
    // 2. Конфигурируем его: POST-запрос на URL http://127.17.0.1:8080/function/histogram/
    xhr.open('POST', 'https://ingenium-alchemy.herokuapp.com/report', true);
    //xhr.open('POST', 'https://localhost:3000/report', true);
    //xhr.setRequestHeader("Access-Control-Allow-Origin", "https://evil-eagle-97.loca.lt")
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*")

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Accept", "application/json");
    

    // 3. Отсылаем запрос
    //console.log(xhr.response)
    //response.addHeader("Access-Control-Allow-Origin", "*")
    xhr.send(JSON.stringify(report));

    close_send_report_block();

}

var make_err = function() {
    get_size(impossible.lol.e).x
}

var create_request = function(URL, type) {
    var xhr = new XMLHttpRequest();

    xhr.open('POST', URL+'/report', true);

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Accept", "application/json");
    

    return xhr;
}

var mute = function() {
    if (game.muted) {
        game.muted = false
        $("#mute_block").toggleClass('mute_ico unmute_ico');
        $("#sound_ico").toggleClass('mute_ico unmute_ico');
        music_1_sound.play();
    } else {
        game.muted = true
        $("#mute_block").toggleClass('unmute_ico mute_ico');
        $("#sound_ico").toggleClass('unmute_ico mute_ico');
        music_1_sound.stop()
        music_2_sound.stop()
    }
}

var setup_daily_reward = function(day_num) {

    if (game.user_type == 'pc') {
        var daily_reward_block_display = $('#daily_reward_block').css('display')
        $('#daily_reward_block').css('display', 'block')
        $("#daily_reward_block").css('opacity', '0')
        for (var i=day_num+1; i <=5; i++) {
            $('#daily_reward_element_'+i+'_img').css('filter', 'blur(10px)')
            $('#daily_reward_element_'+(i+1)+'_name').text('???')
        }
        textFit($('.daily_reward_element_name'), {multiLine: true, maxFontSize: 20})
        $('.daily_reward_element_name span').css('display', 'table-cell')
        $('#daily_reward_block').css('display', daily_reward_block_display)
        $("#daily_reward_block").css('opacity', '1')
    } else if (game.user_type == 'mobile') {
        var mobile_daily_reward_block_display = $('#mobile_daily_reward_block').css('display')
        $('#mobile_daily_reward_block').css('display', 'block')
        $('#mobile_daily_reward_block').css('opacity', '0')
        if (day_num == 1) {
            $('#mobile_reward_element_1').css('opacity', '0')
            $('#mobile_reward_element_2_img').attr('src', 'images/elements/130.webp')
            $('#mobile_reward_element_2_name').text(all_elements[130][cur_lang])

            $('#mobile_reward_element_3_img').attr('src', 'images/elements/131.webp')
            $('#mobile_reward_element_3_name').text(all_elements[131][cur_lang])
        } else if (day_num == 5) {
            $('#mobile_reward_element_3').css('opacity', '0')
            $('#mobile_reward_element_1_img').attr('src', 'images/elements/133.webp')
            $('#mobile_reward_element_1_name').text(all_elements[133][cur_lang])

            $('#mobile_reward_element_2_img').attr('src', 'images/elements/134.webp')
            $('#mobile_reward_element_2_name').text(all_elements[134][cur_lang])
        } else {
            $('#mobile_reward_element_1').css('opacity', '1')
            $('#mobile_reward_element_3').css('opacity', '1')
            $('#mobile_reward_element_1_img').attr('src', 'images/elements/'+ (130+day_num-2) +'.webp')
            $('#mobile_reward_element_1_name').text(all_elements[(130+day_num-2)][cur_lang])

            $('#mobile_reward_element_2_img').attr('src', 'images/elements/'+(130+day_num-1)+'.webp')
            $('#mobile_reward_element_2_name').text(all_elements[(130+day_num-1)][cur_lang])

            $('#mobile_reward_element_3_img').attr('src', 'images/elements/'+(130+day_num)+'.webp')
            $('#mobile_reward_element_3_name').text(all_elements[(130+day_num)][cur_lang])
        }

        $('.mobile_reward_element_name').css('display', 'block')

        textFit($('.mobile_reward_element_name'), {multiLine: true, maxFontSize: 20});

        $('.mobile_reward_element_name').css('display', 'table')
        $('.mobile_reward_element_name span').css('display', 'table-cell')

        $('#mobile_day_counter').text(day_num + " " + html_texts.mobile_day_counter_text[cur_lang])
        $('#mobile_daily_reward_block').css('opacity', '1')
        $('#mobile_daily_reward_block').css('display', mobile_daily_reward_block_display)
    }

    
}

var setup_event_daily_reward = function(day_num) {
    var event_daily_reward_block_display = $('#event_daily_reward_block').css('display')
    $('#event_daily_reward_block').css('display', 'block')
    $("#event_daily_reward_block").css('opacity', '0')

    $('#reward_element_1_img').attr('src', 'images/elements/Spring_day'+day_num+'_1.webp')
    $('#reward_element_2_img').attr('src', 'images/elements/Spring_day'+day_num+'_2.webp')
    $('#reward_element_3_img').attr('src', 'images/elements/Spring_day'+day_num+'_3.webp')

    $('#reward_element_1_name').text(all_elements[('Spring_day'+day_num+'_1')][cur_lang])
    $('#reward_element_2_name').text(all_elements[('Spring_day'+day_num+'_2')][cur_lang])
    $('#reward_element_3_name').text(all_elements[('Spring_day'+day_num+'_3')][cur_lang])

    $('#day_counter').text(day_num + ' день')

    textFit($('.reward_element_name'), {alignVert: true, multiLine: true, maxFontSize: 20})
    //textFit($('#reward_element_1_name'), {alignVert: true, multiLine: true, maxFontSize: 20})
    //textFit($('#reward_element_2_name'), {alignVert: true, multiLine: true, maxFontSize: 20})
    //textFit($('#reward_element_3_name'), {alignVert: true, multiLine: true, maxFontSize: 20})
    
    textFit($('#day_counter'), {alignVert: true, multiLine: true, maxFontSize: 20})

    $('#event_daily_reward_block').css('opacity', '1')
    $('#event_daily_reward_block').css('display', event_daily_reward_block_display)
}

var add_everything = function() {
    for (var i=5; i < 138; i++) {

        if (game.catalog.includes(i) == false) {
            game.catalog.push(i)
        }
        //add_to_catalog(i)
        //add_recipe(i)
    }
    //resize_screen()
}

var get_reward = function() {
   
    if (game.is_event) {
        var day_num = game.event_day_counter;
        ym(82849870,'reachGoal','spring_event_day_'+day_num)
        if (game.bonus_catalog.includes('Spring_day'+day_num+'_1') == false) {
            game.bonus_catalog.push('Spring_day'+day_num+'_1')

        }
        if (game.bonus_catalog.includes('Spring_day'+day_num+'_2') == false) {
            game.bonus_catalog.push('Spring_day'+day_num+'_2')
        }
        if (game.bonus_catalog.includes('Spring_day'+day_num+'_3') == false) {
            game.bonus_catalog.push('Spring_day'+day_num+'_3')
        }
        if (game.catalog.includes('Spring_day'+day_num+'_1') == false) {
            add_recipe('Spring_day'+day_num+'_1')

        }
        if (game.catalog.includes('Spring_day'+day_num+'_2') == false) {
            add_recipe('Spring_day'+day_num+'_2')
        }
        if (game.catalog.includes('Spring_day'+day_num+'_3') == false) {
            add_recipe('Spring_day'+day_num+'_3')
        }
    } else {
        var day_num = game.data.day_counter
        if ([1,2,3,4,5].includes(day_num)) {
            ym(82849870,'reachGoal','bonus_day_'+day_num)
            if (game.bonus_catalog.includes(129 + day_num) == false) {
                game.bonus_catalog.push(129 + day_num)
            }
            
            if (game.catalog.includes(129 + day_num) == false) {
                add_recipe(129 + day_num)
            }
        }
    }
    console.log(game.bonus_catalog)
    window.localStorageFallback.setItem('bonus_catalog_', JSON.stringify(game.bonus_catalog))
    //resize_screen()
}



var init_sdk = function() {
    console.log('remote log test');
    // ЯНДЕКС sdk по умолчанию инициализирован
    if (PLATFORM_TYPE == 'vk') {
        VK.init(function() {
         // API initialization succeeded
         // Your code here
        }, function() {
         // API initialization failed
         // Can reload page here
        }, '5.131');

        
        
        var user_id = null;   // user's id
        var app_id = 7925994;  // your app's id
     
        admanInit({
            user_id: user_id,
            app_id: 7925994,
            type: 'preloader',         // 'preloader' or 'rewarded' (default - 'preloader')
            params: {preview: 1}   // to verify the correct operation of advertising
        }, onAdsReady, onNoAds);
     
        function onAdsReady(adman) {
            game.sdk_ready = true
            adman.onStarted(function () {});
            adman.onCompleted(function() {});          
            adman.onSkipped(function() {});          
            adman.onClicked(function() {});
            adman.start('preroll');
            vkBridge.send("VKWebAppShowNativeAds", {ad_format:"preloader"})
                .then(data => console.log(data.result))
                .catch(error => console.log(error));
        };
        function onNoAds() {};
      
    } else if (PLATFORM_TYPE == 'sber') {
        console.log('сбер рулит')
        var onSuccess = () => {
            game.sdk_ready = true
            console.log('AdSdk Inited');
            $('#version_text').css('color', 'green')
            //alert('weeee')
        };
        var onError = (err) => {
            console.error('AdSDK Init Error', err);
            $('#version_text').css('color', 'red')
            //alert(err)
        };

        //window.SberDevicesAdSDK.init({ onError, onSuccess, test: true })
        //var token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZjAwMThiNWZhMGIzNzczNTYwM2ZiZDcyMjliNDY2MDNmNTEwMzI0YzQ0ODlkZjIwNWM1YTczMDM5NTk2Yzk5NDdhYTYiLCJhdWQiOiJWUFMiLCJleHAiOjE2NDg4MTI0NTEsImlhdCI6MTY0ODcyNjA0MSwiaXNzIjoiS0VZTUFTVEVSIiwidHlwZSI6IkJlYXJlciIsImp0aSI6ImUxZjJkY2JjLWM3NzgtNDRmYy1iZTcxLTYzY2ZlMGZkZjQxOSIsInNpZCI6IjNlZmU2ZTE4LWE5OTItNGUxMS1iNTU4LTJiNGE5Y2ExOTVkNSJ9.h4v73TzyWSg7JRz-4x385AtRkCQud4F6_9owD_dFPt-tR3awozKHz4U4yGezOGcwCmeuQU5Xlq0FrB73khbQEq-qQR_rf1FZBTdE2h9z_ADSnu6UX8BKONuG3DWAvUzJRxWGGomfFAA3S4b2AzsI5kvg2ZnA_hs_o2eONHIwi9AaFaMOyUvP2NBBy-yEG9Je7s9oXynH1EzA_p1REStnWnihAfxUnBLYGOsxh0NhFrak_wRM0j6xTe0DCBWWQPgiMWCQi613iX02hOX7PIsqKMahHchZIHdnj7ba9H_VIqMJzwFzFf33iX-P3g6n8ua-Hq28gjVRuFBb0ocsMS655_vebfVBb6cQEXLlb8D2fMnc4IYT5G5A0NxtNWYUaZ8bFV3BA0w7e1VnHExDtrLRbmFPp8GXfDFiU2ZcQbojX7E8QzCUAYhDDnwW-dWenxoDEkLkUBQimyNBpbNruKNH80yOPCV3m30CQhF5b1InRHiSbhS9ELyGMBErwLATR8RMoh3oR9vKk6kkPEtxZFH3smA_XNu8gv72mpLd3KHtWGJeeinA3xJykPhd3hJfV2_hIndavTXI5Nb4GyVQ7mbJDLNh3v_uHCLPqUeCRJ1cIKbbTOvu4SFohirY8WgwBfY2ZzYbdud5KuFi8eKSGQOAZffTjeCwMoYd6ewDU1y2FO4'
        //var initPhrase = 'запусти чудесная алхимия'; // <- сюда вставляем активизационную фразу
        const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZjAwMThiNWZhMGIzNzczNTYwM2ZiZDcyMjliNDY2MDNmNTEwMzI0YzQ0ODlkZjIwNWM1YTczMDM5NTk2Yzk5NDdhYTYiLCJhdWQiOiJWUFMiLCJleHAiOjE2NTc2ODkzOTMsImlhdCI6MTY1NzYwMjk4MywiaXNzIjoiS0VZTUFTVEVSIiwidHlwZSI6IkJlYXJlciIsImp0aSI6IjUwMTAyM2ZiLTNlMDktNDU0My05ZGQ5LTg5OThjODg3MTM4MiIsInNpZCI6IjJhNzM3Y2MzLWEzZmItNDdlNS04YzRkLTQ3MGI0OGEzOWY0ZCJ9.OKLSm0KhqiDj_cAA3vdzxJ071KkLnqdENg-ltAX0ICcZZLbfkv0owYSTDn2V-oSMkwdyuQ2RPelTcXT7JY8wLTCd7mSbIecDg_W-OdF1Gj0SmLa3bTHX4GIYkN3dnE9GGrqwXx3xigs1-vHI_U72hxxe0KYi6zFBXkp49e89odQLidP6a5e0i40ogDidYKTLLtT-__iapiJ2fHLhhYQ8Uo1AQWKC2VoPqz7hWnpMqnEqRA0338ot_pb0VmTWSTzwRdvy1sb1mqi7IM3J49cPxZAu9L0K-b5osN26wN8qNfBQLPo3vDc7tUgvQla1ONZoInfPykmKAyOLTa9gdvn8pAQ31hJ_hW5Or0Pl2rPH_UCQiYe0A04MV3gEnkYFmi2x3c1S5GadRL8e1z-KqyXAzPCJLKrnybGk9dc5RwMoBrRbJrN9CfPqlTNxroerKxG2mxkbwg_bkP_GEXchSPN08M-NYSFegWZ7zrGdm8nvBLLkDyFHN7swkrgiTW9JNp5nGXV1U7vM3n9EU3zcD-gQ-GC2XyWHdDLDzdj2slp5CGdtx63DEeAuDPY_5UFqmRcLnrMGg9k1WRctImeYIxBi6GbmEck6fFhxm359KeRhYH1gaDPBsS-TACNJxGsJbsudgoxE1y3Seb_9Ysb7beM4teJtiqNcVTwahLKwHS1J3JI' 
        const initPhrase = 'Запусти Чудесная Алхимия';

        if (sber_testing) {
            window.SberDevicesAdSDK.initDev({ token: token, initPhrase: initPhrase, onSuccess, onError, test: true });
        
        } else {
            window.SberDevicesAdSDK.init({onSuccess, onError, test: false})

        }

        

        //var ac = assistant.createAssistant({ getState: () => state });
        //alert(initPhrase)
        //window.SberDevicesAdSDK.initDev({ token: token, initPhrase: initPhrase, onSuccess, onError, test: true });
        
        /*window.assistant.createAssistant({

            getState: () => {

              return {};

            },

        });*/
    } else if (PLATFORM_TYPE == 'gamemonetize') {
        window.SDK_OPTIONS = {
            gameId: "mbhvcbunhuru6t4h7b37sgtfehf1vl77",
            onEvent: function (a) {
                switch (a.name) {
                    case "SDK_GAME_PAUSE":
            
                    // pause game logic / mute audio
                    break;
                    case "SDK_GAME_START":
                        
                        // advertisement done, resume game logic and unmute audio
                    break;
                    case "SDK_READY":
                        console.log('[gm] sdk ready')
                        game.sdk_ready = true
                        // when sdk is ready
                    break;
                }
            }     
        };
        (function (a, b, c) {
            var d = a.getElementsByTagName(b)[0];
            a.getElementById(c) || (a = a.createElement(b), a.id = c, a.src = "https://api.gamemonetize.com/sdk.js", d.parentNode.insertBefore(a, d))
        })(document, "script", "gamemonetize-sdk"); 
    } else if (PLATFORM_TYPE == 'heroku') {
        game.sdk_ready = true
    }
}

var show_interistial_ad = function() {
    if (game.sdk_ready) {
        if (PLATFORM_TYPE == 'yandex') {
            //game.sdk
            game.sdk.adv.showFullscreenAdv({
                callbacks: {
                    onClose: function(wasShown) {
                    // some action after close
                        if (wasShown) {
                            game.adv_show_last_time = Date.now()
                        }
                    },
                    onError: function(error) {
                    // some action on error
                    console.log(error)
                    }
                }
            })
        } else if (PLATFORM_TYPE == 'vk') {
            vkBridge.send("VKWebAppCheckNativeAds", {"ad_format": "interstitial"});

            vkBridge.send("VKWebAppShowNativeAds", {ad_format:"interstitial"})
                .then(function(data) {
                    console.log(data.result)
                    game.adv_show_last_time = Date.now()
                })
                .catch(error => console.log(error));
        } else if (PLATFORM_TYPE == 'sber') {
            var onSuccess = function() {
                game.adv_show_last_time = Date.now()
            }
            var onError = function(e) {
                console.log(e)
            }
            window.SberDevicesAdSDK.runBanner({
                onSuccess,
                onError,
            });
        }
    }
}

var show_safe_interistial_ad = function() {
    var should_show_ad = ((Date.now() - game.adv_show_last_time) >= AD_INTERVAL && (Date.now() - game.launch_time) >= AD_DELAY);
    if (game.sdk_ready && should_show_ad) {
        if (PLATFORM_TYPE == 'yandex') {
            //game.sdk
            console.log('показываем рекламу')
                game.sdk.adv.showFullscreenAdv({
                    callbacks: {
                        onClose: function(wasShown) {
                        // some action after close
                            if (wasShown) {
                                game.adv_show_last_time = Date.now()
                                ym(82849870,'reachGoal','fullscreen_ad_ya')
                            }
                        },
                        onError: function(error) {
                        // some action on error
                        }
                    }
                })
            }
         else if (PLATFORM_TYPE == 'vk') {
            vkBridge.send("VKWebAppCheckNativeAds", {"ad_format": "interstitial"});

            vkBridge.send("VKWebAppShowNativeAds", {ad_format:"interstitial"})
                .then(function(data) {
                    console.log(data.result)
                    game.adv_show_last_time = Date.now()
                })
                .catch(error => console.log(error));
        } else if (PLATFORM_TYPE == 'sber') {
            var onSuccess = function() {
                game.adv_show_last_time = Date.now()
            }
            var onError = function(e) {
                console.log(e)
            }
            window.SberDevicesAdSDK.runBanner({
                onSuccess,
                onError,
            });
        }
    }
}

var show_rewarded_video = function(success_callback) {
    if (game.sdk_ready) {
        if (PLATFORM_TYPE == 'yandex') {
            if (game.hint_level == 1) {
                ym(82849870,'reachGoal','hint_2')
            } else if (game.hint_level == 2) {
                ym(82849870,'reachGoal','hint_3')
            }
            game.sdk.adv.showRewardedVideo({
                callbacks: {
                    onOpen: () => {
                        console.log('Video ad open.');
                        if (game.muted == false) {
                            music_1_sound.stop()
                            music_2_sound.stop()
                        }
                    },
                    onRewarded: () => {
                        console.log('Rewarded!');
                        success_callback()
                    },
                    onClose: () => {
                        console.log('Video ad closed.');
                        if (game.muted == false) {
                            music_1_sound.play();
                        }
                    }, 
                    onError: (e) => {
                        console.log('Error while open video ad:', e);
                    }
                }
            })
        } else if (PLATFORM_TYPE == 'vk') {
            vkBridge.send("VKWebAppCheckNativeAds", {"ad_format": "reward"});
            vkBridge.send("VKWebAppShowNativeAds", {ad_format:"reward"})
            .then(function(data) {
                success_callback()
            })
            .catch(error => console.log(error));
        } else if (PLATFORM_TYPE == 'sber') {
            if (game.muted == false) {
                music_1_sound.stop()
                music_2_sound.stop()
            }
            window.SberDevicesAdSDK.runVideoAd({
                onSuccess: function() {
                    console.log('lol')
                    
                    success_callback();
                    if (game.muted == false) {
                        music_1_sound.play()
                    }
                    
                }, 
                onError: function(e) {
                    console.log(e)
                }, 
                mute: false,
            });
        } else if (PLATFORM_TYPE == 'heroku') {
            Howler.volume(0);
          if (game.muted == false) { 
              music_1_sound.stop()
              music_2_sound.stop()
          }
          open_test_ad();
          setTimeout(function() {
            Howler.volume(1)
            success_callback();

            if (game.muted == false) {
                music_1_sound.play()
                Howler.volume(1);
            }
          }, SAMPLE_AD_DURATION*1000)
        }
    }
}

var get_review = function() {
    if (game.sdk_ready) {
        if (PLATFORM_TYPE == 'yandex') {

            game.sdk.feedback.canReview()
            .then(({ value, reason }) => {
                if (value) {
                    ysdk.feedback.requestReview()
                        .then(({ feedbackSent }) => {
                            console.log(feedbackSent);
                            ym(82849870,'reachGoal','feedback_sent')
                        })
                } else {
                    console.log(reason)
                }
            })
        } else if (PLATFORM_TYPE == 'sber') {
            var assistantRef = window.SberDevicesAdSDK.getAssistantRef();
            var assistant = assistantRef.current;
            //try {
                assistant.sendData({ action: { action_id: 'SHOW_RATING_SUGGEST'} });
            //} catch (e) {
                //console.log(e)
                //console.log(e.toString())
                
            //}
            
        }
    }
}

var share = function() {
    if (game.sdk_ready) {
        if (PLATFORM_TYPE == 'vk') {
            vkBridge.send("VKWebAppShowInviteBox", {})
            .then(function(data) { 
                console.log(data.success)
                ym(82849870,'reachGoal','vk_repost')
            })
            .catch(error => console.log(error));
        }
    }
}