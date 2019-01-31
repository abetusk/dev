

HOLE_DIAM = 2;
BACKING_SCREW_dW = 49;
BACKING_SCREW_dH = 58;
BACKING_BORDER_R = 4;

THICKNESS = 3;

USB_WIRE_D = 6;

backing_h = BACKING_SCREW_dH + 2*BACKING_BORDER_R;
backing_w = BACKING_SCREW_dW + 2*BACKING_BORDER_R;

bot_support_l = BACKING_SCREW_dH/3;
bot_support_dw = backing_w / 1;

support_w = 20;
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
  difference() {
    hull() {
      translate([-BACKING_SCREW_dW/2, BACKING_SCREW_dH/2]) circle(BACKING_BORDER_R, $fn=FN);
      translate([ BACKING_SCREW_dW/2, BACKING_SCREW_dH/2]) circle(BACKING_BORDER_R, $fn=FN);
      translate([ BACKING_SCREW_dW/2,-BACKING_SCREW_dH/2]) circle(BACKING_BORDER_R, $fn=FN);
      translate([-BACKING_SCREW_dW/2,-BACKING_SCREW_dH/2]) circle(BACKING_BORDER_R, $fn=FN);
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
  
  /*
  union() {
//    intersection() {
      
      union() {
      //  rotate(a, [0,0,1]) square([base_support_mid_w, base_support_mid_h]);
        //translate([0, (base_support_mid_h+THICKNESS)/2,0]) rotate(a, [0,0,1]) square([bot_support_l, THICKNESS], center=true);
      };
      
      union() {
        square([base_support_mid_w, base_support_mid_h]);
        //translate([0,-(base_support_mid_h+THICKNESS)/2,0]) square([bot_support_l, THICKNESS], center=true);
      };
//    };

    //rotate(a, [0,0,1])    translate([0, (base_support_mid_h+THICKNESS)/2,0])      square([bot_support_l, THICKNESS], center=true);
      
    translate([base_support_mid_w/2, base_support_mid_h+THICKNESS/2])
      square([bot_support_l, THICKNESS], center=true);
  };
  */
}

module realize_0()  {
  backing();
  translate([BASE_OUTER_DIAM,0]) base_top();
  translate([0,BASE_OUTER_DIAM]) base_mid();
  
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
  translate([245,50]) base_support_angle();

  translate([240, 100]) backing_support();
  translate([240, 80]) backing_support();

  translate([180,0]) base_bot();
}

realize_0();