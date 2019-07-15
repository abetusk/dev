// 59.2
// 52.56
//hole_diam =3.25;
hole_diam =3.25;
//  52.56 + 2*(3.25/2)
gikfun_long_width_screw_center_ds = 55.81;
gikfun_long_width = 63.6;

// 7 7/16 long
gikfun_long_length = 188;

// 7 3/32 
gikfun_long_length_screw_center_ds = 180.2;

// 2.3 screw to edge
gikfun_long_screw_to_edge = 2.3;

//
//

gikfun_short_width_screw_center_ds = 55.81;
gikfun_short_width = 63.6;
gikfun_short_length = 93.96;
gikfun_short_length_screw_center_ds = 86.5;

sf_width = 45.8;
sf_length = 33.5;
sf_screw_to_edge = 2.95;
sf_screw_center_ds = 37;

pwm_length_screw_ds = 56;
pwm_width_screw_ds = 19;
pwm_hole_diam = 3.5;

strain_relief_hole_ds = 16;
strain_relief_width = 20;
strain_relief_height = 16;


screw_r = 3/2;

corner_r = 5;
power_plate_corner_r = corner_r;
power_plate_width = 56;
power_plate_height = 34;

power_button_w = 11.75;
power_button_h = 18.5;


FN=25;


module _power_hole_lip() {
  r = power_plate_corner_r;
  w = power_plate_width - 2*r;
  h = power_plate_height - 2*r;

  hole_x = w/2;
  hole_y = h/2;

  wlip = w - 2*sqrt(2)*r;
  hlip = h - 2*sqrt(2)*r;

  hull() {
    translate([-wlip/2, hlip/2]) circle(r, $fn=FN);
    translate([ wlip/2, hlip/2]) circle(r, $fn=FN);
    translate([ wlip/2,-hlip/2]) circle(r, $fn=FN);
    translate([-wlip/2,-hlip/2]) circle(r, $fn=FN);
  }

}

module power_spacer() {
  r = power_plate_corner_r;
  w = power_plate_width - 2*r;
  h = power_plate_height - 2*r;

  hole_x = w/2;
  hole_y = h/2;

  wlip = w - 2*sqrt(2)*r;
  hlip = h - 2*sqrt(2)*r;

  difference() {
    union() {
      hull() {
        translate([-w/2, h/2]) circle(r, $fn=FN);
        translate([ w/2, h/2]) circle(r, $fn=FN);
      }
      hull() {
        translate([ w/2, h/2]) circle(r, $fn=FN);
        translate([ w/2,-h/2]) circle(r, $fn=FN);
      }
      hull() {
        translate([ w/2,-h/2]) circle(r, $fn=FN);
        translate([-w/2,-h/2]) circle(r, $fn=FN);
      }
      hull() {
        translate([-w/2,-h/2]) circle(r, $fn=FN);
        translate([-w/2, h/2]) circle(r, $fn=FN);
      }
    }

    _power_hole_lip();

    translate([-hole_x, hole_y]) circle(screw_r, $fn=FN);
    translate([ hole_x, hole_y]) circle(screw_r, $fn=FN);
    translate([ hole_x,-hole_y]) circle(screw_r, $fn=FN);
    translate([-hole_x,-hole_y]) circle(screw_r, $fn=FN);
  }
}

module power_plate() {

  r = power_plate_corner_r;
  w = power_plate_width - 2*r;
  h = power_plate_height - 2*r;

  hole_x = w/2;
  hole_y = h/2;

  wlip = w - 2*sqrt(2)*r;
  hlip = h - 2*sqrt(2)*r;

  difference () {
    hull() {
      translate([-w/2, h/2]) circle(r, $fn=FN);
      translate([ w/2, h/2]) circle(r, $fn=FN);
      translate([ w/2,-h/2]) circle(r, $fn=FN);
      translate([-w/2,-h/2]) circle(r, $fn=FN);
    }

    square([power_button_h, power_button_w], center=true);

    translate([-hole_x, hole_y]) circle(screw_r, $fn=FN);
    translate([ hole_x, hole_y]) circle(screw_r, $fn=FN);
    translate([ hole_x,-hole_y]) circle(screw_r, $fn=FN);
    translate([-hole_x,-hole_y]) circle(screw_r, $fn=FN);
  }
}



