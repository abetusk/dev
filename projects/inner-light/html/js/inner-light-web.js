/*
 * 
 * This is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License.
 * If not, see <https://www.gnu.org/licenses/>.
 *
 */

var g_uiData  = {
  "pageTransitionDelay" : 20,
  "focus" : "ui_main",
  "mode" : "solidColor",
  "modes" : [
    "solidColor", "noise",
    "tapPulse", "tapBullet", "tapStrobe",
    "micPulse", "micBullet", "micStrobe",
    "fill", "strobe", "pulse", "rainbow"
  ],
  "mode_name" : [
    "solid_color", "noise",
    "tap_pulse", "tap_bullet", "tap_strobe",
    "mic_pulse", "mic_bullet", "mic_strobe",
    "fill", "strobe", "pulse", "rainbow"
  ]
};

var g_innerlight = {

  "url" : "http://localhost:8080/req",
  "url_led_test" : "http://localhost:8080/ledtest",
  "url_led_reset" : "http://localhost:8080/ledreset",
  "url_config_req" : "http://localhost:8080/config",

  "led" : {
    "count_collar_left" : 15,
    "count_collar_right" : 15,

    "count_lapel_left" : 30,
    "count_lapel_right" : 30,

    "count_waist_left" : 30,
    "count_waist_right" : 30,

    "count_cuff_left" : 15,
    "count_cuff_right": 15,

    "count_led" : 180,

    "default_count_collar_left" : 15,
    "default_count_collar_right" : 15,

    "default_count_lapel_left" : 40,
    "default_count_lapel_right" : 40,

    "default_count_waist_left" : 30,
    "default_count_waist_right" : 30,

    "default_count_cuff_left" : 16,
    "default_count_cuff_right": 16,


    "test_collar_left" : 0,
    "test_collar_right" : 0,

    "test_lapel_left" : 0,
    "test_lapel_right" : 0,

    "test_waist_left" : 0,
    "test_waist_right" : 0,

    "test_cuff_left" : 0,
    "test_cuff_right": 0,


    "contig_collar_left_reverse" : 0,
    "contig_collar_right_reverse" : 0,

    "contig_lapel_left_reverse" : 0,
    "contig_lapel_right_reverse" : 0,

    "contig_waist_left_reverse" : 0,
    "contig_waist_right_reverse" : 0,

    "contig_cuff_left_reverse" : 0,
    "contig_cuff_right_reverse": 0,

    "default_logical_order" : [
      { "label": "cuff_left", "delta" : 1 },
      { "label": "waist_left", "delta" : 1 },
      { "label": "lapel_left", "delta" : 1 },
      { "label": "collar_left", "delta" : 1 },
      { "label": "collar_right", "delta" : -1 },
      { "label": "lapel_right", "delta" : -1 },
      { "label": "waist_right", "delta" : -1 },
      { "label": "cuff_right", "delta" : -1 }
    ],

    "default_physical_order" : [
      { "label": "lapel_right", "delta" : 1 },
      { "label": "collar_right", "delta" : 1 },
      { "label": "collar_left", "delta" : -1 },
      { "label": "lapel_left", "delta" : -1 },
      { "label": "waist_left", "delta" : -1 },
      { "label": "waist_right", "delta" : 1 },
      { "label": "cuff_right", "delta" : 1 },
      { "label": "cuff_left", "delta" : -1 }
    ],

    "logical_order" : [
      { "label": "cuff_left", "delta" : 1 },
      { "label": "waist_left", "delta" : 1 },
      { "label": "lapel_left", "delta" : 1 },
      { "label": "collar_left", "delta" : 1 },
      { "label": "collar_right", "delta" : -1 },
      { "label": "lapel_right", "delta" : -1 },
      { "label": "waist_right", "delta" : -1 },
      { "label": "cuff_right", "delta" : -1 }
    ],

    "physical_order" : [
      { "label": "lapel_right", "delta" : 1 },
      { "label": "collar_right", "delta" : 1 },
      { "label": "collar_left", "delta" : -1 },
      { "label": "lapel_left", "delta" : -1 },
      { "label": "waist_left", "delta" : -1 },
      { "label": "waist_right", "delta" : 1 },
      { "label": "cuff_right", "delta" : 1 },
      { "label": "cuff_left", "delta" : -1 }
    ],

    "logical_order_map_info" : [],
    "map_info" : [],
    "map" : []
  },

  "mode_index": 0,
  "mode":"on",
  "mode_map" : {
    "solid" : "solid" ,
    "solidColor": "solid_color" ,
    "noise": "noise" ,
    "tapPulse": "tap_pulse",
    "tapBullet": "tap_bullet",
    "tapStrobe": "tap_strobe",
    "fill": "fill",
    "strobe": "strobe",
    "pulse": "pulse",
    "rainbow": "rainbow",
    "micStrobe": "mic_strobe",
    "micBullet": "mic_bullet",
    "micPulse": "mic_pulse"
  },

  "modes": ["solid", "solid_color", "noise",
            "tap_pulse", "tap_bullet", "tap_strobe",
            "fill", "strobe", "pulse", "rainbow",
            "mic_strobe", "mic_bullet", "mic_pulse" ],
  "mode_option": {
    "solid" : { "color" : "" },
    "solid_color" : { "color" : "" },
    "noise" : { "palette" : ["", "", "", "", ""], "speed" : -1, "brightness":1.0, "preset_index":0 },
    "rainbow" : { "speed" : -1 },
    "tap_pulse": { "fg" : "", "bg" : "" },
    "tap_bullet": { "fg" : "", "bg" : "" },
    "tap_strobe": { "fg" : "", "bg" : "" },
    "mic_pulse": { "fg" : "", "bg" : "" },
    "mic_bullet": { "fg" : "", "bg" : "" },
    "mic_strobe": { "fg" : "", "bg" : "" },
    "fill" : { "speed" : -1 },
    "strobe" : { "fg" : "", "bg" : "", "speed" : -1 },
    "pulse" : { "fg" : "", "bg" : "", "speed" : -1 }
  },

  "mode_option_default": {
    "solid" : { "color" : "ffffff" },
    "solid_color" : { "color" : "ffffff" },
    "noise" : { "palette" : ["e8bbc9", "9a3e82", "8cd1e0", "224a8e", "d5773d"], "speed" : 0.25 , "brightness":1.0, "preset_index":0},
    "rainbow" : { "speed" : 0.25 },
    "tap_pulse": { "fg" : "ffffff", "bg" : "000000" },
    "tap_bullet": { "fg" : "ffffff", "bg" : "000000" },
    "tap_strobe": { "fg" : "ffffff", "bg" : "000000" },
    "mic_pulse": { "fg" : "ffffff", "bg" : "000000" },
    "mic_bullet": { "fg" : "ffffff", "bg" : "000000" },
    "mic_strobe": { "fg" : "ffffff", "bg" : "000000" },
    "fill" : { "speed" : 0.25 },
    "strobe" : { "fg" : "ffffff", "bg" : "000000", "speed" : 0.25 },
    "pulse" : { "fg" : "ffffff", "bg" : "000000", "speed" : 0.25 }
  },

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

function _rgb2hex(rgb) {
  var s = "", d = "";

  d = rgb[0].toString(16);
  s += ((d.length==1) ? ("0" + d) : d);

  d = rgb[1].toString(16);
  s += ((d.length==1) ? ("0" + d) : d);

  d = rgb[2].toString(16);
  s += ((d.length==1) ? ("0" + d) : d);


  return s;
}

function _update_config(data_str) {
  var data = JSON.parse(data_str);

  var led_fielda = [
    "map"
  ];

  for (var idx=0; idx < led_fielda.length; idx++) {
    var field = led_fielda[idx];
    if (field in data) {
      var _a = data[field].split(",");
      if (field in g_innerlight.led) {
        g_innerlight.led[field] = _a;
      }
    }
  }

  var fields = [
    "fg",
    "bg",
    "mode",
    "tap_bpm",
    "opt_val"
  ];

  for (var idx=0; idx < fields.length; idx++) {
    var field = fields[idx];
    if (field in data) {
      g_innerlight[field] = data[field];
    }
  }

  var led_fields = [
    "count_cuff_left",
    "count_waist_left",
    "count_lapel_left",
    "count_collar_left",
    "count_cuff_right",
    "count_waist_right",
    "count_lapel_right",
    "count_collar_right"
  ];

  for (var idx=0; idx < led_fields.length; idx++) {
    var field = led_fields[idx];
    if (field in data) {
      g_innerlight.led[field] = parseInt(data[field]);
    }
  }

  var subfields = [
    "fill.speed",

    "noise.preset_index",
    "noise.brightness",
    "noise.palette",
    "noise.speed",

    "pulse.bg",
    "pulse.fg",
    "pulse.speed",

    "rainbow.speed",

    "solid.color",
    "solid_color.color",

    "strobe.fg",
    "strobe.bg",
    "strobe.speed",

    "tap_bullet.bg",
    "tap_bullet.fg",
    "tap_pulse.bg",
    "tap_pulse.fg",
    "tap_strobe.bg",
    "tap_strobe.fg",

    "mic_bullet.bg",
    "mic_bullet.fg",
    "mic_pulse.bg",
    "mic_pulse.fg",
    "mic_strobe.bg",
    "mic_strobe.fg"
  ];

  for (var idx=0; idx < subfields; idx++) {
    var fielda = subfields[idx].split(".");
    var parent_field = fielda[0];
    var child_field = fielda[1];

    if (parent_field in g_innerlight.mode_option) {
      if (child_field in g_innerlight.mode_option[parent_field]) {
        g_innerlight.mode_option[parent_field][child_field] = data[subfileds[idx]];
      }
    }
  }

}

function _send_cfgreq() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", g_innerlight.url_config_req, true);
  xhr.setRequestHeader('Content-Type', "application/x-www-form-urlencoded; charset=UTF-8" );
  xhr.send();

  xhr.onreadystatechange = function() {
    if ((this.readyState==4) && (this.status==200)) {
      console.log("got:", xhr.responseText);
      _update_config(xhr.responseText);
      _init();
    }

  };
}

