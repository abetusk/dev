// LIcense: CC0

// X and Y endstop attachements for the CNC3018pro

$fn = 32;

_m2_r = 2/2;
_m5_r = 5/2;

d_limit_switch = (12.2 + 7.3)/2;
de_limit_switch = 4 + 2.5/2;

BRACKET_PART_H = 83;
BRACKET_PART_W = 20;

module BracketHolder() {

  _w = BRACKET_PART_H;
  _h = BRACKET_PART_W;

  difference() {
    union() {
      square([_h,_w], center=true);
      translate([_w/2-_h/2 ,-_w/2 + _h/2]) square([_w,_h], center=true);
    }

    // m5 mounting holes (for frame);
    //
    translate([_h/2 + _w/2 - 10, -_w/2 + _h/2]) circle(_m5_r);
    translate([_h/2 + _w/2 + 10, -_w/2 + _h/2]) circle(_m5_r);

    hull() {
      translate([_h/2 - 6.5,  -_w/2 + 60 + _m2_r + de_limit_switch]) circle(_m2_r);
      translate([_h/2 - 10.5, -_w/2 + 60 + _m2_r + de_limit_switch]) circle(_m2_r);
    }

    hull() {
      translate([_h/2 - 6.5,  -_w/2 + 60 + _m2_r + de_limit_switch + d_limit_switch]) circle(_m2_r);
      translate([_h/2 - 10.5, -_w/2 + 60 + _m2_r + de_limit_switch + d_limit_switch]) circle(_m2_r);

    }
      
  }

}

module bracketHolderYoink() {

  _w = BRACKET_PART_H;
  _h = BRACKET_PART_W;

  wedge = 40;

  dx = _w/2 - _h/2 + wedge;


  difference() {
    union() {
      square([_h,_w], center=true);
      translate([dx ,-_w/2 + _h/2]) square([_w,_h], center=true);
      translate([dx - _w/2 + _h/2 ,-_w/2 - _h ]) square([_h,2*_h], center=true);
      translate([dx - _w/2 - wedge/2 , -wedge/2 -_w/2 - _h/2 ]) square([wedge,_h], center=true);

      translate([0,-wedge - _h/2]) square([_h,wedge], center=true);
    }

    // m5 mounting holes (for frame);
    //
    translate([wedge +_h/2 + _w/2 - 10, -_w/2 + _h/2]) circle(_m5_r);
    translate([wedge + _h/2 + _w/2 + 10, -_w/2 + _h/2]) circle(_m5_r);

    hull() {
      translate([_h/2 - 6.5,  -_w/2 + 60 + _m2_r + de_limit_switch]) circle(_m2_r);
      translate([_h/2 - 10.5, -_w/2 + 60 + _m2_r + de_limit_switch]) circle(_m2_r);
    }

    hull() {
      translate([_h/2 - 6.5,  -_w/2 + 60 + _m2_r + de_limit_switch + d_limit_switch]) circle(_m2_r);
      translate([_h/2 - 10.5, -_w/2 + 60 + _m2_r + de_limit_switch + d_limit_switch]) circle(_m2_r);
    }
      
  }

}


module render_all() {

  BracketHolder();
  translate([85,0]) rotate(180, [0,0,1]) BracketHolder();
  translate([110,0]) BracketHolder();
  translate([115,0]) translate([80,0]) rotate(180, [0,0,1]) BracketHolder();
}

//translate([10,BRACKET_PART_H/2]) render_all();

bracketHolderYoink();