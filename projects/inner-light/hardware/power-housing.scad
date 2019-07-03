// license: cc0


// battery 155x46
// buck converter 1: 50x53 (54 + (60-54)/2 screw separation)
// buck converter 2: 46x32 (48.5 screw separation)
// buck converter 3: 38x20
// fuse holder: 42x35 (central width 30)

FN=25;

screw_r = 3/2;

corner_r = 5;
bat_body_w0 = 150;
bat_body_w1 = 120;
bat_body_h = 180;
bat_body_h_mid = 110;

battery_h = 155;
battery_w = 46;

velcro_slot_w = 3;
velcro_slot_h = 15;

buck0_w = 50;
buck0_h = 53;
buck0_screw_dist = 57;

buck1_w = 46;
buck1_h = 32;
buck1_screw_dist = 52;

fuse_w = 42;
fuse_h = 35;
fuse_w1 = 30;

power_plate_corner_r = corner_r;
power_plate_width = 56;
power_plate_height = 34;

power_button_w = 11.75;
power_button_h = 18.5;

strap_screw_len = 58/2;
strap_r = screw_r + 4;

strap1_screw_len = 16;
strap1_r = screw_r + 4;

module strap() {
  difference() {
    hull() {
      translate([-strap_screw_len/2,0]) circle(strap_r, $fn=FN);
      translate([ strap_screw_len/2,0]) circle(strap_r, $fn=FN);
    }
    translate([-strap_screw_len/2,0]) circle(screw_r, $fn=FN);
    translate([ strap_screw_len/2,0]) circle(screw_r, $fn=FN);
  }
}

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


module bat_spacer_plate() {
  
  r = corner_r;
  
  w = bat_body_w0;
  w1 = bat_body_w1;
  h = bat_body_h;
  hmid = bat_body_h_mid;

  buck0_cx = buck0_w/2 + battery_w/2 +14;
  buck0_cy = buck0_h/2 + 60;

  buck1_cx = buck0_cx;
  buck1_cy = buck0_cy;
  
  buck0_cx = w/4+ 16;
  buck0_cy = h/4;
  
  buck1_cx = w/4 + 16;
  buck1_cy = 3*h/4 ;
  
  buck2_cx = 3*w/4 - 10;
  buck2_cy = h/2  + 5;

  hole_x = power_plate_width/2;
  hole_y = power_plate_height/2;


  difference() {
    union() {
      hull() {
        translate([0,0]) circle(r, $fn=FN);
        translate([w,0]) circle(r, $fn=FN);
      }
      hull() {
        translate([w,0]) circle(r, $fn=FN);
        translate([w, hmid]) circle(r, $fn=FN);
      }
      hull() {
        translate([w, hmid]) circle(r, $fn=FN);
        translate([w1, h]) circle(r, $fn=FN);
      }
      hull() {
        translate([w1, h]) circle(r, $fn=FN);
        translate([0,h]) circle(r, $fn=FN);
      }
      hull() {
        translate([0,h/4]) circle(r, $fn=FN);
        translate([0,h]) circle(r, $fn=FN);
      }
    }
    
    // plate screws
    //
    translate([0,0]) circle(screw_r, $fn=FN);
    translate([w,0]) circle(screw_r, $fn=FN);
    translate([w, hmid]) circle(screw_r, $fn=FN);
    translate([w1, h]) circle(screw_r, $fn=FN);
    translate([0,h]) circle(screw_r, $fn=FN);
    translate([0,h/4]) circle(screw_r, $fn=FN);
  }
}

module bat_top_plate() {
  
  r = corner_r;
  
  w = bat_body_w0;
  w1 = bat_body_w1;
  h = bat_body_h;
  hmid = bat_body_h_mid;

  buck0_cx = buck0_w/2 + battery_w/2 +14;
  buck0_cy = buck0_h/2 + 60;

  buck1_cx = buck0_cx;
  buck1_cy = buck0_cy;
  
  buck0_cx = w/4+ 16;
  buck0_cy = h/4;
  
  buck1_cx = w/4 + 16;
  buck1_cy = 3*h/4 ;
  
  buck2_cx = 3*w/4 - 10;
  buck2_cy = h/2  + 5;

  pw = power_plate_width - 2*r;
  ph = power_plate_height - 2*r;
  hole_x = pw/2;
  hole_y = ph/2;


  difference() {
    hull() {
      translate([0,0]) circle(r, $fn=FN);
      translate([w,0]) circle(r, $fn=FN);
      translate([w, hmid]) circle(r, $fn=FN);
      translate([w1, h]) circle(r, $fn=FN);
      translate([0,h]) circle(r, $fn=FN);
    }
    
    // power button insert
    //
    translate([w/4 + 10, h/2])
    for (i=[0:0]) {
      _power_hole_lip();
      translate([-hole_x, hole_y]) circle(screw_r, $fn=FN);
      translate([ hole_x, hole_y]) circle(screw_r, $fn=FN);
      translate([ hole_x,-hole_y]) circle(screw_r, $fn=FN);
      translate([-hole_x,-hole_y]) circle(screw_r, $fn=FN);
    }
    
    // stress relief strap screws
    //
    translate([4*r, strap_screw_len/2 + 2*r]) for (i=[0:0]) {
      translate([0,strap_screw_len/2]) circle(screw_r, $fn=FN);
      translate([0,-strap_screw_len/2]) circle(screw_r, $fn=FN);
    }

    // plate screws
    //
    translate([0,0]) circle(screw_r, $fn=FN);
    translate([w,0]) circle(screw_r, $fn=FN);
    translate([w, hmid]) circle(screw_r, $fn=FN);
    translate([w1, h]) circle(screw_r, $fn=FN);
    translate([0,h]) circle(screw_r, $fn=FN);
    translate([0,h/4]) circle(screw_r, $fn=FN);
    
    // battery velcro strap slots
    //
    translate([2*r, h/2 + battery_h/4]) square([velcro_slot_w, velcro_slot_h], center=true);
    translate([2*r, h/2 - battery_h/4]) square([velcro_slot_w, velcro_slot_h], center=true);
  }
}