function _send_ledreset() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", g_innerlight.url_led_reset, true);
  xhr.setRequestHeader('Content-Type', "application/x-www-form-urlencoded; charset=UTF-8" );
  xhr.send();
}

function _send_api_req(data_obj) {
  var data_str = "";
  for (var _key in data_obj) {
    if (data_str.length > 0) { data_str += "&"; }
    var str = data_obj[_key] + "";
    if (str.length > 0) {
      data_str += _key + "=" + data_obj[_key];
    }
  }

  var xhr = new XMLHttpRequest();
  xhr.open("POST", g_innerlight.url, true);
  xhr.setRequestHeader('Content-Type', "application/x-www-form-urlencoded; charset=UTF-8" );
  xhr.send(data_str);
}

function _send_state() {
  var n_tot = 0;

  console.log(">>>sending state...");

  n_tot = parseInt(g_innerlight.led.count_collar_left) +
          parseInt(g_innerlight.led.count_collar_right) +
          parseInt(g_innerlight.led.count_lapel_left) +
          parseInt(g_innerlight.led.count_lapel_right) +
          parseInt(g_innerlight.led.count_waist_left) +
          parseInt(g_innerlight.led.count_waist_right) +
          parseInt(g_innerlight.led.count_cuff_left) +
          parseInt(g_innerlight.led.count_cuff_right);


  var data = {
    "mode": g_innerlight.mode,
    "tap_bpm":g_innerlight.tap_bpm,
    "opt_val" : g_innerlight.option_value,
    "fg": _rgb2hex( g_innerlight.color_fg ),
    "bg": _rgb2hex( g_innerlight.color_bg ),

    "count_collar_left" : g_innerlight.led.count_collar_left,
    "count_collar_right" : g_innerlight.led.count_collar_right,

    "count_lapel_left" : g_innerlight.led.count_lapel_left,
    "count_lapel_right" : g_innerlight.led.count_lapel_right,

    "count_waist_left" : g_innerlight.led.count_waist_left,
    "count_waist_right" : g_innerlight.led.count_waist_right,

    "count_cuff_left" : g_innerlight.led.count_cuff_left,
    "count_cuff_right": g_innerlight.led.count_cuff_right,

    "count_led" : n_tot,
    "map" : g_innerlight.led.map.join(",")
  };

  for (var _mode in g_innerlight.mode_option) {
    for (var _opt in g_innerlight.mode_option[_mode]) {
      data[ _mode + "." + _opt ] = g_innerlight.mode_option[_mode][_opt];
    }
  }

  _send_api_req(data);
}

