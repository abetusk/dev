// Licnesed under CC0
// 

HOLE_DIAM = 2;
BACKING_SCREW_dW = 49;
BACKING_SCREW_dH = 55;
//BACKING_BORDER_R = 4;
BACKING_BORDER_R  = 4;

RPI_W_BACKING_SCREW_dW = 23; // 25.75 - 20.25 = 5.5, 5.5/2 = 2.75, 20.25 + 2.75 = 23
RPI_W_BACKING_SCREW_dH = 58; //60.75 - 55.5 = 5.25, 5.25/2 = 2.625, 55.5+2.5 = 58

THICKNESS = 3;

USB_WIRE_D = 6;

backing_h = BACKING_SCREW_dH + 2*BACKING_BORDER_R + 10;
backing_w = BACKING_SCREW_dW + 2*BACKING_BORDER_R;

rpi_w_backing_h = RPI_W_BACKING_SCREW_dH + 2*BACKING_BORDER_R + 16;
rpi_w_backing_w = RPI_W_BACKING_SCREW_dW + 2*BACKING_BORDER_R;

bot_support_l = BACKING_SCREW_dH/3;
bot_support_dw = backing_w / 1;

//support_w = 20;
support_w = 12;
support_slat_l = 10;
support_slat_spacing = 5;
support_ds = support_slat_l + support_slat_spacing;

BASE_OUTER_DIAM = 81.5;
BASE_INNER_DIAM = 71.5;

connecting_screw_ds = 40;

led_holder_outer_d = 26;
led_holder_inner_d = 12;

strap_r = 6;
strap_w = 2*strap_r + backing_w + 6;
strap_h = 26;

base_support_mid_h = 10;
base_support_mid_w = 30;


FN=50;

module backing() {
  ds = (led_holder_outer_d + led_holder_inner_d)/4;
  
  dw = backing_w - 2*BACKING_BORDER_R;
  dh = backing_h - 2*BACKING_BORDER_R;
  difference() {
    hull() {
      translate([ dw/2, dh/2]) circle(BACKING_BORDER_R, $fn=FN);
      translate([-dw/2, dh/2]) circle(BACKING_BORDER_R, $fn=FN);
      translate([-dw/2,-dh/2]) circle(BACKING_BORDER_R, $fn=FN);
      translate([ dw/2,-dh/2]) circle(BACKING_BORDER_R, $fn=FN);
    };
    translate([-BACKING_SCREW_dW/2, BACKING_SCREW_dH/2]) circle(HOLE_DIAM/2, $fn=FN);
    translate([ BACKING_SCREW_dW/2, BACKING_SCREW_dH/2]) circle(HOLE_DIAM/2, $fn=FN);
    translate([ BACKING_SCREW_dW/2,-BACKING_SCREW_dH/2]) circle(HOLE_DIAM/2, $fn=FN);
    translate([-BACKING_SCREW_dW/2,-BACKING_SCREW_dH/2]) circle(HOLE_DIAM/2, $fn=FN);
    
    translate([-support_w/2, -(backing_h/2 - support_slat_spacing - support_slat_l/2)])
      square([THICKNESS, support_slat_l], center=true);
    translate([ support_w/2, -(backing_h/2 - support_slat_spacing - support_slat_l/2)])
      square([THICKNESS, support_slat_l], center=true);
    
    translate([ ds,  0]) circle(HOLE_DIAM/2, $fn=FN);
    translate([-ds,  0]) circle(HOLE_DIAM/2, $fn=FN);
    translate([  0, ds]) circle(HOLE_DIAM/2, $fn=FN);
    translate([  0,-ds]) circle(HOLE_DIAM/2, $fn=FN);
  };
}

module backing_rpi_w() {
  ds = (led_holder_outer_d + led_holder_inner_d)/4;
  
  dw = rpi_w_backing_w - 2*BACKING_BORDER_R;
  dh = rpi_w_backing_h - 2*BACKING_BORDER_R;
  
  w2 = RPI_W_BACKING_SCREW_dW/2;
  h2 = RPI_W_BACKING_SCREW_dH/2;
  
