
var g_uiData  = {
  "pageTransitionDelay" : 20,
  "focus" : "ui_main",
  "mode" : "solidColor",
  "modes" : [
    "solidColor", "noise",
    "tapPulse", "tapBullet", "tapStrobe",
    "micPulse", "micBullet", "micStrobe",
    "fill", "strobe", "pulse", "rainbow"
  ]
};

var g_innerlight = {

  "url" : "http://localhost:8080/req",

  "mode_index": 0,
  "mode":"on",
  "modes": ["solid", "solid_color", "noise",
            "tap_pulse", "tap_bullet", "tap_strobe",
            "fill", "strobe", "pulse", "rainbow",
            "mic_strobe", "mic_bullet", "mic_pulse" ],
  "mic_tap":"mic",
  "tempo_bpm":120,
  "option_value": 15,

  "tap_bpm_min" : 60.0,
  "tap_bpm_max" : 260.0,


  "tap_bpm" : 120.0,
  "tap_progression_numerator" : 0,
  "tap_progression_denominator" : 12,
  "tap_progression_cancel_ms" : 2000,
  "tap_progression_last_ms" : -1,
  "tap_progression_time" : [],
  "tap_progression_timout" : null,

  "color_fg":[0,0,0],
  "color_bg":[255,255,255],
  "color_map": [ [255,211,25] , [255,144,31] , [255,41,117] , [242,34,255] , [140,30,255] ]
};


function _debug_view() {

  var from = g_uiData.focus;
  var ele = document.getElementById(from);
  var view_w = $(window).width();
  var view_h = $(window).height();
  var doc_w = $(document).width();
  var doc_h = $(document).height();
  var screen_h = window.screen.height;
  var screen_w = window.screen.width;

  var scroll_top = document.documentElement.scrollTop || document.body.scrollTop;
  var y_offset = window.pageYOffset;

  console.log(view_w, view_h, doc_w, doc_h, screen_w, screen_h, scroll_top, y_offset);

}

var pageTransition = function(toPage, transitionType, cb, delay) {

  //if (toPage in setupPage) { setupPage[toPage](); }
  if (typeof delay === "undefined") { delay = g_uiData.pageTransitionDelay; }

  setTimeout( function() {

    var from = g_uiData.focus;

    g_uiData.focus = toPage;
    if ($(".screen").page().fetch(toPage) === null) {
      $(".screen").page().shake();
    }

    // needs work
    //
    else if (transitionType === "slide-in-from-bottom") {

      // SO: https://stackoverflow.com/questions/3437786/get-the-size-of-the-screen-current-web-page-and-browser-window
      //
      var ele = document.getElementById(from);
      var view_w = $(window).width();
      var view_h = $(window).height();
      var doc_w = $(document).width();
      var doc_h = $(document).height();

      var screen_h = window.screen.height;
      var screen_w = window.screen.width;

      var scroll_top = document.documentElement.scrollTop || document.body.scrollTop;

      // The transition gets janked if it goes from a scroll
      // page to a non scroll page.
      // As a hack, shove the scrolled page up by the difference
      // in document to screen height so that it thinks it's
      // now at '0', then do the transition.
      // Once completed, reset the style position and top attribute.
      //
      var del_y = (scroll_top);
      if (del_y > 0) {

        console.log(">>>", del_y);

        ele.style.position = "relative";
        ele.style.top = "-" + del_y + "px";
        document.body.scrollTop = 0;
        //ele.style.overflow = "hidden";
      }

      $(".screen").page().transition(toPage, transitionType, (function(x) { return function() { x.style.position = ""; x.style.top = ""; } })(ele) );

    }

    else if (transitionType === "slide-in-from-top") {

      // SO: https://stackoverflow.com/questions/3437786/get-the-size-of-the-screen-current-web-page-and-browser-window
      //
      var ele = document.getElementById(toPage);
      var view_w = $(window).width();
      var view_h = $(window).height();
      var doc_w = $(document).width();
      var doc_h = $(document).height();

      var screen_h = window.screen.height;
      var screen_w = window.screen.width;

      var scroll_top = document.documentElement.scrollTop || document.body.scrollTop;

      // The transition gets janked if it goes from a scroll
      // page to a non scroll page.
      // As a hack, shove the scrolled page up by the difference
      // in document to screen height so that it thinks it's
      // now at '0', then do the transition.
      // Once completed, reset the style position and top attribute.
      //
      var del_y = (scroll_top);
      if (del_y > 0) {
        ele.style.position = "relative";
        ele.style.top = "-" + del_y + "px";
        document.body.scrollTop = 0;
      }
      ele.style.overflow = "hidden";

      $(".screen").page().transition(toPage, transitionType, (function(x) { return function() { x.style.position = ""; x.style.top = ""; } })(ele) );

    }

    else {

      // SO: https://stackoverflow.com/questions/3437786/get-the-size-of-the-screen-current-web-page-and-browser-window
      //
      var ele = document.getElementById(from);
      var view_w = $(window).width();
      var view_h = $(window).height();
      var doc_w = $(document).width();
      var doc_h = $(document).height();

      var screen_h = window.screen.height;
      var screen_w = window.screen.width;

      var scroll_top = document.documentElement.scrollTop || document.body.scrollTop;

      // The transition gets janked if it goes from a scroll
      // page to a non scroll page.
      // As a hack, shove the scrolled page up by the difference
      // in document to screen height so that it thinks it's
      // now at '0', then do the transition.
      // Once completed, reset the style position and top attribute.
      //
      var del_y = (scroll_top);
      if (del_y > 0) {
        ele.style.position = "relative";
        ele.style.top = "-" + del_y + "px";
        document.body.scrollTop = 0;
      }


      $(".screen").page().transition(toPage, transitionType, (function(x) { return function() { x.style.position = ""; x.style.top = ""; } })(ele) );
    }
    if (typeof cb !== "undefined") { cb(); }
  }, delay);

};

