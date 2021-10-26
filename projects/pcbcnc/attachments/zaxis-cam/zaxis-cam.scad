// License: CC0
//

$fn = 50;

SPINDLE_DIAM = 44.35;
SPINDLE_HEIGHT = 34.85;
_M3 = 3;
_M3r = _M3/2;

CAM_TOP_R = 32.95/2;
CAM_BOT_R = 32/2;

module base_plate() {
  dx = SPINDLE_DIAM + 30;
  dy = SPINDLE_DIAM + 30;
  tabr = 2*_M3;
  difference() {
    union() {
      square([dx, dy], center=true);

      translate([-(dx/2 + tabr), SPINDLE_DIAM/2 + tabr]) circle(tabr*1);
      translate([-(dx/2 + tabr), SPINDLE_DIAM/2 ]) square([2*tabr,2*tabr]);
 

      translate([ (dx/2 + tabr), SPINDLE_DIAM/2 + tabr]) circle(tabr*1);
      translate([ (dx/2 - tabr), SPINDLE_DIAM/2 ]) square([2*tabr,2*tabr]);

      translate([ (dx/2 + tabr), -(SPINDLE_DIAM/2 + tabr)]) circle(tabr*1);
      translate([ (dx/2 - tabr), -SPINDLE_DIAM/2 - 2*tabr ]) square([2*tabr,2*tabr]);

      translate([-(dx/2 + tabr), -(SPINDLE_DIAM/2 + tabr)]) circle(tabr*1);
      translate([-(dx/2 + tabr), -SPINDLE_DIAM/2 - 2*tabr ]) square([2*tabr,2*tabr]);
    }
    circle(SPINDLE_DIAM/2);
    translate([-dx/2, 0]) square([dx, SPINDLE_DIAM], center=true);

    translate( [-dx/2 - tabr, SPINDLE_DIAM/2 + tabr]) circle(_M3r);
    translate( [ dx/2 + tabr, SPINDLE_DIAM/2 + tabr]) circle(_M3r);

    translate( [-dx/2 - tabr, -SPINDLE_DIAM/2 - tabr]) circle(_M3r);
    translate( [ dx/2 + tabr, -SPINDLE_DIAM/2 - tabr]) circle(_M3r);

  }
}

module top_plate() {
  dx = SPINDLE_DIAM + 30;
  dy = SPINDLE_DIAM + 15;
  tabr = 2*_M3;

  hldr_r = CAM_TOP_R + 8;
  gap = 6;

  difference() {
    union() {
      base_plate();
      translate([0,-dy]) circle(hldr_r);
      translate([0,-dy/2 -10]) square([dx, dy/2], center=true);
    }

    translate([0,-dy]) circle(CAM_TOP_R);
    translate([0,-dy - CAM_TOP_R]) square([gap, CAM_TOP_R], center=true);
    translate([-7,-dy-CAM_TOP_R-_M3r-2]) circle(_M3r);
    translate([ 7,-dy-CAM_TOP_R-_M3r-2]) circle(_M3r);
    
  }
}

module bot_plate() {
  dx = SPINDLE_DIAM + 30;
  dy = SPINDLE_DIAM + 15;
  tabr = 2*_M3;

  hldr_r = CAM_BOT_R + 8;
  gap = 6;

  difference() {
    union() {
      base_plate();
      translate([0,-dy]) circle(hldr_r);
      translate([0,-dy/2 -10]) square([dx, dy/2], center=true);
    }

    translate([0,-dy]) circle(CAM_BOT_R);
    translate([0,-dy - CAM_BOT_R]) square([gap, CAM_BOT_R], center=true);
    translate([-7,-dy-CAM_BOT_R-_M3r-2]) circle(_M3r);
    translate([ 7,-dy-CAM_BOT_R-_M3r-2]) circle(_M3r);
    
  }
}

module all() {
top_plate();
translate([90,-73]) rotate(180, [0,0,1]) bot_plate();
translate([-30,20]) rotate(180, [0,0,1]) base_plate();
translate([132,-90]) rotate(0, [0,0,1]) base_plate();
}

rotate(90, [0,0,1]) top_plate();
translate([-30,-33]) rotate(-90, [0,0,1]) bot_plate();