module lzr_housing0_hull() {
  buf_diam = 8;
  hull() {
    // pwm
    //
    translate([0,0]) circle(buf_diam);
    translate([gikfun_long_width, 0]) circle(buf_diam);
    translate([gikfun_long_width, gikfun_long_length]) circle(buf_diam);
    translate([0, gikfun_long_length]) circle(buf_diam);

    // arduino
    //
    translate([gikfun_long_width + buf_diam,0]) circle(buf_diam);
    translate([gikfun_long_width + buf_diam + gikfun_short_width,0]) circle(buf_diam);
    translate([gikfun_long_width + buf_diam + gikfun_short_width,gikfun_short_length]) circle(buf_diam);
    translate([gikfun_long_width + buf_diam,gikfun_short_length]) circle(buf_diam);

    // power supply
    //
    translate([gikfun_long_width + buf_diam, gikfun_short_length+buf_diam]) circle(buf_diam);
    translate([gikfun_long_width + buf_diam + sf_length, gikfun_short_length+buf_diam]) circle(buf_diam);
    translate([gikfun_long_width + buf_diam + sf_length, gikfun_short_length+buf_diam+sf_width]) circle(buf_diam);
    translate([gikfun_long_width + buf_diam, gikfun_short_length+buf_diam+sf_width]) circle(buf_diam);

  };
}

module lzr_housing0_hole() {
    
  buf_diam = 8;
  
  // long holes
  //
  ds = gikfun_long_screw_to_edge;
  sw0 = gikfun_long_width_screw_center_ds;
  sl0 = gikfun_long_length_screw_center_ds;
  translate([ds,ds]) circle(hole_diam/2, $fn=FN);
  translate([ds,ds]) translate([sw0,0]) circle(hole_diam/2, $fn=FN);
  translate([ds,ds]) translate([0,sl0]) circle(hole_diam/2, $fn=FN);
  translate([ds,ds]) translate([sw0,sl0]) circle(hole_diam/2, $fn=FN);

  bx1 = gikfun_long_width + buf_diam;
  by1 = gikfun_long_length + buf_diam;
  sw1 = gikfun_short_width_screw_center_ds;
  sl1 = gikfun_short_length_screw_center_ds;

  // short holes
  //
  translate([bx1+ds,ds]) circle(hole_diam/2, $fn=FN);
  translate([bx1+ds+sw1, ds]) circle(hole_diam/2, $fn=FN);
  translate([bx1+ds+sw1, ds + sl1]) circle(hole_diam/2, $fn=FN);
  translate([bx1+ds, ds + sl1]) circle(hole_diam/2, $fn=FN);

  ds2 = sf_screw_to_edge;
  bx2 = bx1+ds + sf_width/2;
  by2 = ds+sl1+2*buf_diam+5;
  translate([bx2,by2]) circle(hole_diam/2, $fn=FN);
  translate([bx2,by2]) translate([0,sf_screw_center_ds]) circle(hole_diam/2, $fn=FN);
}

module strain_relief_hole() {
  r = hole_diam/2;
  translate([-strain_relief_hole_ds, 0]) circle(r, $fn=FN);
  translate([ strain_relief_hole_ds, 0]) circle(r, $fn=FN);
}

module lzr_housing0_base() {
  buf_diam = 8;
  difference() {
    lzr_housing0_hull();
    lzr_housing0_hole();
    translate([82,170]) rotate(-45, [0,0,1]) strain_relief_hole();
  };
}

module pwm_hole() {
  r = pwm_hole_diam/2;
  dx = pwm_width_screw_ds;
  dy = pwm_length_screw_ds;
  circle(r, $fn=FN);
  translate([dx,0]) circle(r, $fn=FN);
  translate([dx,dy]) circle(r, $fn=FN);
  translate([0,dy]) circle(r, $fn=FN);
}

module lzr_housing0_top() {
  pwm_t_x = 4.5 - 3.5/(sqrt(2)*2);
  pwm_t_y = 22 - 3.5/(sqrt(2)*2);
  
  r = power_plate_corner_r;
  hole_x = power_plate_width/2 - r;
  hole_y = power_plate_height/2 - r;
  
  difference() {
    lzr_housing0_hull();
    lzr_housing0_hole();
    
    rotate(90, [0,0,1]) translate([140,-35]) _power_hole_lip();
    rotate(90, [0,0,1]) 
    translate([140,-35])
    for (i = [0:1]) {
      translate([-hole_x, hole_y]) circle(screw_r, $fn=FN);  
      translate([ hole_x, hole_y]) circle(screw_r, $fn=FN);
      translate([ hole_x,-hole_y]) circle(screw_r, $fn=FN);
      translate([-hole_x,-hole_y]) circle(screw_r, $fn=FN);
    };
    
    //translate([4.5,22]) pwm_hole();
    translate([pwm_t_x,pwm_t_y]) pwm_hole();
    
    translate([82,170]) rotate(-45, [0,0,1]) strain_relief_hole();
    translate([120,45]) rotate(90,[0,0,1]) strain_relief_hole();
    translate([10,130]) rotate(90,[0,0,1]) strain_relief_hole();
  };
}