function _send_state() {
console.log(">> send state");
}

function _fill_slider(inp) {
  var ele = document.getElementById("ui_fill_slider");
  var val = ele.value;

  console.log(">> fill speed", val);
}

function _rainbow_slider(inp) {
  var ele = document.getElementById("ui_rainbow_slider");
  var val = ele.value;

  console.log(">> rainbow speed", val);
}


function _color_preset(val, pfx) {

  var preset = [

    // oil slick rainbow
    //
    [ { "hex":"#e8bbc9", "rgb":[232,187,201] },
      { "hex":"#9a3e82", "rgb":[154,62,130] },
      { "hex":"#8cd1e0", "rgb":[140,209,224] },
      { "hex":"#224a8e", "rgb":[34,74,142] },
      { "hex":"#d5773d", "rgb":[213,119,61] } ],

    // deep oil slick rainbow
    //
    [
      { "hex":"#173f62", "rgb":[23,63,98] },
      { "hex":"#5b8f99", "rgb":[91,143,153] },
      { "hex":"#faab5c", "rgb":[250,171,92] },
      { "hex":"#bf3414", "rgb":[191,52,20] },
      { "hex":"#851826", "rgb":[133,24,38] } ],

    // oil ocean
    //
    [
      { "hex":"#0f0b38", "rgb":[15,11,56] },
      { "hex":"#222858", "rgb":[34,40,88] },
      { "hex":"#b825df", "rgb":[184,37,223] },
      { "hex":"#b6df5c", "rgb":[182,223,92] },
      { "hex":"#c5a74b", "rgb":[197,167,75] }
    ],

    // two cycle oil
    //
    [ 
      { "hex":"#dddddd", "rgb":[221,221,221] },
      { "hex":"#d8d8e0", "rgb":[216,216,224] },
      { "hex":"#b0b0b8", "rgb":[176,176,184] },
      { "hex":"#c82028", "rgb":[200,32,40] },
      { "hex":"#281010", "rgb":[40,16,16] }
    ],
  
    // oil painting
    //
    [
      { "hex":"#122147", "rgb":[18,33,71] },
      { "hex":"#1c542b", "rgb":[28,84,43] },
      { "hex":"#d6001d", "rgb":[214,0,29] },
      { "hex":"#f3f6eb", "rgb":[243,246,235] },
      { "hex":"#fbaf62", "rgb":[251,175,98] }
    ],
  
    // neo tokyo synth
    //
    [
      { "hex":"#55e7ff", "rgb":[85,231,255] },
      { "hex":"#00ccfd", "rgb":[0,204,253] }, 
      { "hex":"#ff34b3", "rgb":[255,52,179] },
      { "hex":"#2011a2", "rgb":[32,17,162] },
      { "hex":"#201148", "rgb":[32,17,72] }
    ],
    // synthwave sunset
    //
    [
      { "hex":"#ffd319", "rgb":[255,211,25] },
      { "hex":"#ff901f", "rgb":[255,144,31] },
      { "hex":"#ff2975", "rgb":[255,41,117] },
      { "hex":"#f222ff", "rgb":[242,34,255] },
      { "hex":"#8c1eff", "rgb":[140,30,255] }
    ],

    // outrun
    //
    [
      { "hex":"#00f3ff", "rgb":[0,243,255] },
      { "hex":"#ff0052", "rgb":[255,0,82] },
      { "hex":"#9e00ff", "rgb":[158,0,255] },
      { "hex":"#ffef00", "rgb":[255,239,0] },
      { "hex":"#3f3f3f", "rgb":[63,63,63] }
    ]

  ];

  if ((val>=0) && (val < preset.length)) {
    console.log(">>preset", preset[val]);

    g_innerlight.color_map = [];

    for (var ii=0; ii<5; ii++) {
      //_set_color_str(ii, preset[val][ii].hex);

      var ele_id = pfx + ii;
      var ele = document.getElementById(ele_id);
      ele.style.background = preset[val][ii].hex;

      g_innerlight.color_map.push( [ preset[val][ii].rgb[0], preset[val][ii].rgb[1], preset[val][ii].rgb[2] ] );

    }
  }

  console.log(">>color preset", val);

  _send_state();
}

