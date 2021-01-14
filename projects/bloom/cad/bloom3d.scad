// license: cc0
//

$fs=0.1;

THICKNESS=4;

INNER_W = 20;
INNER_H = 6;

ARM_W = 14;
ARM_L = 8;
ARM_dw = 2 + THICKNESS*2;
ARM_dout = 6;
ARM_dinn=2.5;
ARM_H = INNER_H/2;

BASE_W = 30;

SHAFT_W = 5;

OUTER_W = 20;
OUTER_w = 15;
OUTER_H = 6;



module _prong() {
  _h = THICKNESS;
  _d_out = ARM_dout;
  _d_inn = ARM_dinn;

  _len = ARM_L;

  difference() {
    union() {
      cylinder(_h, d=_d_out, center=true);
      translate([_len/2, 0, 0]) cube([_len, _d_out, _h], center=true);
    }
    cylinder(_h+1, d=_d_inn, center=true);
  }

}

module _prong2() {
  _w = ARM_dw;
  rotate(90, [1,0,0])
  union() {
    translate([0,0, _w/2]) _prong();
    translate([0,0,-_w/2]) _prong();
  }
}

module middle_shaft() {
  difference() {
    union() {
      hull() {
        cube([INNER_W, ARM_W, INNER_H], center=true);
        cube([ARM_W, INNER_W, INNER_H], center=true);
        rotate(45, [0,0,1]) cube([INNER_W, ARM_W, INNER_H], center=true);
        rotate(-45, [0,0,1]) cube([INNER_W, ARM_W, INNER_H], center=true);
      }
      //translate([
    }
    rotate(45,[0,0,1]) cube([SHAFT_W, SHAFT_W, INNER_H+1], center=true);
    cube([SHAFT_W, SHAFT_W, INNER_H+1], center=true);
  }
}

module bottom_base() {
  _W = OUTER_W;
  _w = OUTER_w;
  _hole_r = 3.1/2;
  _mw = (2/5)*_w;
  _shaft = SHAFT_W + 0.125;
  difference() {
    union() {
      hull() {
        cube([_W, _w, OUTER_H], center=true);
        cube([_w, _W, OUTER_H], center=true);
        rotate(45, [0,0,1]) cube([_W, _w, OUTER_H], center=true);
        rotate(-45, [0,0,1]) cube([_W, _w, OUTER_H], center=true);
      }
      //translate([
    }
    //rotate(45,[0,0,1]) cube([SHAFT_W, SHAFT_W, OUTER_H+1], center=true);
    cube([_shaft, _shaft, OUTER_H+1], center=true);

    translate([-_mw, _mw, 0]) cylinder(OUTER_H+1, r=_hole_r, center=true);
    translate([-_mw,-_mw, 0]) cylinder(OUTER_H+1, r=_hole_r, center=true);
    translate([ _mw,-_mw, 0]) cylinder(OUTER_H+1, r=_hole_r, center=true);
    translate([ _mw, _mw, 0]) cylinder(OUTER_H+1, r=_hole_r, center=true);
  }  
}

module conn(_len) {
  //_len = 40;
  _w = THICKNESS;
  _r = 2.25/2;
  difference() {
    union() {
      cube([_len, _w, _w], center=true);
      translate([-_len/2,0,0]) cylinder(_w, d=_w, center=true);
      translate([ _len/2,0,0]) cylinder(_w, d=_w, center=true);
    }
    translate([-_len/2, 0, 0]) cylinder(_w+1, r=_r, center=true);
    translate([ _len/2, 0, 0]) cylinder(_w+1, r=_r, center=true);

  }
}

module arm() {
  _l0 = 20;
  _l1 =10;
  _t = THICKNESS;
  _w = 6;

  _hole_r = 2.25/2;

  _backbone_w = _t*3.5;
  _xx=8;
  
  cube([_l0, _w, _backbone_w], center=true);

