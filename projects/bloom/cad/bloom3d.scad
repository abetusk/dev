// license: cc0
//

$fs=0.1;

THICKNESS=2;
HOLE_R = 2.25/2;

INNER_W = 20;
INNER_H = 6;

ARM_W = 14;
ARM_L = 5;
ARM_dw = 2 + THICKNESS*2;
ARM_dout = 5;
//ARM_dinn=2.5;
ARM_dinn=2*HOLE_R;
ARM_H = INNER_H/2;

BASE_W = 30;

SHAFT_W = 4;

OUTER_W = 10;
OUTER_w = 8.5;
OUTER_H = 5;



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

module fixed_base() {
  _arm_ds = ARM_L +  OUTER_W/2;
  _W = OUTER_W;
  _w = OUTER_w;
  _hole_r = HOLE_R;


  _base_h = OUTER_H*2;
  _dh = OUTER_H;

  _mw = (2/5)*_w;
  _shaft = SHAFT_W + 0.125;

  translate([0,0,OUTER_H/2])
  union() {
    difference() {
      union() {
        hull() {
          cube([_W, _w, _base_h], center=true);
          cube([_w, _W, _base_h], center=true);
          rotate(45, [0,0,1]) cube([_W, _w, _base_h], center=true);
          rotate(-45, [0,0,1]) cube([_W, _w, _base_h], center=true);
        }
        //translate([
      }
      //rotate(45,[0,0,1]) cube([SHAFT_W, SHAFT_W, OUTER_H+1], center=true);
      cube([_shaft, _shaft, _base_h+1], center=true);

      translate([-_mw, _mw, 0]) cylinder(_base_h+1, r=_hole_r, center=true);
      translate([-_mw,-_mw, 0]) cylinder(_base_h+1, r=_hole_r, center=true);
      translate([ _mw,-_mw, 0]) cylinder(_base_h+1, r=_hole_r, center=true);
      translate([ _mw, _mw, 0]) cylinder(_base_h+1, r=_hole_r, center=true);
    }

    rotate(0, [0,0,1]) translate([-_arm_ds,0,_dh/2])  _prong2();
    rotate(-45, [0,0,1]) translate([-_arm_ds,0,-_dh/2])  _prong2();
    rotate(-90, [0,0,1]) translate([-_arm_ds,0,_dh/2])  _prong2();
    rotate(-90-45, [0,0,1]) translate([-_arm_ds,0,-_dh/2])  _prong2();
    rotate(180, [0,0,1]) translate([-_arm_ds,0,_dh/2])  _prong2();
    rotate(180-45, [0,0,1]) translate([-_arm_ds,0,-_dh/2])  _prong2();
    rotate(90, [0,0,1]) translate([-_arm_ds,0,_dh/2])  _prong2();
    rotate(45, [0,0,1]) translate([-_arm_ds,0,-_dh/2])  _prong2();
  }
}

module shaft_base() {
  _arm_ds = ARM_L +  OUTER_W/2;
  _W = OUTER_W;
  _w = OUTER_w;
  _hole_r = HOLE_R;


  _base_h = OUTER_H*2;
  _dh = OUTER_H;
  _shaft_h = 20;

  _mw = (2/5)*_w;
  _shaft = SHAFT_W - 0.125;

  translate([0,0,OUTER_H/2])
  union() {
    difference() {
      union() {
        hull() {
          cube([_W, _w, _base_h], center=true);
          cube([_w, _W, _base_h], center=true);
          rotate(45, [0,0,1]) cube([_W, _w, _base_h], center=true);
          rotate(-45, [0,0,1]) cube([_W, _w, _base_h], center=true);
        }
        //translate([
      }

      translate([-_mw, _mw, 0]) cylinder(_base_h+1, r=_hole_r, center=true);
      translate([-_mw,-_mw, 0]) cylinder(_base_h+1, r=_hole_r, center=true);
      translate([ _mw,-_mw, 0]) cylinder(_base_h+1, r=_hole_r, center=true);
      translate([ _mw, _mw, 0]) cylinder(_base_h+1, r=_hole_r, center=true);
    }

    translate([0,0,(_shaft_h+_base_h)/2]) cube([_shaft, _shaft, _shaft_h + _base_h], center=true);