function _calc_bpm(dta) {
  var del_t = [];

  if (dta.length < 2) { return -1.0; }

  var ms_avg = 0;
  for (var ii=1; ii<dta.length; ii++) {
    ms_avg += (dta[ii] - dta[ii-1]);
  }
  ms_avg /= (dta.length-1);

  if (ms_avg < 1.0) { return -1.0; }
  return 60*1000/ms_avg;
}



function _clamp_bpm() {
  if (g_innerlight.tap_bpm < g_innerlight.tap_bpm_min) {
    g_innerlight.tap_bpm = g_innerlight.tap_bpm_min;
  }

  if (g_innerlight.tap_bpm > g_innerlight.tap_bpm_max) {
    g_innerlight.tap_bpm = g_innerlight.tap_bpm_max;
  }

  return g_innerlight.tap_bpm;
}

//-----------------------------------------------------
//  _                _                             
// | |_ __ _ _ __   | |_ ___ _ __ ___  _ __   ___  
// | __/ _` | '_ \  | __/ _ \ '_ ` _ \| '_ \ / _ \ 
// | || (_| | |_) | | ||  __/ | | | | | |_) | (_) |
//  \__\__,_| .__/   \__\___|_| |_| |_| .__/ \___/ 
//          |_|                       |_|          
//-----------------------------------------------------


function _tap_cancel() {

  console.log(">>cancel");

  if (g_innerlight.tap_progression_timeout !== null) {
    clearTimeout(g_innerlight.tap_progression_timeout);
    g_innerlight.tap_progression_timeout = null;
  }

  g_innerlight.tap_progression_last_ms = -1;
  g_innerlight.tap_progression_time = [ ];
  g_innerlight.tap_progression_numerator = 0;

  var ele = document.getElementById("ui_tap_progression_numerator");
  ele.innerHTML = "0";

  animateCSS("ui_tap_progression", "shake");
}


