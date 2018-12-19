// License: CC0

OUTER_DIAM = 110;
INNER_DIAM = 92;
CAM_DIAM = 8.75;

SCREW_DIAM = 2;

CAM_FIX_W = 20;
CAM_FIX_H = 40;
CAM_FIX_INSET = 10;
CAM_FIX_SPACE = 2;

FS=0.25;
FN=1000;

module outer_plate() {
  difference() {
    circle(OUTER_DIAM/2, $fn=FN);
    
    circle(CAM_FIX_W+5, $fn=FN);

    outer_ds = INNER_DIAM/2 - 5;
    translate([outer_ds, 0]) circle(SCREW_DIAM/2, $fn=FN);
    translate([0, outer_ds]) circle(SCREW_DIAM/2, $fn=FN);
    translate([-outer_ds, 0]) circle(SCREW_DIAM/2, $fn=FN);
    translate([0, -outer_ds]) circle(SCREW_DIAM/2, $fn=FN);
    
    square([CAM_FIX_W+16, INNER_DIAM-20], center=true);
 
  }
}

module inner_plate() {
  difference() {
    cam_r = CAM_DIAM/2;
    
    circle(INNER_DIAM/2, $fn=FN);
    
    // camera hole
    //
    circle(cam_r, $fn=FN);
    
    // fix jig screw holes
    //
    dx = CAM_FIX_W/2 - SCREW_DIAM/2 - 2;
    dy = CAM_FIX_W/2 - SCREW_DIAM/2 - 2;
    dy1 = CAM_DIAM/2;
    translate([-dx, dy + dy1]) circle(SCREW_DIAM/2, $fn=FN);
    translate([ dx, dy + dy1]) circle(SCREW_DIAM/2, $fn=FN);
    translate([ dx, dy1]) circle(SCREW_DIAM/2, $fn=FN);
    translate([-dx, dy1]) circle(SCREW_DIAM/2, $fn=FN);
    
    
    // opening for zip tie
    //
    translate([0, -(CAM_FIX_H - CAM_FIX_W) - 0]) square([CAM_FIX_W+16, 20], center=true);
    
    // connection to outer plate screw holes
    //
    outer_ds = INNER_DIAM/2 - 5;
    translate([outer_ds, 0]) circle(SCREW_DIAM/2, $fn=FN);
    translate([0, outer_ds]) circle(SCREW_DIAM/2, $fn=FN);
    translate([-outer_ds, 0]) circle(SCREW_DIAM/2, $fn=FN);
    translate([0, -outer_ds]) circle(SCREW_DIAM/2, $fn=FN);

  };
}

module holder() {
  
  ds = (CAM_FIX_H - CAM_FIX_W)/2;
  difference() {
    translate([0,-ds]) square([CAM_FIX_W, CAM_FIX_H], center=true);
    
    dx = CAM_FIX_W/2 - SCREW_DIAM/2 - 2;
    dy = CAM_FIX_W/2 - SCREW_DIAM/2 - 2 + 0;
    translate([-dx, dy]) circle(SCREW_DIAM/2, $fn=FN);
    translate([ dx, dy]) circle(SCREW_DIAM/2, $fn=FN);
    translate([ dx,  0]) circle(SCREW_DIAM/2, $fn=FN);
    translate([-dx,  0]) circle(SCREW_DIAM/2, $fn=FN);
    
    translate([0,-CAM_DIAM/2]) circle(CAM_DIAM/2, $fn=FN);
    
    translate([0,-CAM_FIX_W]) square([CAM_FIX_SPACE, CAM_FIX_H-CAM_DIAM/2], center=true);
    
    translate([-CAM_FIX_W/2, -(ds + CAM_FIX_H/2 - 8)]) circle(5, $fn=FN);
    translate([ CAM_FIX_W/2, -(ds + CAM_FIX_H/2 - 8)]) circle(5, $fn=FN);
  };
  
}

inner_plate();
translate([OUTER_DIAM/2 + INNER_DIAM/2 + 5, 0]) outer_plate();

translate([105, CAM_DIAM/2]) holder();
translate([35, 50]) rotate(90, [0,0,1]) holder();