  difference() {
    
    // main body (with rounded corners)
    //
    hull() {
      translate([ dw/2, dh/2]) circle(BACKING_BORDER_R, $fn=FN);
      translate([-dw/2, dh/2]) circle(BACKING_BORDER_R, $fn=FN);
      translate([-dw/2,-dh/2]) circle(BACKING_BORDER_R, $fn=FN);
      translate([ dw/2,-dh/2]) circle(BACKING_BORDER_R, $fn=FN);
    };
    
    // rpi mounting holes
    //
    translate([-w2, h2]) circle(HOLE_DIAM/2, $fn=FN);
    translate([ w2, h2]) circle(HOLE_DIAM/2, $fn=FN);
    translate([ w2,-h2]) circle(HOLE_DIAM/2, $fn=FN);
    translate([-w2,-h2]) circle(HOLE_DIAM/2, $fn=FN);
    
    // support slots
    //
    translate([-support_w/2, -(rpi_w_backing_h/2 - support_slat_spacing - support_slat_l/2)])
      square([THICKNESS, support_slat_l], center=true);
    translate([ support_w/2, -(rpi_w_backing_h/2 - support_slat_spacing - support_slat_l/2)])
      square([THICKNESS, support_slat_l], center=true);
    
    // led holder holes
    //
    translate([ ds,  0]) circle(HOLE_DIAM/2, $fn=FN);
    translate([-ds,  0]) circle(HOLE_DIAM/2, $fn=FN);
    translate([  0, ds]) circle(HOLE_DIAM/2, $fn=FN);
    translate([  0,-ds]) circle(HOLE_DIAM/2, $fn=FN);
  };
}


module led_strap() {
  
  ds2 = strap_w/2  - (strap_w - backing_w)/4;
  dh2 = strap_h/4;
  
  led_holder_screw_ds = (led_holder_outer_d + led_holder_inner_d)/4;
  t = led_holder_screw_ds;

  difference() {
    hull() {
      translate([-(strap_w/2-strap_r), (strap_h/2 - strap_r)]) circle(strap_r, $fn=FN);
      translate([ (strap_w/2-strap_r), (strap_h/2 - strap_r)]) circle(strap_r, $fn=FN);
      translate([ (strap_w/2-strap_r),-(strap_h/2 - strap_r)]) circle(strap_r, $fn=FN);
      translate([-(strap_w/2-strap_r),-(strap_h/2 - strap_r)]) circle(strap_r, $fn=FN);
    };
    
    translate([ ds2, dh2]) circle(HOLE_DIAM/2, $fn=FN);
    translate([ ds2,-dh2]) circle(HOLE_DIAM/2, $fn=FN);
    translate([-ds2,-dh2]) circle(HOLE_DIAM/2, $fn=FN);
    translate([-ds2, dh2]) circle(HOLE_DIAM/2, $fn=FN);
    
    circle(led_holder_inner_d/2, $fn=FN);
    
    translate([ t, 0]) circle(HOLE_DIAM/2, $fn=FN);
    translate([-t, 0]) circle(HOLE_DIAM/2, $fn=FN);
    translate([ 0, t]) circle(HOLE_DIAM/2, $fn=FN);
    translate([ 0,-t]) circle(HOLE_DIAM/2, $fn=FN);
  };
}

module led_strap_spacer() {
  ds2 = strap_w/2  - (strap_w - backing_w)/4;
  dh2 = strap_h/4;
  difference() {
    hull() {
      translate([0, dh2]) circle(strap_r/1.5, $fn=FN);
      translate([0,-dh2]) circle(strap_r/1.5, $fn=FN);
    };
    translate([ 0, dh2]) circle(HOLE_DIAM/2, $fn=FN);
    translate([ 0,-dh2]) circle(HOLE_DIAM/2, $fn=FN);
  };
}

module led_holder() {
  