function _tap_commit() {
  if (g_innerlight.tap_progression_timeout !== null) {
    clearTimeout(g_innerlight.tap_progression_timeout);
    g_innerlight.tap_progression_timeout = null;
  }

  g_innerlight.tap_bpm = _calc_bpm(g_innerlight.tap_progression_time);
  _clamp_bpm();

  g_innerlight.tap_progression_last_ms = -1;
  g_innerlight.tap_progression_time = [ ];
  g_innerlight.tap_progression_numerator = 0;

  var ele = document.getElementById("ui_tap_slider");
  ele.value = Math.round(g_innerlight.tap_bpm);

  var ele = document.getElementById("ui_tap_bpm");
  ele.innerHTML = Math.round(g_innerlight.tap_bpm*100)/100;

  //animateCSS("ui_tap_bpm", "pulse");

  _send_state();
}

function _tap_slider(inp) {
  console.log(">>tap slider");

  var ele = document.getElementById("ui_tap_slider");
  console.log(ele.value);

  g_innerlight.tap_bpm = parseFloat(ele.value);
  _clamp_bpm();

  ele = document.getElementById("ui_tap_bpm");
  ele.innerHTML = Math.round(g_innerlight.tap_bpm*100)/100;

  _send_state();
}



function _tap_add() {
  console.log(">>tap add");

  g_innerlight.tap_bpm += 1.0;
  _clamp_bpm();

  var ele = document.getElementById("ui_tap_slider");
  ele.value = Math.round(g_innerlight.tap_bpm);

  var ele = document.getElementById("ui_tap_bpm");
  ele.innerHTML = Math.round(g_innerlight.tap_bpm*100)/100;

  _send_state();
}

function _tap_sub() {
  console.log(">>tap sub");

  g_innerlight.tap_bpm -= 1.0;
  _clamp_bpm();

  var ele = document.getElementById("ui_tap_slider");
  ele.value = Math.round(g_innerlight.tap_bpm);

  var ele = document.getElementById("ui_tap_bpm");
  ele.innerHTML = Math.round(g_innerlight.tap_bpm*100)/100;

  _send_state();
}


function _tap_button() {
  var dt = new Date();

  if (g_innerlight.tap_progression_timeout !== null) {
    clearTimeout(g_innerlight.tap_progression_timeout);
    g_innerlight.tap_progression_timeout = null;
  }

  var t_ms = dt.getTime();
  if (g_innerlight.tap_progression_last_ms < 0) {
    g_innerlight.tap_progression_last_ms = t_ms;
    g_innerlight.tap_progression_time = [ t_ms ];
    g_innerlight.tap_progression_numerator = 1;
  }
  else {
    g_innerlight.tap_progression_last_ms = t_ms;
    g_innerlight.tap_progression_time.push(t_ms);
    g_innerlight.tap_progression_numerator+=1;
  }

  var ele = document.getElementById("ui_tap_progression_numerator");
  ele.innerHTML = g_innerlight.tap_progression_numerator;

  if (g_innerlight.tap_progression_numerator >= 12) {
    _tap_commit();

  }
  else {
    g_innerlight.tap_progression_timeout =
      setTimeout(
          function() { _tap_cancel(); },
          g_innerlight.tap_progression_cancel_ms
          );
  }

}



function animateCSS(ele_id, animationName, callback) {
  //const node = document.querySelector(element);
  const node = document.getElementById(ele_id);
  node.classList.add('animated', animationName);

  function handleAnimationEnd() {
    node.classList.remove('animated', animationName);
    node.removeEventListener('animationend', handleAnimationEnd);

    if (typeof callback === 'function') callback();
  }

  node.addEventListener('animationend', handleAnimationEnd);
}

//------------------
//  _       _ _   
// (_)_ __ (_) |_ 
// | | '_ \| | __|
// | | | | | | |_ 
// |_|_| |_|_|\__|
//                
//------------------


