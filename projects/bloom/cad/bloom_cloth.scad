// License: CC0
//

H_SIZE=6;
W_SHORT = 80;
W_LONG = 120;

$fn=20;

module _x() {
  difference() {
    union() {
      rotate(0, [0,0,1]) square([W_SHORT, H_SIZE], center=true);
      rotate(90, [0,0,1]) square([W_SHORT, H_SIZE], center=true);

      rotate(45, [0,0,1]) square([W_LONG, H_SIZE], center=true);
      rotate(-45, [0,0,1]) square([W_LONG, H_SIZE], center=true);

    }
    circle(3/2);
    rotate(0, [0,0,1]) translate([W_SHORT/2 - 5, 0]) circle(2.5/2);
    rotate(180, [0,0,1]) translate([W_SHORT/2 - 5, 0]) circle(2.5/2);
    rotate(90, [0,0,1]) translate([W_SHORT/2 - 5, 0]) circle(2.5/2);
    rotate(-90, [0,0,1]) translate([W_SHORT/2 - 5, 0]) circle(2.5/2);

    rotate(45, [0,0,1]) translate([W_LONG/2 - 5, 0]) circle(2.5/2);
    rotate(-45, [0,0,1]) translate([W_LONG/2 - 5, 0]) circle(2.5/2);
    rotate(180-45, [0,0,1]) translate([W_LONG/2 - 5, 0]) circle(2.5/2);
    rotate(180+45, [0,0,1]) translate([W_LONG/2 - 5, 0]) circle(2.5/2);
  }
}

_x();