  ds = (led_holder_outer_d + led_holder_inner_d)/4;
  difference() {
    circle(led_holder_outer_d/2, $fn=FN);
    circle(led_holder_inner_d/2, $fn=FN);
    
    translate([ ds,  0]) circle(HOLE_DIAM/2, $fn=FN);
    translate([-ds,  0]) circle(HOLE_DIAM/2, $fn=FN);
    translate([  0, ds]) circle(HOLE_DIAM/2, $fn=FN);
    translate([  0,-ds]) circle(HOLE_DIAM/2, $fn=FN);
  };
}

module backing_support() {

  difference() {
    union() {
      square([support_ds, support_ds], center=true);
      translate([support_ds/2 + THICKNESS/2,  support_slat_l/2 - support_slat_spacing/2])
        square([THICKNESS, support_slat_l], center=true);
      translate([-(support_slat_l/2 - support_slat_spacing/2), -(support_ds/2 + THICKNESS/2)])
        square([support_slat_l, THICKNESS], center=true);
    };
    translate([-support_ds/2, support_ds/2]) rotate(45, [0,0,1]) square(10,center=true);
  };
}

module base_top() {
  offst = support_slat_l/2 - support_slat_spacing/2;
  difference() {
    circle(BASE_OUTER_DIAM/2, $fn=FN);
    translate([-support_w/2,offst]) square([THICKNESS,support_slat_l], center=true);
    translate([ support_w/2,offst]) square([THICKNESS,support_slat_l], center=true);
    
    circle(HOLE_DIAM/2, $fn=FN);
    translate([-connecting_screw_ds/2,0]) circle(HOLE_DIAM/2, $fn=FN);
    translate([ connecting_screw_ds/2,0]) circle(HOLE_DIAM/2, $fn=FN);
    translate([0, connecting_screw_ds/2]) circle(HOLE_DIAM/2, $fn=FN);
    translate([0,-connecting_screw_ds/2]) circle(HOLE_DIAM/2, $fn=FN);
    
    translate([-BASE_OUTER_DIAM/(2*sqrt(2)), BASE_OUTER_DIAM/(2*sqrt(2))])
      square([USB_WIRE_D,USB_WIRE_D], center=true);
    hull() {
      translate([-BASE_OUTER_DIAM/2, BASE_OUTER_DIAM/2]) circle(USB_WIRE_D/2, $fn=FN);
      translate([-BASE_OUTER_DIAM/5, BASE_OUTER_DIAM/5]) circle(USB_WIRE_D/2, $fn=FN);
    };
  };
}

module base_mid() {
  difference() {
    circle(BASE_INNER_DIAM/2, $fn=FN);
    circle(HOLE_DIAM/2, $fn=FN);
    translate([-connecting_screw_ds/2,0]) circle(HOLE_DIAM/2, $fn=FN);
    translate([ connecting_screw_ds/2,0]) circle(HOLE_DIAM/2, $fn=FN);
    translate([0, connecting_screw_ds/2]) circle(HOLE_DIAM/2, $fn=FN);
    translate([0,-connecting_screw_ds/2]) circle(HOLE_DIAM/2, $fn=FN);
    
    translate([-bot_support_dw/2, 0]) square([THICKNESS,bot_support_l], center=true);
    translate([ bot_support_dw/2, 0]) square([THICKNESS,bot_support_l], center=true);
    
    translate([-BASE_INNER_DIAM/(2*sqrt(2)), BASE_INNER_DIAM/(2*sqrt(2))])
      square([USB_WIRE_D,USB_WIRE_D], center=true);
    hull() {
      translate([-BASE_OUTER_DIAM/2, BASE_OUTER_DIAM/2]) circle(USB_WIRE_D/2, $fn=FN);
      translate([-BASE_OUTER_DIAM/5, BASE_OUTER_DIAM/5]) circle(USB_WIRE_D/2, $fn=FN);
    };
  }
}