function _init() {

  // Default select current mode
  //
  var ele = document.getElementById("ui_mode_" + g_uiData.mode);
  ele.classList.add("bkeySelected");

  // Setup callbacks for mode button press
  //
  for (var ii=0; ii<g_uiData.modes.length; ii++) {
    var mode = g_uiData.modes[ii];
    var ele = document.getElementById("ui_mode_" + mode);

    ele.onclick = (function(_m) {
      return function() {

        // unhighlight mode button
        //
        var _el = document.getElementById("ui_mode_" + g_uiData.mode);
        _el.classList.remove("bkeySelected");

        // highlight current mode button
        //
        _el = document.getElementById("ui_mode_" + _m);
        _el.classList.add("bkeySelected");

        // save state
        //
        g_uiData.mode = _m;

        // alter 'config' button
        //
        _el = document.getElementById("ui_mode_config");
        _el.setAttribute("data-page-name", "ui_" + _m);
        _el = document.getElementById("ui_mode_config0");
        _el.setAttribute("data-page-name", "ui_" + _m);
      };
    })(mode);

    //ele.setAttribute("data-page-name", "ui_" + mode);
    //ele.setAttribute("data-page-trans", "slide-in-from-right");
  }


  // setup color pickers
  //
  $('#ui_solidColor_colorpicker').farbtastic(function(hex) {
    var _el = document.getElementById("ui_solidColor_colorbutton");
    _el.style.background = hex;
  });

  //var tapmic = ["tap", "mic"];
  //var tm_mode = ["Pulse", "Bullet", "Strobe"];
  //var fgbg = ["fg", "bg"];
  var tapmic = ["tap", "mic"];
  var tm_mode = ["Pulse", "Bullet", "Strobe"];
  var fgbg = ["fg", "bg"];
  for (var _i=0; _i<tapmic.length; _i++) {
    for (var _j=0; _j<tm_mode.length; _j++) {
      for (var _k=0; _k<fgbg.length; _k++) {
      var ele_id = "ui_" + tapmic[_i] + tm_mode[_j] + "_colorpicker" + fgbg[_k];
      var clr_id = "ui_" + tapmic[_i] + tm_mode[_j] + "_colorbutton" + fgbg[_k];
      console.log(">>", ele_id);
      $("#" + ele_id).farbtastic(
        (function(_id) {
          return function(hex) {
            var _el = document.getElementById(_id);
            _el.style.background = hex;
          };
        })(clr_id) );
      }
    }
  }

  $('#ui_strobe_colorpickerfg').farbtastic(function(hex) {
    var _el = document.getElementById("ui_strobe_colorbuttonfg");
    _el.style.background = hex;
  });
  $('#ui_strobe_colorpickerbg').farbtastic(function(hex) {
    var _el = document.getElementById("ui_strobe_colorbuttonbg");
    _el.style.background = hex;
  });

  $('#ui_pulse_colorpickerfg').farbtastic(function(hex) {
    var _el = document.getElementById("ui_pulse_colorbuttonfg");
    _el.style.background = hex;
  });
  $('#ui_pulse_colorpickerbg').farbtastic(function(hex) {
    var _el = document.getElementById("ui_pulse_colorbuttonbg");
    _el.style.background = hex;
  });

  /*
  $('#ui_tapPulse_colorpickerfg').farbtastic(function(hex) {
    var _el = document.getElementById("ui_tapPulse_colorbuttonfg");
    _el.style.background = hex;
  });
  $('#ui_tapPulse_colorpickerbg').farbtastic(function(hex) {
    var _el = document.getElementById("ui_tapPulse_colorbuttonbg");
    _el.style.background = hex;
  });
  */


  _color_preset(0,"ui_noise_color");

}

//------------------

(function($) {

  $(document).ready(function () {

    $(".screen").page();
    $(".screen .page .navigate").click(function (ev) {
      var page  = $(ev.target).attr("data-page-name");
      var trans = $(ev.target).attr("data-page-trans");
      pageTransition(page, trans);
    });

    $(".screen .page .navigate-delay").click(function (ev) {
      var toPage = $(ev.target).attr("data-page-name");
      var trans = $(ev.target).attr("data-page-trans");
      pageTransition(toPage, trans);
    });

    _init();

    setTimeout( function() { $("#body").addClass("load"); }, 20 );
  });;



})(jQuery);