function _send_ledtest() {

  var id_ledtest = [
    "test_collar_left",
    "test_collar_right",
    "test_lapel_left",
    "test_lapel_right",
    "test_waist_left",
    "test_waist_right",
    "test_cuff_left",
    "test_cuff_right"
  ];

  var val_a = [
    "collar_left",
    "collar_right",
    "lapel_left",
    "lapel_right",
    "waist_left",
    "waist_right",
    "cuff_left",
    "cuff_right"
  ];

  var data_str = "";

  for (var idx=0; idx<g_innerlight.led.map_info.length; idx++) {

    var key = "test_" + g_innerlight.led.map_info[idx].label;
    if (! (key in g_innerlight.led)) { continue; }
    if (g_innerlight.led[key] != 1) { continue; }

    if (data_str.length > 0) { data_str += ":"; }

    var _s = g_innerlight.led.logical_order_map_info[idx].start;
    var _n = g_innerlight.led.logical_order_map_info[idx].n;
    var _d = g_innerlight.led.logical_order_map_info[idx].dir;

    if (_d < 0) { _s = _s + 1 - _n; }

    data_str += "" + _s;
    data_str += "," + _n;
    data_str += "," + _d;
  }

  if (data_str.length > 0) {
    data_str = "data=" + data_str;
  }
  console.log("_send_ledtest(): data:", data_str);

  if (data_str.length==0) {
    console.log("_send_ledtest(): no data to send, not sending");
    return;
  }

  console.log(">> send_ledtest", data_str);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", g_innerlight.url_led_test, true);
  xhr.setRequestHeader('Content-Type', "application/x-www-form-urlencoded; charset=UTF-8" );
  xhr.send(data_str);
}


//
// [ cuff left ][ waist left ][ lapel left ][ collar left ][ collar right ][ lapel right ][ waist right][ cuff right ]
//
function _construct_led_mapping() {
  var led_count = {
    "collar_left"  : parseInt(g_innerlight.led.count_collar_left),
    "collar_right" : parseInt(g_innerlight.led.count_collar_right),
    "lapel_left"   : parseInt(g_innerlight.led.count_lapel_left),
    "lapel_right"  : parseInt(g_innerlight.led.count_lapel_right),
    "waist_left"   : parseInt(g_innerlight.led.count_waist_left),
    "waist_right"  : parseInt(g_innerlight.led.count_waist_right),
    "cuff_left"    : parseInt(g_innerlight.led.count_cuff_left),
    "cuff_right"   : parseInt(g_innerlight.led.count_cuff_right)
  };

  console.log("led_count", led_count);

  var _concept_map = [];

  var n_left = led_count.cuff_left +
               led_count.waist_left +
               led_count.lapel_left +
               led_count.collar_left;
  var n_right = led_count.collar_right +
                led_count.lapel_right +
                led_count.waist_right +
                led_count.cuff_right;

  var _map_info = [];
  var _map = [];

  var _logord_map_info = [];

  var contig = [];
  var contig_bp = { };

  var physical_order = g_innerlight.led.physical_order;
  var s = 0;
  for (var ii=0; ii<physical_order.length; ii++) {

    var label = physical_order[ii].label;
    var dir = physical_order[ii].delta;

    contig.push({ "start": s, "label": label  , "delta" : dir, "n" : led_count[label] });
    s += led_count[label];
    contig_bp[label] = ii;
  }

  // Create _map where:
  //
  //   _map[ logicalIndex ] = physicalIndex
  //
  s = 0;
  var logical_order = g_innerlight.led.logical_order;
  for (var ii=0; ii<logical_order.length; ii++) {
    var label = logical_order[ii].label;
    var dir = logical_order[ii].delta;
    var contig_idx = contig_bp[ label ];

    var delta = 0;
    var delta = contig[contig_idx].delta;

    console.log(">>contig", contig_idx, contig[contig_idx].start, contig[contig_idx].n);

    var phys_start = 0;
    if (delta > 0) {
      phys_start  = contig[contig_idx].start;
    }
    else {
      phys_start = contig[contig_idx].start + contig[contig_idx].n - 1;
    }

    _map_info.push({
      "label":label,
      "start":contig[contig_idx].start,
      "n": contig[contig_idx].n,
      "dir":delta
    });

    var pos = phys_start;
    for (var _p=0; _p<contig[contig_idx].n; _p++) {
      _map.push(pos);
      pos += delta;
    }

    var _s = s;
    if (dir < 0) {
      _s += led_count[label] - 1;
    }

    _logord_map_info.push({
      "label": label,
      "start": _s,
      "n" : led_count[label],
      "dir" : dir
    });

    s += led_count[label];

  }

  console.log("map", _map);

  g_innerlight.led.map_info = _map_info;
  g_innerlight.led.map = _map;

  g_innerlight.led.logical_order_map_info = _logord_map_info;

}

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


      $(".screen").page().transition(toPage, transitionType,
          (function(x) { return function() { x.style.position = ""; x.style.top = ""; }; })(ele)
        );
    }
    if (typeof cb !== "undefined") { cb(); }
  }, delay);

};