module bat_bottom_plate() {
  
  r = corner_r;
  
  w = bat_body_w0;
  w1 = bat_body_w1;
  h = bat_body_h;
  hmid = bat_body_h_mid;

  buck0_cx = buck0_w/2 + battery_w/2 +14;
  buck0_cy = buck0_h/2 + 60;

  buck1_cx = buck0_cx;
  buck1_cy = buck0_cy;
  
  buck0_cx = w/4+ 16;
  buck0_cy = h/4;
  
  buck1_cx = w/4 + 16;
  buck1_cy = 3*h/4 ;
  
  buck2_cx = 3*w/4 - 10;
  buck2_cy = h/2  + 5;

  difference() {
    hull() {
      translate([0,0]) circle(r, $fn=FN);
      translate([w,0]) circle(r, $fn=FN);
      translate([w, hmid]) circle(r, $fn=FN);
      translate([w1, h]) circle(r, $fn=FN);
      translate([0,h]) circle(r, $fn=FN);
    }

    // buck converters
    //
//    translate([buck0_cx, buck0_cy]) square([buck0_w, buck0_h], center=true);
    translate([buck0_cx, buck0_cy])
      for (i=[0:0]) {
        translate([buck0_screw_dist/2, 0]) circle(3/2, $fn=FN);
        translate([-buck0_screw_dist/2, 0]) circle(3/2, $fn=FN);
      }
    translate([buck0_cx - 20, buck0_cy + 50])
      square([velcro_slot_w, velcro_slot_h], center=true);
    translate([buck0_cx + 10, buck0_cy + 50])
      square([velcro_slot_w, velcro_slot_h], center=true);


//    translate([buck1_cx, buck1_cy]) square([buck1_w, buck1_h], center=true);
    translate([buck1_cx, buck1_cy])
      for (i=[0:0]) {
        translate([ buck1_screw_dist/2, 0]) circle(3/2, $fn=FN);
        translate([-buck1_screw_dist/2, 0]) circle(3/2, $fn=FN);
      }
    translate([buck1_cx - 20, buck1_cy + 28])
      square([velcro_slot_w, velcro_slot_h], center=true);
    translate([buck1_cx + 20, buck1_cy + 28])
      square([velcro_slot_w, velcro_slot_h], center=true);

//    translate([buck2_cx, buck2_cy]) square([buck1_w, buck1_h], center=true);
    translate([buck2_cx, buck2_cy])
      for (i=[0:0]) {
        translate([ buck1_screw_dist/2, 0]) circle(3/2, $fn=FN);
        translate([-buck1_screw_dist/2, 0]) circle(3/2, $fn=FN);
      }
    translate([buck2_cx - 10, buck2_cy + 28])
      square([velcro_slot_w, velcro_slot_h], center=true);
    translate([buck2_cx + 20, buck2_cy + 28])
      square([velcro_slot_w, velcro_slot_h], center=true);

    // some extra velcro srap locations
    //
    translate([buck2_cx - 10, buck2_cy + 58])
      square([velcro_slot_w, velcro_slot_h], center=true);
    translate([buck2_cx + 10, buck2_cy + 58])
      square([velcro_slot_w, velcro_slot_h], center=true);

    translate([3*w/4, h/4 + 20]) square([velcro_slot_h, velcro_slot_w], center=true);
    translate([3*w/4, h/4 - 20]) square([velcro_slot_h, velcro_slot_w], center=true);
    
    // battery velcro strap slots
    //
    translate([2*r, h/2 + battery_h/4]) square([velcro_slot_w, velcro_slot_h], center=true);
    translate([2*r, h/2 - battery_h/4]) square([velcro_slot_w, velcro_slot_h], center=true);
    
    // plate screws
    //
    translate([0,0]) circle(screw_r, $fn=FN);
    translate([w,0]) circle(screw_r, $fn=FN);
    translate([w, hmid]) circle(screw_r, $fn=FN);
    translate([w1, h]) circle(screw_r, $fn=FN);
    translate([0,h]) circle(screw_r, $fn=FN);
    translate([0,h/4]) circle(screw_r, $fn=FN);
  }
}

module realize0() {

  translate([190,10]) rotate(90, [0,0,1]) bat_bottom_plate();
  
  //translate([160,0]) bat_top_plate();
  //translate([400,0]) bat_spacer_plate();
  //translate([335,100]) rotate(90,[0,0,1]) power_spacer();
  //translate([335,25]) rotate(90,[0,0,1]) power_plate();
}

module realize1() {

  translate([190,10]) rotate(90, [0,0,1]) bat_top_plate();
  
  //translate([160,0]) bat_top_plate();
  //translate([400,0]) bat_spacer_plate();
  //translate([335,100]) rotate(90,[0,0,1]) power_spacer();
  //translate([335,25]) rotate(90,[0,0,1]) power_plate();
}


module realize2() {
  translate([190,10]) rotate(90,[0,0,1]) bat_spacer_plate();
  //translate([160,0]) bat_spacer_plate();
  translate([40,50]) strap();
  translate([40,70]) strap();
  translate([40,90]) strap();
  translate([90,100]) rotate(90,[0,0,1]) power_spacer();
  translate([130,55]) rotate(90,[0,0,1]) power_plate();
}

//realize0();
//realize1();
realize2();