module base_bot() {
  difference() {
    circle(BASE_OUTER_DIAM/2, $fn=FN);
    circle(HOLE_DIAM/2, $fn=FN);
    translate([-connecting_screw_ds/2,0]) circle(HOLE_DIAM/2, $fn=FN);
    translate([ connecting_screw_ds/2,0]) circle(HOLE_DIAM/2, $fn=FN);
    translate([0, connecting_screw_ds/2]) circle(HOLE_DIAM/2, $fn=FN);
    translate([0,-connecting_screw_ds/2]) circle(HOLE_DIAM/2, $fn=FN);
    
    translate([-bot_support_dw/2, 0]) square([THICKNESS,bot_support_l], center=true);
    translate([ bot_support_dw/2, 0]) square([THICKNESS,bot_support_l], center=true);
    
    translate([-BASE_OUTER_DIAM/(2*sqrt(2)), BASE_OUTER_DIAM/(2*sqrt(2))])
      square([USB_WIRE_D,USB_WIRE_D], center=true);
    hull() {
      
      translate([-BASE_OUTER_DIAM/2, BASE_OUTER_DIAM/2]) circle(USB_WIRE_D/2, $fn=FN);
      translate([-BASE_OUTER_DIAM/5, BASE_OUTER_DIAM/5]) circle(USB_WIRE_D/2, $fn=FN);
    };
  };
}

module base_support() {
  union() {
    square([base_support_mid_w, base_support_mid_h], center=true);
    translate([0, (base_support_mid_h+THICKNESS)/2,0]) square([bot_support_l, THICKNESS], center=true);
    translate([0,-(base_support_mid_h+THICKNESS)/2,0]) square([bot_support_l, THICKNESS], center=true);
  };
}

module base_support_angle() {
  a = 15;
  
  union() {
    translate([0,5])
    union() {
      square([base_support_mid_w, base_support_mid_h], center=true);
      translate([0,(base_support_mid_h+THICKNESS)/2]) square([bot_support_l, THICKNESS], center=true);
    };
    rotate(a, [0,0,1])
    union() {
      square([base_support_mid_w, base_support_mid_h], center=true);
      translate([0,-(base_support_mid_h+THICKNESS)/2]) square([bot_support_l, THICKNESS], center=true);
    };
  };
  
}

module realize_0()  {
  backing();
  translate([BASE_OUTER_DIAM-10,0]) base_top();
  translate([0,BASE_OUTER_DIAM-5]) base_mid();
  
  translate([80,60]) led_strap();
  translate([80,90]) led_strap();

  translate([135,50]) led_holder();
  translate([135,80]) led_holder();

  translate([155,55]) led_strap_spacer();
  translate([155,85]) led_strap_spacer();

  translate([165,55]) led_strap_spacer();
  translate([165,85]) led_strap_spacer();

  translate([175,55]) led_strap_spacer();
  translate([175,85]) led_strap_spacer();
  
  translate([185,55]) led_strap_spacer();
  translate([185,85]) led_strap_spacer();

  translate([210,100]) base_support();
  translate([210,80]) base_support();
  
  translate([210,50]) base_support_angle();
  translate([215,25]) base_support_angle();

  translate([210, 5]) backing_support();
  translate([210, -15]) backing_support();

  translate([160,0]) base_bot();
}

module realize_rpi_w_zero() {
  backing_rpi_w();
  translate([BASE_OUTER_DIAM-10,0]) base_top();
  translate([0,BASE_OUTER_DIAM-2]) base_mid();
  
  translate([80,60]) led_strap();
  translate([80,90]) led_strap();

  translate([135,50]) led_holder();
  translate([135,80]) led_holder();

  translate([155,55]) led_strap_spacer();
  translate([155,85]) led_strap_spacer();

  translate([165,55]) led_strap_spacer();
  translate([165,85]) led_strap_spacer();

  translate([175,55]) led_strap_spacer();
  translate([175,85]) led_strap_spacer();
  
  translate([185,55]) led_strap_spacer();
  translate([185,85]) led_strap_spacer();

  translate([210,100]) base_support();
  translate([210,80]) base_support();
  
  translate([210,50]) base_support_angle();
  translate([215,25]) base_support_angle();

  translate([210, 5]) backing_support();
  translate([210, -15]) backing_support();

  translate([160,0]) base_bot();

}

//realize_0();
realize_rpi_w_zero();