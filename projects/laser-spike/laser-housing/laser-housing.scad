BODY_H = 9.5;
BODY_D = 6;
LZR_D = 3.5;
WEDGE_H = 4.5;
WEDGE_W = 3.5;

MATERIAL_THICKNESS = (1/16)*25.4;

SCREW_R = 1;

FN=32;

outer_r = BODY_D/2 + 2.5;
small_r = SCREW_R + 1;
side_x = outer_r + small_r - 1.0;

module top() {
  
  difference() {

    hull() {
      circle(outer_r, $fn=FN);
      translate([ side_x,0]) circle(small_r, $fn=FN);
      rotate(120, [0,0,1]) translate([side_x,0]) circle(small_r, $fn=FN);    
      rotate(-120, [0,0,1]) translate([side_x,0]) circle(small_r, $fn=FN);    
    };
    
    circle(LZR_D/2, $fn=FN);
    translate([ side_x,0]) circle(SCREW_R, $fn=FN);
    rotate( 120, [0,0,1]) translate([ side_x,0]) circle(SCREW_R, $fn=FN);
    rotate(-120, [0,0,1]) translate([ side_x,0]) circle(SCREW_R, $fn=FN);

  };
}

module mid() {
  difference() {
    hull() {
      circle(outer_r, $fn=FN);
      translate([ side_x,0]) circle(small_r, $fn=FN);
      rotate( 120, [0,0,1]) translate([ side_x,0]) circle(small_r, $fn=FN);    
      rotate(-120, [0,0,1]) translate([ side_x,0]) circle(small_r, $fn=FN);    
    };
    
    circle(BODY_D/2, $fn=FN);
    translate([ side_x,0]) circle(SCREW_R, $fn=FN);
    rotate( 120, [0,0,1]) translate([ side_x,0]) circle(SCREW_R, $fn=FN);
    rotate(-120, [0,0,1]) translate([ side_x,0]) circle(SCREW_R, $fn=FN);

    square([BODY_D+1, WEDGE_W], center=true);
  };
}

module bot() {
  difference() {
    hull() {
      circle(outer_r, $fn=FN);
      translate([ side_x,0]) circle(small_r, $fn=FN);
      rotate( 120, [0,0,1]) translate([ side_x,0]) circle(small_r, $fn=FN);    
      rotate(-120, [0,0,1]) translate([ side_x,0]) circle(small_r, $fn=FN);    
    };
    
    square([BODY_D+1, WEDGE_W], center=true);
    translate([ side_x,0]) circle(SCREW_R, $fn=FN);
    rotate( 120, [0,0,1]) translate([ side_x,0]) circle(SCREW_R, $fn=FN);
    rotate(-120, [0,0,1]) translate([ side_x,0]) circle(SCREW_R, $fn=FN);
  };
}

module bot_relief() {
  access_r = 1;
  difference() {
    hull() {
      circle(outer_r, $fn=FN);
      translate([ side_x,0]) circle(small_r, $fn=FN);
      rotate( 120, [0,0,1]) translate([ side_x,0]) circle(small_r, $fn=FN);    
      rotate(-120, [0,0,1]) translate([ side_x,0]) circle(small_r, $fn=FN);    
    };
    
    circle(1, $fn=FN);
    translate([0, 3.5*access_r]) circle(1, $fn=FN);
    translate([0,-3.5*access_r]) circle(1, $fn=FN);
    
    // screw holes
    translate([ side_x,0]) circle(SCREW_R, $fn=FN);
    rotate( 120, [0,0,1]) translate([ side_x,0]) circle(SCREW_R, $fn=FN);
    rotate(-120, [0,0,1]) translate([ side_x,0]) circle(SCREW_R, $fn=FN);
  };
}

dx = 2.5*BODY_D;
dy = 2*BODY_D;

// 1 top
// 6 mid + 1 mid for the under (7 tot)
// 3 bot
// 1 strain relief

module print9() {
top();

translate([dx,0]) bot();
translate([2*dx,0]) bot();

translate([2,dy]) rotate(180, [0,0,1]) mid();
translate([2.1*dx,dy]) rotate(180, [0,0,1])  mid();
//translate([1.1*dx, dy]) rotate(180, [0,0,1]) bot_relief();
translate([1.1*dx, dy]) rotate(180, [0,0,1]) mid();

translate([0,2*dy]) mid();
translate([dx,2*dy]) mid();
translate([2*dx,2*dy]) mid();
}

print9();
translate([2.1*dx,5.1*dy]) rotate(180,[0,0,1]) print9();

/*
translate([2,3*dy]) rotate(180, [0,0,1]) mid();
translate([1.1*dx,3*dy]) rotate(180, [0,0,1]) mid();
translate([2.1*dx,3*dy]) rotate(180, [0,0,1]) mid();
*/