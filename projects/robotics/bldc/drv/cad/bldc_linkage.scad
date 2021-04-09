// License: CC0
//


FN=64;


module base_linkage(link_l) {
  //_rbase = 2.5/2;
  _base_attach_d = 12;
  _base_attach_screw_r = 2.5/2;
  _base_outer_d = 28;
  _base_access_d = 8;

  _end_inner_r = 8/2;
  _end_outer_d = 18;  

  _link_w = 10;

  _end_attach_d = 12;
  _attach_r = 2.5/2;

  difference() {
    union() {
      circle(_base_outer_d/2, $fn=FN);
      translate([link_l/2, 0,0]) square([link_l, _link_w], center=true);
      translate([link_l,0]) circle(_end_outer_d/2, $fn=FN);
    }
    
    circle(_base_access_d/2, $fn=FN);
    translate([ _base_attach_d/2, 0, 0]) circle(_base_attach_screw_r, $fn=FN);
    translate([-_base_attach_d/2, 0, 0]) circle(_base_attach_screw_r, $fn=FN);
    translate([ 0,-_base_attach_d/2, 0]) circle(_base_attach_screw_r, $fn=FN);
    translate([ 0, _base_attach_d/2, 0]) circle(_base_attach_screw_r, $fn=FN);

    translate([link_l, 0, 0]) circle(_end_inner_r, $fn=FN);
    translate([link_l,0,0])
    union() {
      translate([-_end_attach_d/2, 0, 0]) circle(_attach_r, $fn=FN);
      translate([ _end_attach_d/2, 0, 0]) circle(_attach_r, $fn=FN);
      translate([ 0, _end_attach_d/2, 0]) circle(_attach_r, $fn=FN);
      translate([ 0,-_end_attach_d/2, 0]) circle(_attach_r, $fn=FN);
    }

  }
}

module join_linkage(link_l) {
  _link_w = 10;
  _end_outer_d = 18;
  _end_inner_r = 8/2;

  _end_attach_d = 12;
  _attach_r = 2.5/2;

  difference() {
    union() {
      circle(_end_outer_d/2, $fn=FN);
      translate([ link_l/2, 0, 0]) square([link_l, _link_w], center=true);
      translate([ link_l  , 0, 0]) circle(_end_outer_d/2, $fn=FN);
    }
    circle(_end_inner_r, $fn=FN);
    translate([link_l, 0, 0]) circle(_end_inner_r, $fn=FN);

    translate([-_end_attach_d/2, 0, 0]) circle(_attach_r, $fn=FN);
    translate([ _end_attach_d/2, 0, 0]) circle(_attach_r, $fn=FN);
    translate([ 0, _end_attach_d/2, 0]) circle(_attach_r, $fn=FN);
    translate([ 0,-_end_attach_d/2, 0]) circle(_attach_r, $fn=FN);

    translate([link_l,0,0])
    union() {
      translate([-_end_attach_d/2, 0, 0]) circle(_attach_r, $fn=FN);
      translate([ _end_attach_d/2, 0, 0]) circle(_attach_r, $fn=FN);
      translate([ 0, _end_attach_d/2, 0]) circle(_attach_r, $fn=FN);
      translate([ 0,-_end_attach_d/2, 0]) circle(_attach_r, $fn=FN);
    }

  }
}

module end_linkage(link_del, link_l) {
  _end_attach_d = 12;
  _attach_r = 2.5/2;
  _node_inner_r = 8/2;

  _node_d = 18;
  _link_w =  10;
  difference() {
    union() {
      circle(_node_d/2, $fn=FN);
      translate([ link_del/2, 0, 0]) square([link_del, _link_w], center=true);
      translate([ link_del  , 0, 0]) circle(_node_d/2, $fn=FN);
      hull() {
        translate([link_del, 0,0]) circle(_link_w/2);
        translate([ link_del + link_l - 10, -10, 0]) circle(_link_w/3);
      }
      hull() {
        translate([ link_del + link_l - 10, -10, 0]) circle(_link_w/3);
        translate([ link_del + link_l, -15, 0]) circle(_link_w/4);
      }
    }

    union() {
      circle(_node_inner_r, $fn=FN);
      translate([-_end_attach_d/2, 0, 0]) circle(_attach_r, $fn=FN);
      translate([ _end_attach_d/2, 0, 0]) circle(_attach_r, $fn=FN);
      translate([ 0, _end_attach_d/2, 0]) circle(_attach_r, $fn=FN);
      translate([ 0,-_end_attach_d/2, 0]) circle(_attach_r, $fn=FN);
    }

    translate([link_del, 0, 0])
    union() {
      circle(_node_inner_r, $fn=FN);
      translate([-_end_attach_d/2, 0, 0]) circle(_attach_r, $fn=FN);
      translate([ _end_attach_d/2, 0, 0]) circle(_attach_r, $fn=FN);
      translate([ 0, _end_attach_d/2, 0]) circle(_attach_r, $fn=FN);
      translate([ 0,-_end_attach_d/2, 0]) circle(_attach_r, $fn=FN);
    }


  }
}

module join_holder() {
  _end_attach_d = 12;
  _attach_r = 2.5/2;
  _outer_r = 18/2;
  _inner_r = 6.5/2;

  difference() {
    union() {
      circle(_outer_r, $fn=FN);
    }
    circle(_inner_r, $fn=FN);
    translate([ _end_attach_d/2, 0, 0]) circle(_attach_r, $fn=FN);
    translate([-_end_attach_d/2, 0, 0]) circle(_attach_r, $fn=FN);
    translate([ 0, _end_attach_d/2, 0]) circle(_attach_r, $fn=FN);
    translate([ 0,-_end_attach_d/2, 0]) circle(_attach_r, $fn=FN);
  }

}

LINK_D = 40;
LINK_H = 70;
LINK_W = 100;

base_linkage(LINK_D);
translate([ 0, 30, 0]) base_linkage(LINK_H);
translate([ 0,-28, 0]) join_linkage(LINK_H);

translate([0,-50,0]) join_holder();
translate([20,-50, 0]) join_holder();
translate([40,-50, 0]) join_holder();
translate([60,-50, 0]) join_holder();

translate([ 0,-70, 0]) join_holder();
translate([20,-70, 0]) join_holder();
translate([40,-70, 0]) join_holder();
translate([60,-70, 0]) join_holder();

translate([LINK_D + 20,10,0]) join_holder();
translate([LINK_D + 40,10,0]) join_holder();
translate([LINK_D + 20,-10,0]) join_holder();
translate([LINK_D + 40,-10,0]) join_holder();



translate([LINK_H + 30, 20,0]) rotate(-90, [0,0,1]) end_linkage(LINK_D, LINK_H);