  difference() {
    translate([-_l0/2, 0, 0])
      rotate(-45, [0,0,1])
      
      union() {
        translate([-_l1/2,0,0])
          cube([_l1,_w,_t], center=true);
        translate([-_l1,0,0]) cylinder(_t, d=_w, center=true);
        //cylinder(_t, d=_w, center=true);
       
      }
    translate([-_l0/2, 0, 0])
      rotate(-45, [0,0,1])
      translate([-_l1,0,0]) 
      cylinder(_t+1, _r=_hole_r, center=true);
  }

  translate([_l0/2,_xx,0]) rotate(90,[0,1,0]) rotate(-90, [0,0,1]) _prong2();

  translate([_l0/2,0,0]) cylinder(_backbone_w, d=_w, center=true);
  translate([-_l0/2,0,0]) cylinder(_backbone_w, d=_w, center=true);
    
  
}


module foo() {
  _arm_ds = ARM_L + INNER_W/2;
  middle_shaft();
  translate([-_arm_ds,0,0])  _prong2();
  rotate(180, [0,0,1]) translate([-_arm_ds,0,0])  _prong2();
  rotate(90, [0,0,1]) translate([-_arm_ds,0,0])  _prong2();
  rotate(-90, [0,0,1]) translate([-_arm_ds,0,0])  _prong2();
}

module bar() {
  _arm_ds = ARM_L +  OUTER_W/2;
  bottom_base();
  rotate(0, [0,0,1]) translate([-_arm_ds,0,0])  _prong2();
  rotate(-45, [0,0,1]) translate([-_arm_ds,0,0])  _prong2();
  rotate(-90, [0,0,1]) translate([-_arm_ds,0,0])  _prong2();
  rotate(-90-45, [0,0,1]) translate([-_arm_ds,0,0])  _prong2();
  rotate(180, [0,0,1]) translate([-_arm_ds,0,0])  _prong2();
  rotate(180-45, [0,0,1]) translate([-_arm_ds,0,0])  _prong2();
  rotate(90, [0,0,1]) translate([-_arm_ds,0,0])  _prong2();
  rotate(45, [0,0,1]) translate([-_arm_ds,0,0])  _prong2();
}


module bar0() {
  _arm_ds = ARM_L +  OUTER_W/2;
  bottom_base();
  rotate(0, [0,0,1]) translate([-_arm_ds,0,0])  _prong2();
  //rotate(-45, [0,0,1]) translate([-_arm_ds,0,0])  _prong2();
  rotate(-90, [0,0,1]) translate([-_arm_ds,0,0])  _prong2();
  //rotate(-90-45, [0,0,1]) translate([-_arm_ds,0,0])  _prong2();
  rotate(180, [0,0,1]) translate([-_arm_ds,0,0])  _prong2();
  //rotate(180-45, [0,0,1]) translate([-_arm_ds,0,0])  _prong2();
  rotate(90, [0,0,1]) translate([-_arm_ds,0,0])  _prong2();
  //rotate(45, [0,0,1]) translate([-_arm_ds,0,0])  _prong2();
}

module bar1() {
  _arm_ds = ARM_L +  OUTER_W/2;
  bottom_base();
  //rotate(0, [0,0,1]) translate([-_arm_ds,0,0])  _prong2();
  rotate(-45, [0,0,1]) translate([-_arm_ds,0,0])  _prong2();
  //rotate(-90, [0,0,1]) translate([-_arm_ds,0,0])  _prong2();
  rotate(-90-45, [0,0,1]) translate([-_arm_ds,0,0])  _prong2();
  //rotate(180, [0,0,1]) translate([-_arm_ds,0,0])  _prong2();
  rotate(180-45, [0,0,1]) translate([-_arm_ds,0,0])  _prong2();
  //rotate(90, [0,0,1]) translate([-_arm_ds,0,0])  _prong2();
  rotate(45, [0,0,1]) translate([-_arm_ds,0,0])  _prong2();
}

translate([0,40,0]) conn(10);
rotate(90, [1,0,0]) arm();

//bar0();
//translate([0,0,10]) bar1();

//translate([0,0,20]) foo();