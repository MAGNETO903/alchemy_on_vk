(function(window) {
  'use strict';

  window.admanInit = function(opts, onReady, onNoAds) {
    var mobileSlots = [337682, 920663];
    var webSlots = [2060, 920718];

    if (!opts.user_id || !opts.app_id) {
      console.log('user_id or app_id not passed')
      if (onNoAds) {
        onNoAds(opts);
      }
      return;
    }

    if (!opts.alreadyUsedSlots) {
      opts.alreadyUsedSlots = [];
    }

    if (!opts.langs) {
      opts.langs = {};
    }

    var langs = opts.langs;
    var baseSlots = opts.mobile ? mobileSlots : webSlots;

    // Delete already used slots
    var uniqueSlots = baseSlots.filter(function(x) { return !opts.alreadyUsedSlots.includes(x)});

    if (!window.AdmanHTML) {
      if (onNoAds) onNoAds(opts);
      return;
    }

    var params = {
      vk_id: opts.user_id,
      content_id: opts.app_id,
      type_load: opts.type == 'rewarded' ? 2 : 1,
      rewarded: opts.type == 'rewarded' ? 1 : 0
    };
    if (opts.params) {
      for (var key in opts.params) {
        if (opts.params.hasOwnProperty(key) &&  opts.params[key] != null) {
          params[key] = opts.params[key];
        }
      }
    }

    var layerEl       = elFromHtml(htmlTemplate);
    var contentEl     = layerEl.querySelector('.adman_content');
    var videoEl       = layerEl.querySelector('.adman_video');
    var timerRemained = layerEl.querySelector('.adman_timer_remained');
    var buttonMute    = layerEl.querySelector('.adman_button_mute');

    if (opts.mobile) {
      contentEl.classList.add('adman_content_fluid');
    }

    if (opts.appendChildHTML) {
      layerEl.classList.add('admanLayerInFrame');
    }

    layerEl.appendChild(elFromHtml(stylesTemplate));

    var adman = new window.AdmanHTML();

    adman.setDebug(!!opts.debug);

    var selectedSlot = uniqueSlots[0];
    opts.selectedSlot = selectedSlot;
    adman.init({
      slot: selectedSlot,
      wrapper: contentEl,
      videoEl: videoEl,
      videoQuality: 360,
      params: params,
      browser: browser,
      config: config
    });

    // adman doesnt support multiple callbacks listening for same event so we need a kostyl here
    var clientCallbacks = {};
    var admanCallback = function(callbackName, callback) {
      adman[callbackName](function() {
        callback.apply(null, arguments);
        if (clientCallbacks[callbackName]) clientCallbacks[callbackName].apply(null, arguments);
      });
      adman[callbackName] = function(clientCallback) {
        clientCallbacks[callbackName] = clientCallback;
      };
    };

    var admanStart = adman.start;
    adman.start = function() {
      var appendForm = opts.appendChildHTML || document.body;
      appendForm.appendChild(layerEl);

      videoEl.controls = false;
      videoEl.onvolumechange = onVolumeChange;
      buttonMute.onclick = onClickMute;
      onVolumeChange();
      admanStart.apply(adman, arguments);
    };

    admanCallback('onReady', function() {
      var banners = adman.getBannersForSection('preroll');
      var hasVideoBanners = banners.some(function(banner) {
        return banner.type && banner.type !== 'statistics';
      });
      if (hasVideoBanners) {
        if (onReady) onReady(adman, opts);
      } else {
        adman.destroy();
        opts.alreadyUsedSlots.push(selectedSlot);

        if (baseSlots.length === opts.alreadyUsedSlots.length) {
          if (onNoAds) {
            onNoAds(opts);
          }
          return;
        }

        window.admanInit(opts, onReady, onNoAds);
      }
    });

    var currentBanner;

    admanCallback('onStarted', function(section, banner) {
      currentBanner = banner;
      if (!currentBanner.hasVolume) {
        buttonMute.classList.add('hidden');
      }
    });

    admanCallback('onCompleted', function() {
      currentBanner = null;
      var removeBodyHTML = opts.appendChildHTML || document.body;
      removeBodyHTML.removeChild(layerEl);
      adman.destroy();
    });

    admanCallback('onTimeRemained', function(data) {
      if (!currentBanner || currentBanner.showControls === false) {
        return;
      }

      var cantSkipSeconds = Math.round(data.remained);
      if (langs.adsWithSeconds) {
        timerRemained.innerHTML = langs.adsWithSeconds.replace('{seconds}', cantSkipSeconds);
      } else {
        timerRemained.innerHTML = 'Р РµРєР»Р°РјР° <b>' + cantSkipSeconds + '</b>';
      }

      if (typeof adman.skip === 'function' && currentBanner.allowCloseDelay && currentBanner.allowCloseDelay < data.duration) {
        timerRemained.innerHTML = langs.ads || 'Р РµРєР»Р°РјР°';
      }
    });

    admanCallback('onPlayed', function() {
      videoEl.controls = false;
    });

    function onClickMute() {
      var unmute = !!buttonMute.dataset.muted;
      adman.setVolume(unmute ? 1 : 0);
      videoEl.muted = !unmute;
      changeMuteState(!unmute);
    }

    function onVolumeChange() {
      var muted = videoEl.muted || !videoEl.volume;
      changeMuteState(muted);
    }

    function changeMuteState(muted) {
      if (muted) {
        buttonMute.dataset.muted = 'muted';
      } else {
        delete buttonMute.dataset.muted;
      }
    }

    return adman;
  };

  var browser = {
    mobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
    FLASH_BLOCKED: 0,
    FLASH_READY: 1,
    FLASH_UNKNOWN: 2,
    checkFlashStatus: function(callback) {
      callback(browser.FLASH_UNKNOWN);
    }
  };

  var config = {
    vpaidJsInterface: 'https://ad.mail.ru/static/vpaid-js-interface.swf'
  };

  var htmlTemplate =
    '<div class="adman_layer">\
      <div class="adman_content">\
        <video class="adman_video" playsinline></video>\
        <div class="adman_controls">\
          <span class="adman_timer_remained"></span>\
          <button class="adman_button_mute"></button>\
        </div>\
      </div>\
    </div>'
  ;

  var stylesTemplate =
    '<style>\
      .adman_layer {\
        position: fixed;\
        z-index: 9999;\
        top: 0;\
        right: 0;\
        bottom: 0;\
        left: 0;\
        background: rgba(0, 0, 0, .8);\
      }\
      .admanLayerInFrame {\
        position: absolute;\
        z-index: unset;\
      }\
      .adman_content {\
        position: absolute;\
        top: 0;\
        right: 0;\
        bottom: 0;\
        left: 0;\
        width: 640px;\
        height: 360px;\
        margin: auto;\
      }\
      .adman_content_fluid {\
        width: 100%;\
        height: 100%;\
      }\
      .adman_video {\
        position: absolute;\
        left: 0;\
        top: 0;\
        width: 100%;\
        height: 100%;\
      }\
      .adman_timer_remained, .adman_button_mute {\
        position: absolute;\
        padding: 0 20px;\
        border-radius: 3px;\
        border: none;\
        outline: 0;\
        height: 37px;\
        background: rgba(0, 0, 0, .6);\
        color: #fff;\
        font: 13px/37px sans-serif;\
        cursor: default;\
      }\
      .adman_timer_remained {\
        left: 10px;\
        top: 10px;\
      }\
      .adman_timer_remained:empty {\
        display: none;\
      }\
      .adman_button_mute {\
        width: 37px;\
        background-repeat: no-repeat;\
        background-position: 50%;\
      }\
      .adman_button_mute.hidden {\
        display: none;\
      }\
      .adman_button_mute {\
        left: 10px;\
        bottom: 10px;\
        background-image: url(data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2219%22%20height%3D%2216%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%22822%20568%2019%2016%22%3E%3Cpath%20d%3D%22M832.98%20582.823c-.03%201.207-.67%201.61-1.828.62-1.72-1.47-3.61-3.194-4.242-3.72-.632-.53-1.645-.622-3.073-.622-1.427%200-1.815-.62-1.815-1.24s-.014-1.828-.014-2c0-.055.005-.086.014-.13.02-.095-.058-.973%200-1.59.085-.906.388-1.24%201.815-1.24%201.428%200%202.44-.093%203.073-.622.633-.528%202.523-2.252%204.242-3.72%201.158-.99%201.797-.588%201.83.62.042%201.606%200%203.85%200%206.682%200%202.83.042%205.356%200%206.963z%22%20fill%3D%22%23FFF%22%3E%3C/path%3E%3Cpath%20d%3D%22M835.138%20578.866c.185.182.486.177.67-.006.737-.737%201.192-1.746%201.192-2.86%200-1.115-.454-2.123-1.19-2.86-.183-.184-.484-.188-.67-.006-.182.18-.185.473-.004.653.57.57.923%201.35.923%202.212%200%20.863-.354%201.643-.926%202.213-.18.18-.178.473.004.653%22%20fill%3D%22%23FFF%22%20class%3D%22_wave1%22%3E%3C/path%3E%3Cpath%20d%3D%22M837.162%20580.846c.214.207.562.205.775-.004C839.21%20579.596%20840%20577.888%20840%20576c0-1.888-.788-3.596-2.06-4.842-.222-.218-.59-.21-.802.023-.193.215-.166.538.038.74%201.066%201.054%201.723%202.49%201.723%204.08%200%201.6-.67%203.048-1.75%204.104-.207.202-.197.54.012.742%22%20fill%3D%22%23FFF%22%20class%3D%22_wave2%22%3E%3C/path%3E%3C/svg%3E);\
      }\
      .adman_button_mute[data-muted] {\
        background-image: url(data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2219%22%20height%3D%2216%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%22822%20568%2019%2016%22%3E%3Cpath%20d%3D%22M832.98%20582.823c-.03%201.207-.67%201.61-1.828.62-1.72-1.47-3.61-3.194-4.242-3.72-.632-.53-1.645-.622-3.073-.622-1.427%200-1.815-.62-1.815-1.24s-.014-1.828-.014-2c0-.055.005-.086.014-.13.02-.095-.058-.973%200-1.59.085-.906.388-1.24%201.815-1.24%201.428%200%202.44-.093%203.073-.622.633-.528%202.523-2.252%204.242-3.72%201.158-.99%201.797-.588%201.83.62.042%201.606%200%203.85%200%206.682%200%202.83.042%205.356%200%206.963z%22%20fill%3D%22%23FFF%22%3E%3C/path%3E%3Cpath%20d%3D%22M839%20576l1.64%201.64c.205.205.203.517.01.71l-.3.3c-.194.194-.51.19-.71-.01L838%20577l-1.64%201.64c-.2.2-.516.204-.71.01l-.3-.3c-.193-.193-.195-.505.01-.71L837%20576l-1.64-1.64c-.205-.205-.203-.517-.01-.71l.3-.3c.194-.194.51-.19.71.01L838%20575l1.64-1.64c.2-.2.516-.204.71-.01l.3.3c.193.193.195.505-.01.71L839%20576z%22%20fill%3D%22%23FFF%22%20class%3D%22_cross%22%3E%3C/path%3E%3C/svg%3E);\
      }\
      .adman_button_mute {\
        cursor: pointer;\
      }\
      .adman_button_mute:hover {\
        background-color: rgba(34, 34, 34, .6);\
      }\
    </style>';

  function elFromHtml(html) {
    var tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.firstChild;
  }
})(window);