    rotate(0, [0,0,1]) translate([-_arm_ds,0,_dh/2])  _prong2();
    rotate(-45, [0,0,1]) translate([-_arm_ds,0,-_dh/2])  _prong2();
    rotate(-90, [0,0,1]) translate([-_arm_ds,0,_dh/2])  _prong2();
    rotate(-90-45, [0,0,1]) translate([-_arm_ds,0,-_dh/2])  _prong2();
    rotate(180, [0,0,1]) translate([-_arm_ds,0,_dh/2])  _prong2();
    rotate(180-45, [0,0,1]) translate([-_arm_ds,0,-_dh/2])  _prong2();
    rotate(90, [0,0,1]) translate([-_arm_ds,0,_dh/2])  _prong2();
    rotate(45, [0,0,1]) translate([-_arm_ds,0,-_dh/2])  _prong2();
  }
}


module bottom_base() {
  _W = OUTER_W;
  _w = OUTER_w;
  _hole_r = HOLE_R;
//  _hole_r = 3.1/2;
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
  //_r = 2.25/2;
  _r = HOLE_R;
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
  _l0 = 12;
  _l1 = 8;
  _t = THICKNESS;
  //_w = 6;
  _w = OUTER_H;

  _hole_r = HOLE_R;

  //_backbone_w = _t*3.5;
  _backbone_w = ARM_dw + _t;
  _xx=5;

  _c = ARM_dout;

  hull() {
  
    //cube([_l0, _w, _backbone_w], center=true);
    translate([_l0/2,0,0]) cylinder(_backbone_w, d=_c, center=true);
    translate([-_l0/2,0,0]) cylinder(_t, d=_w, center=true);
  }
  //translate([-_l0/2,0,0]) cylinder(_backbone_w, d=_w, center=true);

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
      cylinder(_t+1, r=_hole_r, center=true);

  }

  translate([_l0/2,_xx,0]) rotate(90,[0,1,0]) rotate(-90, [0,0,1]) _prong2();
    
  
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

module joint(l0, l1, a) {
  _t = THICKNESS;
  _h = THICKNESS;
  _d_out = ARM_dout;
  _d_inn = ARM_dinn;

  difference() {
    hull() {
      cylinder(_t, d=_d_out, center=true);
      translate([l0,0,0]) cylinder(_t, d=_d_out, center=true);
    }
    cylinder(_t+1, d=_d_inn, center=true);
  }
  difference() {
    hull() {
      translate([l0,0,0]) cylinder(_t, d=_d_out, center=true);
      translate([l1,0,0]) rotate(a, [0,0,1]) translate([l0,0,0]) cylinder(_t, d=_d_out, center=true);
    }
    translate([l1,0,0]) rotate(a, [0,0,1]) translate([l0,0,0]) cylinder(_t+1, d=_d_inn, center=true);
  }

}


_dx = 26;
_dy = 26;

_dy1=15;

module plate0() {
  translate([3*_dx,2*_dy1,0]) joint(4, 4, 30);
  translate([3*_dx,3*_dy1,0]) joint(4, 4, 30);
  translate([3*_dx,4*_dy1,0]) joint(4, 4, 30);
  translate([3*_dx,5*_dy1,0]) joint(4, 4, 30);


  translate([4*_dx,2*_dy1,0]) joint(8, 8, 30);
  translate([4*_dx,3*_dy1,0]) joint(8, 8, 30);
  translate([4*_dx,4*_dy1,0]) joint(8, 8, 30);
  translate([4*_dx,5*_dy1,0]) joint(8, 8, 30);
}

module plate1() {
  //translate([0,40,0]) conn(10);
  translate([0,_dy,0]) rotate(90, [1,0,0]) arm();
  translate([_dx,_dy,0]) rotate(90, [1,0,0]) arm();
  translate([2*_dx,_dy,0]) rotate(90, [1,0,0]) arm();
  translate([0,2*_dy,0]) rotate(90, [1,0,0]) arm();
  translate([_dx,2*_dy,0]) rotate(90, [1,0,0]) arm();
  translate([2*_dx,2*_dy,0]) rotate(90, [1,0,0]) arm();
  translate([0,3*_dy,0]) rotate(90, [1,0,0]) arm();
  translate([_dx,3*_dy,0]) rotate(90, [1,0,0]) arm();
  translate([2*_dx,3*_dy,0]) rotate(90, [1,0,0]) arm();

  fixed_base();
  translate([_dx,0,0]) shaft_base();

}

translate([0,0,THICKNESS/2]) plate0();
translate([0,0,OUTER_H/2]) plate1();

//fixed_base();
//translate([40,0,0]) shaft_base();
//translate([-40,0,0]) arm();