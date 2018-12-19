// licensed under CC0

screw_dist_w = 20;
screw_dist_h = 12;
screw_r = 1;

cam_diam = 8;

//heart_r = 5;
heart_r = 9.5;
heart_s = 12.96*heart_r/5;
heart_bottom = -10*heart_r/5;
heart_small_r = 1*heart_r/5;


FN=100;
$fn=FN;

s2 = sqrt(2)/2;
pnt = s2*heart_r;

dheart = heart_r - heart_r/6;

module hart() {

  union() {
    translate([-dheart,0]) circle(heart_r, $fn=FN);
    translate([ dheart,0]) circle(heart_r, $fn=FN);
    
    hull() {
      translate([-pnt-dheart+heart_small_r,-pnt+heart_small_r]) circle(heart_small_r, $fn=FN);
      translate([0,0]) circle(heart_small_r, $fn=FN);
      translate([ pnt+dheart-heart_small_r,-pnt+heart_small_r]) circle(heart_small_r, $fn=FN);
      translate([0,heart_bottom-heart_small_r]) circle(heart_small_r, $fn=FN);
      polygon( [[-pnt-dheart,-pnt], [0,0], [pnt + dheart, -pnt], [0,heart_bottom]]);
    };
    
  };
}


module hart_outer() {

  difference() {
    translate([0,7]) hart();
    
    translate([-screw_dist_w/2,0]) circle(screw_r);
    translate([ screw_dist_w/2,0]) circle(screw_r);
    translate([-screw_dist_w/2, screw_dist_h]) circle(screw_r);
    translate([ screw_dist_w/2, screw_dist_h]) circle(screw_r);
    
    circle(cam_diam/2);
  };
}

module hart_spacer() {

  difference() {
    translate([0,7]) hart();
    
    translate([-screw_dist_w/2,0]) circle(screw_r);
    translate([ screw_dist_w/2,0]) circle(screw_r);
    translate([-screw_dist_w/2, screw_dist_h]) circle(screw_r);
    translate([ screw_dist_w/2, screw_dist_h]) circle(screw_r);
    
    translate([0,5]) square([screw_dist_w - 4*screw_r, 5*screw_dist_h/4], center=true);
    square([cam_diam+4, cam_diam+4], center=true);
    
  };
}

hart_outer();
translate([40,0]) hart_spacer();