function _color_preset(val, pfx, ignore_sync) {

  ignore_sync = ((typeof ignore_sync === "undefined") ? false : ignore_sync);

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

  var ele = document.getElementById("ui_noise_preset_" + val);
  if (typeof ele !== "undefined") {
    var prev_idx = g_innerlight.mode_option.noise.preset_index;
    var prev_ele = document.getElementById("ui_noise_preset_" + prev_idx);
    if (typeof prev_ele !== "undefined") {
      prev_ele.classList.remove("bkeySelected");
    }
    ele.classList.add("bkeySelected");
  }

  g_innerlight.mode_option.noise.preset_index = val;

  if ((val>=0) && (val < preset.length)) {

    g_innerlight.color_map = [];

    var _a = g_innerlight.mode_option.noise.brightness;

    var color_map = [];
    for (var ii=0; ii<5; ii++) {

      var ele_id = pfx + ii;
      var ele = document.getElementById(ele_id);

      var _r = Math.floor(preset[val][ii].rgb[0]*_a);
      var _g = Math.floor(preset[val][ii].rgb[1]*_a);
      var _b = Math.floor(preset[val][ii].rgb[1]*_a);

      ele.style.background = "#" + _rgb2hex([ _r, _g, _b ]);

      g_innerlight.color_map.push( [ _r, _g, _b ]);
      color_map.push( [ _r, _g, _b ]);
    }

    for (var ii=0; ii<5; ii++) {
      g_innerlight.mode_option.noise.palette[ii] =
        _rgb2hex( color_map[ii] );
    }
  }

  if (!ignore_sync) { _send_state(); }
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

//----

function _mode_commit(_mode) {
  console.log(">> mode_commit:", _mode);

  if (_mode == "solid") {
  }
  else if (_mode == "solid_color") {
  }
  else if (_mode == "noise") {
  }
  else if (_mode == "rainbow") {
  }

  else if (_mode == "tap_pulse") {
  }
  else if (_mode == "tap_bullet") {
  }
  else if (_mode == "tap_strobe") {
  }

  else if (_mode == "mic_pulse") {
  }
  else if (_mode == "mic_bullet") {
  }
  else if (_mode == "mic_strobe") {
  }

  else if (_mode == "fill") {
  }
  else if (_mode == "strobe") {
  }
  else if (_mode == "pulse") {
  }

  _send_state();
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
  const node = document.getElementById(ele_id);
  node.classList.add('animated', animationName);

  function handleAnimationEnd() {
    node.classList.remove('animated', animationName);
    node.removeEventListener('animationend', handleAnimationEnd);

    if (typeof callback === 'function') callback();
  }

  node.addEventListener('animationend', handleAnimationEnd);
}

function _test_ledmap() {

  // Write file on host telling it to do a test of region(s)
  //
  _send_ledtest();
}

function _getval(_id) {
  var ele = document.getElementById(_id);
  return parseInt(ele.value);
}

function _commit_contig_led() {

  var id_order = $("#ui_ledmap_contig_physical_order").sortable("toArray");

  // Lookup ordering along with whether it has the 'reverse' flag checked or not
  //
  for (var ii=0; ii<id_order.length; ii++) {
    var region = id_order[ii].split("_").slice(-2).join("_");
    var rev_ele = document.getElementById("ui_ledmap_contig_" + region + "_reverse");

    var dir = 1;
    if (rev_ele.innerHTML.length>0) {
      dir = -1;
    }

    g_innerlight.led.physical_order[ii].label = region;
    g_innerlight.led.physical_order[ii].delta = dir;
  }


  // Construct the map from the physical ordering and
  // then apply it to the UI elements in the HTML
  //
  _construct_led_mapping();
  var _map = g_innerlight.led.map;
  for (var ii=0; ii<_map.length; ii++) {
    var ele = document.getElementById("ui_ledmap_" + ii);
    ele.value = _map[ii];
  }

  // Update host
  //
  _send_state();
}

function _commit_ledcount_change() {
  console.log("commit led change");
}

function _commit_lednum() {
  _commit_ledmap();
  _send_ledreset();
}

// construct the mapping with the current layout
//
function _commit_ledmap() {
  console.log("commit led");

  var led_count = {
    "collar" : { "left": 0, "right": 0 },
    "lapel" : { "left": 0, "right": 0 },
    "waist" : { "left": 0, "right": 0 },
    "cuff" : { "left": 0, "right": 0 }
  };

  led_count["collar"]["left"] = parseInt(_getval("ui_ledmap_countcollarleft"));
  led_count["collar"]["right"] = parseInt(_getval("ui_ledmap_countcollarright"));

  led_count["lapel"]["left"] = parseInt(_getval("ui_ledmap_countlapelleft"));
  led_count["lapel"]["right"] = parseInt(_getval("ui_ledmap_countlapelright"));

  led_count["waist"]["left"] = parseInt(_getval("ui_ledmap_countwaistleft"));
  led_count["waist"]["right"] = parseInt(_getval("ui_ledmap_countwaistright"));

  led_count["cuff"]["left"] = parseInt(_getval("ui_ledmap_countcuffleft"));
  led_count["cuff"]["right"] = parseInt(_getval("ui_ledmap_countcuffright"));

  g_innerlight.led.count_collar_left = led_count["collar"]["left"];
  g_innerlight.led.count_collar_right = led_count["collar"]["right"];
  g_innerlight.led.count_lapel_left = led_count["lapel"]["left"];
  g_innerlight.led.count_lapel_right = led_count["lapel"]["right"];
  g_innerlight.led.count_waist_left = led_count["waist"]["left"];
  g_innerlight.led.count_waist_right = led_count["waist"]["right"];
  g_innerlight.led.count_cuff_left = led_count["cuff"]["left"];
  g_innerlight.led.count_cuff_right = led_count["cuff"]["right"];

  _construct_led_layout();

  _send_state();
}


function _default_ledmap() {
  console.log("default led");

  var led_default_count = {
    "collar" : { "left" : parseInt(g_innerlight.led.default_count_collar_left),
                "right" : parseInt(g_innerlight.led.default_count_collar_right) },
    "lapel" :  { "left" : parseInt(g_innerlight.led.default_count_lapel_left),
                "right" : parseInt(g_innerlight.led.default_count_lapel_right) },
    "waist" :  { "left" : parseInt(g_innerlight.led.default_count_waist_left),
                "right" : parseInt(g_innerlight.led.default_count_waist_right) },
    "cuff" :   { "left" : parseInt(g_innerlight.led.default_count_cuff_left),
                "right" : parseInt(g_innerlight.led.default_count_cuff_right) }
  };

  g_innerlight.led.count_collar_left = parseInt(led_default_count["collar"]["left"]);
  g_innerlight.led.count_collar_right = parseInt(led_default_count["collar"]["right"]);
  g_innerlight.led.count_lapel_left = parseInt(led_default_count["lapel"]["left"]);
  g_innerlight.led.count_lapel_right = parseInt(led_default_count["lapel"]["right"]);
  g_innerlight.led.count_waist_left = parseInt(led_default_count["waist"]["left"]);
  g_innerlight.led.count_waist_right = parseInt(led_default_count["waist"]["right"]);
  g_innerlight.led.count_cuff_left = parseInt(led_default_count["cuff"]["left"]);
  g_innerlight.led.count_cuff_right = parseInt(led_default_count["cuff"]["right"]);

  // restore default order
  //
  g_innerlight.led.physical_order = [];
  for (var ii=0; ii<g_innerlight.led.default_physical_order.length; ii++) {
    g_innerlight.led.physical_order.push({ "label":"", "delta":0});
  }
  for (var ii=0; ii<g_innerlight.led.default_physical_order.length; ii++) {
    g_innerlight.led.physical_order[ii].label = g_innerlight.led.default_physical_order[ii].label;
    g_innerlight.led.physical_order[ii].delta = g_innerlight.led.default_physical_order[ii].delta;
  }


  _construct_led_layout();
}

//------------------
//  _       _ _   
// (_)_ __ (_) |_ 
// | | '_ \| | __|
// | | | | | | |_ 
// |_|_| |_|_|\__|
//                
//------------------

function _divrowheading(title) {
  var _row = document.createElement("div");
  _row.classList.add("pure-g");
  _row.classList.add("row");

  var _span = document.createElement("span");
  _span.style["font-size"] = "1.2em";
  _span.style["font-weight"] = "bold";
  _span.style["color"] = "#888888";
  _span.innerHTML = title;

  var _col = document.createElement("div");
  _col.classList.add("pure-u-1-3");
  _col.classList.add("col");
  _row.appendChild(_col);

  _col = document.createElement("div");
  _col.classList.add("pure-u-1-3");
  _col.classList.add("col");
  _col.appendChild(_span);
  _row.appendChild(_col);

  _col = document.createElement("div");
  _col.classList.add("pure-u-1-3");
  _col.classList.add("col");
  _row.appendChild(_col);
  return _row;
}

function _divrowheading1() {
  var txt= 
//"<div class='pure-g row'> " +
"  <div class='pure-u-1-8 col' > </div>" +
"  <div class='pure-u-1-8 col' > </div>" +
"" +
"  <div class='pure-u-1-8 col' style='margin-top:30px; margin-left:0px;'>" +
"    <span style='font-size:1em; font-weight:bold; color:#aaaaaa;' >" +
"      Left" +
"    </span>" +
"  </div>" +
"  <div class='pure-u-1-8 col' > </div>" +
"" +
"  <div class='pure-u-1-8 col' > </div>" +
"" +
"  <div class='pure-u-1-8 col' style='margin-top:30px;'>" +
"    <span style='font-size:1em; font-weight:bold; color:#aaaaaa;'>" +
"      Right" +
"    </span>" +
"  </div>" +
"  <div class='pure-u-1-8 col' > </div>" +
"  <div class='pure-u-1-8 col' > </div>" ;


  var _div = document.createElement("div");
  _div.classList.add("pure-g");
  _div.classList.add("row");
  _div.innerHTML = txt;

  return _div;
}

function _divrowinput(_idbase, idx_l, idx_r, ltxt, rtxt) {
  var _row = document.createElement("div");
  var ltxt = ((typeof ltxt === "undefined") ? "" : ltxt);
  var rtxt = ((typeof rtxt === "undefined") ? "" : rtxt);
  _row.classList.add("pure-g");
  _row.classList.add("row");

  var _col = document.createElement("div");
  _col.classList.add("pure-u-1-6");
  _col.classList.add("col");
  _row.appendChild(_col);

  if (typeof idx_l !== "undefined") {
    var _spanl = document.createElement("span");
    _spanl.style["font-size"] = "1em";
    _spanl.style["font-weight"] = "bold";
    _spanl.style["color"] = "#555555";
    _spanl.innerHTML = ltxt;

    _col = document.createElement("div");
    _col.classList.add("pure-u-1-6");
    _col.classList.add("col");
    _col.style["margin-top"] = "15px";
    _col.appendChild(_spanl);
    _row.appendChild(_col);

    var _inputl = document.createElement("input");
    _inputl.setAttribute("type", "text");
    _inputl.classList.add("pure-input-rounded");
    _inputl.setAttribute("id", _idbase + idx_l);

    _col = document.createElement("div");
    _col.classList.add("pure-u-1-6");
    _col.classList.add("col");
    _col.appendChild(_inputl);
    _row.appendChild(_col);
  }
  else {

    _col = document.createElement("div");
    _col.classList.add("pure-u-1-6");
    _col.classList.add("col");
    _row.appendChild(_col);

    _col = document.createElement("div");
    _col.classList.add("pure-u-1-6");
    _col.classList.add("col");
    _row.appendChild(_col);

  }

  if (typeof idx_r !== "undefined") {

    var _spanr = document.createElement("span");
    _spanr.style["font-size"] = "1em";
    _spanr.style["font-weight"] = "bold";
    _spanr.style["color"] = "#555555";
    _spanr.innerHTML = rtxt;

    _col = document.createElement("div");
    _col.classList.add("pure-u-1-6");
    _col.classList.add("col");
    _col.style["margin-top"] = "15px";
    _col.appendChild(_spanr);
    _row.appendChild(_col);

    var _inputr = document.createElement("input");
    _inputr.setAttribute("type", "text");
    _inputr.classList.add("pure-input-rounded");
    _inputr.setAttribute("id", _idbase + idx_r);

    _col = document.createElement("div");
    _col.classList.add("pure-u-1-6");
    _col.classList.add("col");
    _col.appendChild(_inputr);
    _row.appendChild(_col);
  }
  else {

    _col = document.createElement("div");
    _col.classList.add("pure-u-1-6");
    _col.classList.add("col");
    _row.appendChild(_col);

    _col = document.createElement("div");
    _col.classList.add("pure-u-1-6");
    _col.classList.add("col");
    _row.appendChild(_col);

  }

  _col = document.createElement("div");
  _col.classList.add("pure-u-1-6");
  _col.classList.add("col");
  _row.appendChild(_col);


  return _row;
}

function _construct_led_layout() {
  var n = 180+9;
  var text_height = 20;
  var w = 40, h = 30;
  var n2 = Math.floor(n/2);
  var parent = document.getElementById("ui_ledmap");

  parent.innerHTML = "";

  var led_count = {
    "collar" : { "left" : parseInt(g_innerlight.led.count_collar_left),
                "right" : parseInt(g_innerlight.led.count_collar_right) },
    "lapel" :  { "left" : parseInt(g_innerlight.led.count_lapel_left),
                "right" : parseInt(g_innerlight.led.count_lapel_right) },
    "waist" :  { "left" : parseInt(g_innerlight.led.count_waist_left),
                "right" : parseInt(g_innerlight.led.count_waist_right) },
    "cuff" :   { "left" : parseInt(g_innerlight.led.count_cuff_left),
                "right" : parseInt(g_innerlight.led.count_cuff_right) }
  };

  var n_right = led_count.collar.right +
                led_count.lapel.right +
                led_count.waist.right + 
                led_count.cuff.right;

  var n_left = led_count.collar.left +
                led_count.lapel.left +
                led_count.waist.left + 
                led_count.cuff.left;

  var n_tot = n_left + n_right;

  // Here, "start" is at the collar position 0
  //
  var start_right = n_right-1, dir_right = -1;
  var start_left = n_right, dir_left = 1;
  var _left_idx = start_left,
      _right_idx = start_right;

  // create the large led map list.
  // Two columns, both left and right, for each of the regions.
  //
  for (var _rgni=0; _rgni<4; _rgni++) {
    var region = ["collar", "lapel", "waist", "cuff"][_rgni];

    var n0 = led_count[region]["left"];
    var n1 = led_count[region]["right"];
    var n = n0;
    if (n < n1) { n = n1; }

    var _region_div = document.createElement("div");
    _region_div.style.border = "2px solid #cccccc";
    _region_div.style["padding"] = "10px";
    _region_div.style["margin"] = "10px";
    _region_div.style["border-radius"] = "10px";
    _region_div.style["-moz-border-radius"] = "10px";

    _region_div.appendChild(_divrowheading(region));
    _region_div.appendChild(_divrowheading1(region));

    for (var _ii=0; _ii<n; _ii++) {

      var ltxt = region + " " + _ii + " (" + _left_idx + ")" ;
      var rtxt = region + " " + _ii + " (" + _right_idx + ")" ;

      var idx0 = _left_idx;
      var idx1 = _right_idx;
      if (_ii >= n0) { idx0 = undefined; ltxt = ""; }
      if (_ii >= n1) { idx1 = undefined; rtxt = ""; }
      var _r = _divrowinput("ui_ledmap_", idx0, idx1, ltxt, rtxt);
      _region_div.appendChild(_r);

      if (_ii < n0) { _left_idx += dir_left; }
      if (_ii < n1) { _right_idx += dir_right; }

    }

    parent.appendChild(_region_div);

  }

  var ele = {};

  // setup checkbox actions and callbacks
  //
  for (var _rgni=0; _rgni<4; _rgni++) {
    var region = ["collar", "lapel", "waist", "cuff"][_rgni];

    for (var _lri=0; _lri<2; _lri++) {
      var lr = ["left", "right"][_lri];

      ele = document.getElementById("ui_ledmap_count" + region + lr);
      ele.value = led_count[region][lr];


      ele = document.getElementById("ui_ledmap_test" + region + lr);
      ele.onclick = (function(x,y) {
        return function() {
          var _e = document.getElementById("ui_ledmap_test" + x + y);

          var v = "test_" + x + "_" + y;

          if (g_innerlight.led[v] == 0) {
            g_innerlight.led[v] = 1;
            _e.innerHTML = "<div style='margin-top:10px;'><span class='fieldDescriptor'>X</span></div>";
          }
          else {
            g_innerlight.led[v] = 0;
            _e.innerHTML = "";
          }

          console.log(x,y);
        };
      })(region, lr);
    }

  }

  // populate input map with values
  //
  _construct_led_mapping();
  var _map = g_innerlight.led.map;

  console.log("n_tot", n_tot);

  for (var ii=0; ii<n_tot; ii++) {
    var ele = document.getElementById("ui_ledmap_" + ii);
    ele.value = _map[ii];
  }

  // populate contig regions
  //
  for (var side_idx=0; side_idx<2; side_idx++) {
    for (var region_idx=0; region_idx<4; region_idx++) {
      var side = ["left", "right"][side_idx];
      var region = ["collar", "lapel", "waist", "cuff"][region_idx];

      var ele_id = "ui_ledmap_contig_" + region + "_" + side + "_reverse";
      var ele = document.getElementById(ele_id);
      ele.onclick = (function(x,y) {
        return function() {
          var _eid = "ui_ledmap_contig_" + x + "_" + y + "_reverse";
          var _e = document.getElementById(_eid);
          console.log(_eid);
          if (g_innerlight.led["contig_" + x + "_" + y + "_reverse"] == 0) {
            _e.innerHTML = "<div style='margin-top:1px;'><span style='font-weight:bold; font-size:.5em;' >X</span></div>";
            g_innerlight.led["contig_" + x + "_" + y + "_reverse"] = 1;
          }
          else {
            _e.innerHTML = "";
            g_innerlight.led["contig_" + x + "_" + y + "_reverse"] = 0;
          }
        };
      })(region,side);
    }
  }

  // https://stackoverflow.com/questions/3050830/reorder-list-elements-jquery
  //
  // Do initial sort of physical order "sortable" jquery list
  //
  var jqele = {};
  var ida = [];

  jqele = $("#ui_ledmap_contig_physical_order");
  jqele.on("sortupdate", function(x,y) { console.log(">> physical", x, y); });

  var a = g_innerlight.led.physical_order;
  for (var i=0; i<a.length; i++) {
    var jqid = "#ui_ledmap_contig_physical_order_" + a[i].label;
    var _x = $(jqid);
    _x.parent().append(_x);
  }

}

function _slider_change(_mode) {
  if (_mode == "strobe") {
    var val = document.getElementById("ui_strobe_slider").value;
    g_innerlight.mode_option.strobe.speed = val;
  }

  else if (_mode == "pulse") {
    var val = document.getElementById("ui_pulse_slider").value;
    g_innerlight.mode_option.pulse.speed = val;
  }

  else if (_mode == "fill") {
    var val = document.getElementById("ui_fill_slider").value;
    g_innerlight.mode_option.fill.speed = val;
  }

  else if (_mode == "noise.speed") {
    var val = document.getElementById("ui_noise_speed_slider").value;
    g_innerlight.mode_option.noise.speed = val;
  }
  else if (_mode == "noise.brightness") {
    var val = document.getElementById("ui_noise_brightness_slider").value;
    g_innerlight.mode_option.noise.brightness= val;

    _color_preset(g_innerlight.mode_option.noise.preset_index, "ui_noise_color");

  }

  else if (_mode == "rainbow") {
    var val = document.getElementById("ui_rainbow_slider").value;
    g_innerlight.mode_option.rainbow.speed = val;
  }

}

function _init() {

  // Default select current mode
  //
  //var ele = document.getElementById("ui_mode_" + g_uiData.mode);
  var ele = document.getElementById("ui_mode_" + g_innerlight.mode);
  if ((typeof ele !== "undefined") && (ele !== null)) {
    g_uiData.mode = g_innerlight.mode;
    ele.classList.add("bkeySelected");

    var _m = g_innerlight.mode;
    var _el = document.getElementById("ui_mode_config");
    _el.setAttribute("data-page-name", "ui_" + _m);
    _el = document.getElementById("ui_mode_config0");
    _el.setAttribute("data-page-name", "ui_" + _m);


  }

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

        // save it in our data structure and push to api
        //
        console.log(">>>", _m, g_innerlight.mode_map[_m]);
        g_innerlight.mode = g_innerlight.mode_map[_m];
        _send_state();

      };
    })(mode);

  }


  // setup color pickers
  //
  $('#ui_solidColor_colorpicker').farbtastic(function(hex) {
    var _el = document.getElementById("ui_solidColor_colorbutton");
    _el.style.background = hex;
    g_innerlight.mode_option.solid_color.color = hex;
  });

  var tapmic = ["tap", "mic"];
  var tm_mode = ["Pulse", "Bullet", "Strobe"];
  var mode_name = ["pulse", "bullet", "strobe"];
  var fgbg = ["fg", "bg"];
  for (var _i=0; _i<tapmic.length; _i++) {
    for (var _j=0; _j<tm_mode.length; _j++) {
      for (var _k=0; _k<fgbg.length; _k++) {
      var ele_id = "ui_" + tapmic[_i] + tm_mode[_j] + "_colorpicker" + fgbg[_k];
      var clr_id = "ui_" + tapmic[_i] + tm_mode[_j] + "_colorbutton" + fgbg[_k];
      $("#" + ele_id).farbtastic(
        (function(_ui_id, _mode, _layer) {
          return function(hex) {
            var _el = document.getElementById(_ui_id);
            _el.style.background = hex;
            g_innerlight.mode_option[_mode][_layer] = hex;
          };
        })(clr_id, tapmic[_i] + "_" + mode_name[_j], fgbg[_k]) );
      }
    }
  }

  $('#ui_strobe_colorpickerfg').farbtastic(function(hex) {
    var _el = document.getElementById("ui_strobe_colorbuttonfg");
    _el.style.background = hex;

    g_innerlight.mode_option.strobe.fg = hex;
  });
  $('#ui_strobe_colorpickerbg').farbtastic(function(hex) {
    var _el = document.getElementById("ui_strobe_colorbuttonbg");
    _el.style.background = hex;

    g_innerlight.mode_option.strobe.bg = hex;
  });

  $('#ui_pulse_colorpickerfg').farbtastic(function(hex) {
    var _el = document.getElementById("ui_pulse_colorbuttonfg");
    _el.style.background = hex;

    g_innerlight.mode_option.pulse.fg = hex;
  });
  $('#ui_pulse_colorpickerbg').farbtastic(function(hex) {
    var _el = document.getElementById("ui_pulse_colorbuttonbg");
    _el.style.background = hex;

    g_innerlight.mode_option.pulse.bg = hex;
  });

  _setup_default();

  _construct_led_layout();
}