module lzr_housing1_hull() {
  buf_diam = 8;
  hull() {
    // pwm
    //
    translate([0,0]) circle(buf_diam);
    translate([gikfun_long_width, 0]) circle(buf_diam);
    translate([gikfun_long_width, gikfun_long_length]) circle(buf_diam);
    translate([0, gikfun_long_length]) circle(buf_diam);
  };
}

module lzr_housing1_hole() {
 
  buf_diam = 8;
  
  // long holes
  //
  ds = gikfun_long_screw_to_edge;
  sw0 = gikfun_long_width_screw_center_ds;
  sl0 = gikfun_long_length_screw_center_ds;
  translate([ds,ds]) circle(hole_diam/2, $fn=FN);
  translate([ds,ds]) translate([sw0,0]) circle(hole_diam/2, $fn=FN);
  translate([ds,ds]) translate([0,sl0]) circle(hole_diam/2, $fn=FN);
  translate([ds,ds]) translate([sw0,sl0]) circle(hole_diam/2, $fn=FN);
}

module lzr_housing1_base() {
  difference() {
    lzr_housing1_hull();
    lzr_housing1_hole();
  }
}

module lzr_housing1_top() {
  w = gikfun_long_width;
  l = gikfun_long_length;
  
  
  l2 = pwm_length_screw_ds;
  w2 = pwm_width_screw_ds;

  pwm_t_x = 3.5/sqrt(2);
  pwm_t_y = l/2 - l2/2 + 3.5/sqrt(2);

  difference() {
    lzr_housing1_hull();
    lzr_housing1_hole();
    
    //translate([0,l/2 - l2/2 ]) pwm_hole();
    translate([pwm_t_x, pwm_t_y]) pwm_hole();
    
    translate([55,90]) rotate(90,[0,0,1]) strain_relief_hole();
    translate([30,20]) strain_relief_hole();
    translate([30,170]) strain_relief_hole();
  }
}

module strain_relief() {
  ds = strain_relief_hole_ds;
  dh = strain_relief_height;
  difference() {
    hull() {
      translate([-ds,0]) circle(dh/2, $fn=FN);
      translate([ ds,0]) circle(dh/2, $fn=FN);
    };
    
    translate([-ds,0]) circle(hole_diam/2, $fn=FN);
    translate([ ds,0]) circle(hole_diam/2, $fn=FN);
  };
}


module placement0() {
  translate([200,0]) rotate(90,[0,0,1]) lzr_housing0_base();
  translate([410,0]) rotate(90,[0,0,1]) lzr_housing0_top();
  translate([200,155]) rotate(90,[0,0,1]) lzr_housing1_base();
  translate([410,155]) rotate(90, [0,0,1]) lzr_housing1_top();

  translate([50,135]) strain_relief();
  translate([15,120]) rotate(90,[0,0,1]) strain_relief();

  translate([260,135]) strain_relief();
  translate([220,120]) rotate(90,[0,0,1]) strain_relief();
}

module placement1a() {
  translate([200,0]) rotate(90,[0,0,1]) lzr_housing0_base();
  translate([200,155]) rotate(90,[0,0,1]) lzr_housing1_base();

  translate([50,135]) strain_relief();
  translate([15,120]) rotate(90,[0,0,1]) strain_relief();

}

module placement1b() {

  translate([270,0]) rotate(90,[0,0,1]) lzr_housing0_top();
  translate([110,]) lzr_housing1_top();

  translate([120,135]) strain_relief();
  translate([85,120]) rotate(90,[0,0,1]) strain_relief();
}

module placement2a() {
  //translate([200,0]) rotate(90,[0,0,1]) lzr_housing1_base();
  translate([200,0]) rotate(90,[0,0,1]) lzr_housing1_top();
  translate([200,80]) rotate(90,[0,0,1]) lzr_housing1_top();
  translate([220,30]) rotate(90,[0,0,1]) strain_relief();
  translate([220,80]) rotate(90,[0,0,1]) strain_relief();
}

module placement2b() {
  translate([200,0]) rotate(90,[0,0,1]) lzr_housing0_base();
  translate([15,120]) rotate(90,[0,0,1]) strain_relief();
  translate([50,135]) strain_relief();
}

module placement2c() {
  translate([200,0]) rotate(90,[0,0,1]) lzr_housing0_top();
  translate([15,120]) rotate(90,[0,0,1]) strain_relief();
  translate([50,135]) strain_relief();
  
  translate([150,165]) power_spacer();
  translate([50,165]) power_plate();
}

//placement2a();
placement2c();
//placement2c();

