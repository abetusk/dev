// License: CC0
//

$fn = 50;

SPINDLE_DIAM = 52;
SPINDLE_HEIGHT = 51;
CAM_TOP_DIAM = 32.88;
CAM_BOT_DIAM = 31.35;

_EDGE = 16;

CAM_EDGE = SPINDLE_DIAM/2 + _EDGE + CAM_TOP_DIAM/2 + 10;

_M3 = 3;
_M3r = _M3/2;

module main_body() {

  b_h = SPINDLE_DIAM + 2*_EDGE;
  b_w = SPINDLE_DIAM + 2*_EDGE;
  dx = SPINDLE_DIAM/2 + _EDGE + 2*_M3;
  dy = SPINDLE_DIAM/2 + _EDGE - 2*_M3;

  difference() {
    union() {
      square([b_h,b_w], center=true);

      // joiners
      //
      translate([-dx, dy-2*_M3]) square([4*_M3, 4*_M3]);
      translate([ dx-4*_M3, dy-2*_M3]) square([4*_M3, 4*_M3]);
      translate([ dx-4*_M3,-dy-2*_M3]) square([4*_M3, 4*_M3]);
      translate([-dx,-dy-2*_M3]) square([4*_M3, 4*_M3]);

      //translate([-dx+2*_M3,0]) square([4*_M3, 4*_M3], center=true);
      //translate([ dx-2*_M3,0]) square([4*_M3, 4*_M3], center=true);

      // m3 support
      //
      translate([-dx, dy]) circle(2*_M3);
      translate([ dx, dy]) circle(2*_M3);
      translate([ dx,-dy]) circle(2*_M3);
      translate([-dx,-dy]) circle(2*_M3);

      //translate([-dx,0]) circle(2*_M3);
      //translate([ dx,0]) circle(2*_M3);
    }

    // spindle body
    //
    circle(SPINDLE_DIAM/2);
    translate([0,SPINDLE_DIAM/2]) square([SPINDLE_DIAM, SPINDLE_DIAM], center=true);

    // screw holes
    //
    translate([-dx, dy]) circle(_M3r);
    translate([ dx, dy]) circle(_M3r);
    translate([-dx,-dy]) circle(_M3r);
    translate([ dx,-dy]) circle(_M3r);

    //translate([-dx, 0]) circle(_M3r);
    //translate([ dx, 0]) circle(_M3r);
  }
}

module top_plate() {

  b_h = SPINDLE_DIAM + 2*_EDGE;
  b_w = SPINDLE_DIAM + 2*_EDGE;
  dx = SPINDLE_DIAM/2 + _EDGE + 2*_M3;
  dy = SPINDLE_DIAM/2 + _EDGE - 2*_M3;

  sup_thick = 10;
  gap = 6;

  difference() {
    union() {
      main_body();
      translate([0, -CAM_EDGE]) circle(CAM_TOP_DIAM/2 + sup_thick);
      translate([0, -CAM_EDGE+CAM_TOP_DIAM/2]) square([CAM_TOP_DIAM+2*sup_thick, CAM_TOP_DIAM/2+20], center=true);
    }
    translate([0, -CAM_EDGE]) circle(CAM_TOP_DIAM/2);
    translate([0, -CAM_EDGE-CAM_TOP_DIAM]) square([gap, 40], center=true);
    translate([-gap - _M3r, -CAM_EDGE - CAM_TOP_DIAM/2 - sup_thick/2 + 1])  circle(_M3r);
    translate([ gap + _M3r, -CAM_EDGE - CAM_TOP_DIAM/2 - sup_thick/2 + 1])  circle(_M3r);
  }
}

module back_support() {
  main_body();
}


module bot_plate() {

  b_h = SPINDLE_DIAM + 2*_EDGE;
  b_w = SPINDLE_DIAM + 2*_EDGE;
  dx = SPINDLE_DIAM/2 + _EDGE + 2*_M3;
  dy = SPINDLE_DIAM/2 + _EDGE - 2*_M3;

  sup_thick = 10;
  gap = 6;

  difference() {
    union() {
      main_body();
      translate([0, -CAM_EDGE]) circle(CAM_BOT_DIAM/2 + sup_thick);
      translate([0, -CAM_EDGE+CAM_BOT_DIAM/2]) square([CAM_BOT_DIAM+2*sup_thick, CAM_BOT_DIAM/2+20], center=true);
    }
    translate([0, -CAM_EDGE]) circle(CAM_BOT_DIAM/2);
    translate([0, -CAM_EDGE-CAM_BOT_DIAM]) square([gap, 40], center=true);
    translate([-gap - _M3r, -CAM_EDGE - CAM_BOT_DIAM/2 - sup_thick/2 + 1])  circle(_M3r);
    translate([ gap + _M3r, -CAM_EDGE - CAM_BOT_DIAM/2 - sup_thick/2 + 1])  circle(_M3r);
  }
}

//top_plate();
//translate([110,0]) bot_plate();

back_support();
translate([110,0]) back_support();
