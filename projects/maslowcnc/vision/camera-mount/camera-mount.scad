// License: CC0

OUTER_DIAM = 110;
INNER_DIAM = 92;
CAM_DIAM = 8.75;

SCREW_DIAM = 2;

CAM_FIX_W = 20;
CAM_FIX_H = 35;
CAM_FIX_SPACE = 2;

module outer_plate() {
  difference() {
    circle(OUTER_DIAM/2, $fn=50);
    
    circle(CAM_FIX_W+5, $fn=30);

    outer_ds = INNER_DIAM/2 - 5;
    translate([outer_ds, 0]) circle(SCREW_DIAM/2, $fn=20);
    translate([0, outer_ds]) circle(SCREW_DIAM/2, $fn=20);
    translate([-outer_ds, 0]) circle(SCREW_DIAM/2, $fn=20);
    translate([0, -outer_ds]) circle(SCREW_DIAM/2, $fn=20);
    
    square([CAM_FIX_W+8, INNER_DIAM-20], center=true);
    
    
  }
}

module inner_plate() {
  difference() {
    cam_r = CAM_DIAM/2;
    circle(INNER_DIAM/2, $fn=50);
    circle(cam_r, $fn=40);
    
    dx = CAM_FIX_W/2 - SCREW_DIAM/2 - 2;
    dy = CAM_FIX_W/2 - SCREW_DIAM/2 - 2;
    translate([-dx, dy]) circle(SCREW_DIAM/2, $fn=20);
    translate([ dx, dy]) circle(SCREW_DIAM/2, $fn=20);
    translate([ dx,  0]) circle(SCREW_DIAM/2, $fn=20);
    translate([-dx,  0]) circle(SCREW_DIAM/2, $fn=20);
    
    translate([0, -(CAM_FIX_H - CAM_FIX_W) - 5]) square([CAM_FIX_W+8, 15], center=true);
    
    outer_ds = INNER_DIAM/2 - 5;
    translate([outer_ds, 0]) circle(SCREW_DIAM/2, $fn=20);
    translate([0, outer_ds]) circle(SCREW_DIAM/2, $fn=20);
    translate([-outer_ds, 0]) circle(SCREW_DIAM/2, $fn=20);
    translate([0, -outer_ds]) circle(SCREW_DIAM/2, $fn=20);
    
  };
}

module holder() {
  
  ds = (CAM_FIX_H - CAM_FIX_W)/2;
  difference() {
    translate([0,-ds]) square([CAM_FIX_W, CAM_FIX_H], center=true);
    
    dx = CAM_FIX_W/2 - SCREW_DIAM/2 - 2;
    dy = CAM_FIX_W/2 - SCREW_DIAM/2 - 2;
    translate([-dx, dy]) circle(SCREW_DIAM/2, $fn=20);
    translate([ dx, dy]) circle(SCREW_DIAM/2, $fn=20);
    translate([ dx,  0]) circle(SCREW_DIAM/2, $fn=20);
    translate([-dx,  0]) circle(SCREW_DIAM/2, $fn=20);
    
    circle(CAM_DIAM/2);
    
    translate([0,-CAM_FIX_W]) square([CAM_FIX_SPACE, CAM_FIX_H], center=true);
    
    translate([-CAM_FIX_W/2, -(ds + CAM_FIX_H/2 - 8)]) circle(5);
    translate([ CAM_FIX_W/2, -(ds + CAM_FIX_H/2 - 8)]) circle(5);
  };
  
}

inner_plate();
translate([0,OUTER_DIAM/2 + INNER_DIAM/2 + 5]) outer_plate();

translate([60,-0]) holder();
translate([60,40]) holder();