function _setup_default() {
  _color_preset(0, "ui_noise_color", true);

  for (var mode in g_innerlight.mode_option_default) {
    for (var option in g_innerlight.mode_option_default[mode]) {
      g_innerlight.mode_option[mode][option] =
        g_innerlight.mode_option_default[mode][option];
    }
  }

  var hex = "";

  hex = g_innerlight.mode_option.solid_color.color;
  if (hex[0] != '#') { hex = "#" + hex; }
  $.farbtastic("#ui_solidColor_colorpicker").setColor(hex);

  //--

  hex = g_innerlight.mode_option.strobe.fg;
  if (hex[0] != '#') { hex = "#" + hex; }
  $.farbtastic("#ui_strobe_colorpickerfg").setColor(hex);

  hex = g_innerlight.mode_option.strobe.bg;
  if (hex[0] != '#') { hex = "#" + hex; }
  $.farbtastic("#ui_strobe_colorpickerbg").setColor(hex);

  //--

  hex = g_innerlight.mode_option.pulse.fg;
  if (hex[0] != '#') { hex = "#" + hex; }
  $.farbtastic("#ui_pulse_colorpickerfg").setColor(hex);

  hex = g_innerlight.mode_option.pulse.bg;
  if (hex[0] != '#') { hex = "#" + hex; }
  $.farbtastic("#ui_pulse_colorpickerbg").setColor(hex);

  //--
  //--

  hex = g_innerlight.mode_option.tap_pulse.fg;
  if (hex[0] != '#') { hex = "#" + hex; }
  $.farbtastic("#ui_tapPulse_colorpickerfg").setColor(hex);

  hex = g_innerlight.mode_option.tap_pulse.bg;
  if (hex[0] != '#') { hex = "#" + hex; }
  $.farbtastic("#ui_tapPulse_colorpickerbg").setColor(hex);

  //--

  hex = g_innerlight.mode_option.tap_bullet.fg;
  if (hex[0] != '#') { hex = "#" + hex; }
  $.farbtastic("#ui_tapBullet_colorpickerfg").setColor(hex);

  hex = g_innerlight.mode_option.tap_bullet.bg;
  if (hex[0] != '#') { hex = "#" + hex; }
  $.farbtastic("#ui_tapBullet_colorpickerbg").setColor(hex);

  //--

  hex = g_innerlight.mode_option.tap_strobe.fg;
  if (hex[0] != '#') { hex = "#" + hex; }
  $.farbtastic("#ui_tapStrobe_colorpickerfg").setColor(hex);

  hex = g_innerlight.mode_option.tap_strobe.bg;
  if (hex[0] != '#') { hex = "#" + hex; }
  $.farbtastic("#ui_tapStrobe_colorpickerbg").setColor(hex);

  //--
  //--

  hex = g_innerlight.mode_option.mic_pulse.fg;
  if (hex[0] != '#') { hex = "#" + hex; }
  $.farbtastic("#ui_micPulse_colorpickerfg").setColor(hex);

  hex = g_innerlight.mode_option.mic_pulse.bg;
  if (hex[0] != '#') { hex = "#" + hex; }
  $.farbtastic("#ui_micPulse_colorpickerbg").setColor(hex);

  //--

  hex = g_innerlight.mode_option.mic_bullet.fg;
  if (hex[0] != '#') { hex = "#" + hex; }
  $.farbtastic("#ui_micBullet_colorpickerfg").setColor(hex);

  hex = g_innerlight.mode_option.mic_bullet.bg;
  if (hex[0] != '#') { hex = "#" + hex; }
  $.farbtastic("#ui_micBullet_colorpickerbg").setColor(hex);

  //--

  hex = g_innerlight.mode_option.mic_strobe.fg;
  if (hex[0] != '#') { hex = "#" + hex; }
  $.farbtastic("#ui_micStrobe_colorpickerfg").setColor(hex);

  hex = g_innerlight.mode_option.mic_strobe.bg;
  if (hex[0] != '#') { hex = "#" + hex; }
  $.farbtastic("#ui_micStrobe_colorpickerbg").setColor(hex);

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

    _send_cfgreq();

    setTimeout( function() { $("#body").addClass("load"); }, 20 );
  });;

})(jQuery);
