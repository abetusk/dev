// license: cc0

// battery 155x46
// buck converter 1: 50x53 (54 + (60-54)/2 screw separation)
// buck converter 2: 46x32 (48.5 screw separation)
// buck converter 3: 38x20
// fuse holder: 42x35 (central width 30)

FN=25;

screw_r = 3/2;

corner_r = 5;
body_w0 = 150;
body_w1 = 120;
body_h = 220;
body_h_mid = 110;

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
power_button_h = 17.25;

strap_screw_len = 58/2;
strap_r = screw_r + 4;

strap1_screw_len = 16;
strap1_r = screw_r + 4;


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


module bh_top_plate() {

  r = corner_r;
  h = body_h;
  hmid = body_h_mid;
  w0 = body_w0;
  w1 = body_w1;

  px = 40;
  py = body_h - 30;
 
  pow_w = power_plate_width - 2*r;
  pow_h = power_plate_height - 2*r;

  hole_x = pow_w/2;
  hole_y = pow_h/2;
  
  difference() {
    hull() {
      translate([  0, 0]) circle(r, $fn=FN);
      translate([ w0, 0]) circle(r, $fn=FN);
      translate([ w0, h-hmid]) circle(r, $fn=FN);
      translate([ w1, h]) circle(r, $fn=FN);
      translate([  0, h]) circle(r, $fn=FN);
      translate([  0, 0]) circle(r, $fn=FN);
    }
    
    translate([px, py]) _power_hole_lip();
    translate([px,py])
    for (i=[0:0]) {
      translate([-hole_x, hole_y]) circle(screw_r, $fn=FN);
      translate([ hole_x, hole_y]) circle(screw_r, $fn=FN);
      translate([ hole_x,-hole_y]) circle(screw_r, $fn=FN);
      translate([-hole_x,-hole_y]) circle(screw_r, $fn=FN);
    }
    
    // body screws
    //
    translate([0, 0]) circle(screw_r, $fn=FN);
    translate([w0, 0]) circle(screw_r, $fn=FN);
    translate([w0, h-hmid]) circle(screw_r, $fn=FN);
    translate([w1, h]) circle(screw_r, $fn=FN);
    translate([0, h]) circle(screw_r, $fn=FN);
    
    translate([50,50])
    for (i=[0:0]) {
      translate([0, strap_screw_len/2]) circle(screw_r/2, $fn=FN);
      translate([0, strap_screw_len/2]) circle(screw_r/2, $fn=FN);
    }
  }

}

module bh_wall_plate() {
  
  r = corner_r;
  h = body_h;
  hmid = body_h_mid;
  w0 = body_w0;
  w1 = body_w1;
  
  battery_cx = battery_w/2 + 16;
  battery_cy = battery_h/2 + 10;
  
  buck0_cx = buck0_w/2 + battery_cx + battery_w/2 +14;
  buck0_cy = buck0_h/2 + battery_cy +65;
  
  buck1_cx = buck0_cx;
  buck1_cy = buck0_cy;
  
  difference() {
    union() {
      hull() {
        translate([  0, 0]) circle(r, $fn=FN);
        translate([ w0, 0]) circle(r, $fn=FN);
      }
      
      hull() {
        translate([ w0, 0]) circle(r, $fn=FN);
        translate([ w0, h-hmid]) circle(r, $fn=FN);
      }
      
      hull() {
        translate([ w0, h-hmid]) circle(r, $fn=FN);
        translate([ w1, h]) circle(r, $fn=FN);
      }
      
      hull() {
        translate([ w1, h]) circle(r, $fn=FN);
        translate([  0, h]) circle(r, $fn=FN);
      }
      
      hull() {
        translate([  0, 0]) circle(r, $fn=FN);
        translate([  0, h/2]) circle(r, $fn=FN);
        
      }
      
      hull() {
        translate([  0, h/2 + h/4]) circle(r, $fn=FN);
        translate([0, h]) circle(r, $fn=FN);
      }
    }
  
    // body screws
    //
    translate([0, 0]) circle(screw_r, $fn=FN);
    translate([w0, 0]) circle(screw_r, $fn=FN);
    translate([w0, h-hmid]) circle(screw_r, $fn=FN);
    translate([w1, h]) circle(screw_r, $fn=FN);
    translate([0, h]) circle(screw_r, $fn=FN);
  }
}

module bh_bottom_plate() {

  r = corner_r;
  h = body_h;
  hmid = body_h_mid;
  w0 = body_w0;
  w1 = body_w1;
  
  battery_cx = battery_w/2 + 16;
  battery_cy = battery_h/2 + 10;
  
  buck0_cx = buck0_w/2 + battery_cx + battery_w/2 +14;
  buck0_cy = buck0_h/2 + battery_cy +60;
  
  buck1_cx = buck0_cx;
  buck1_cy = buck0_cy;
  
  so = 6;
  

  difference() {
    hull() {
      translate([  0, 0]) circle(r, $fn=FN);
      translate([ w0, 0]) circle(r, $fn=FN);
      translate([ w0, h-hmid]) circle(r, $fn=FN);
      translate([ w1, h]) circle(r, $fn=FN);
      translate([  0, h]) circle(r, $fn=FN);
      translate([  0, 0]) circle(r, $fn=FN);
    }

    // battery...    
    //translate([battery_cx, battery_cy]) square([battery_w, battery_h], center=true);
    translate([battery_cx - (battery_w/2 + so), battery_cy + battery_h/4])
      square([velcro_slot_w, velcro_slot_h], center=true);
    translate([battery_cx - (battery_w/2 + so), battery_cy - battery_h/4])
      square([velcro_slot_w, velcro_slot_h], center=true);
    translate([battery_cx + (battery_w/2 + so), battery_cy + battery_h/4])
      square([velcro_slot_w, velcro_slot_h], center=true);
    translate([battery_cx + (battery_w/2 + so), battery_cy - battery_h/4])
      square([velcro_slot_w, velcro_slot_h], center=true);

    // buck converters
    //translate([buck0_cx-10, buck0_cy]) square([buck0_h, buck0_w], center=true);
    translate([buck0_cx-10, buck0_cy]) translate([0,  buck0_screw_dist/2])
      circle(3/2, $fn=FN);
    translate([buck0_cx-10, buck0_cy]) translate([0, -buck0_screw_dist/2])
      circle(3/2, $fn=FN);
    
    /*
    translate([buck0_cx, buck0_cy - (buck0_h + 15)]) square([buck0_h, buck0_w], center=true);
    translate([buck0_cx, buck0_cy - (buck0_h + 15)]) translate([0, buck0_screw_dist/2])
      circle(3/2, $fn=FN);
    translate([buck0_cx, buck0_cy - (buck0_h + 15)]) translate([0, -buck0_screw_dist/2])
      circle(3/2, $fn=FN);
      */

    //translate([buck1_cx, buck1_cy - (buck0_h + 15)]) square([buck1_h, buck1_w], center=true);
    translate([buck1_cx, buck1_cy - (buck0_h + 15)]) translate([0, buck1_screw_dist/2])
      circle(3/2, $fn=FN);
    translate([buck1_cx, buck1_cy - (buck0_h + 15)]) translate([0, -buck1_screw_dist/2])
      circle(3/2, $fn=FN);

      
    //translate([buck1_cx+10, buck1_cy - 2*(buck0_h + 15)]) square([buck1_h, buck1_w], center=true);
    translate([buck1_cx+10, buck1_cy - 2*(buck0_h + 15)]) translate([0, buck1_screw_dist/2])
      circle(3/2, $fn=FN);
    translate([buck1_cx+10, buck1_cy - 2*(buck0_h + 15)]) translate([0, -buck1_screw_dist/2])
      circle(3/2, $fn=FN);


    // fuse strap
    //
    translate([battery_cx, battery_cy + battery_h/2 + 27])
      translate([0, fuse_h/2+2]) square([velcro_slot_h, velcro_slot_w], center=true);
    
    translate([battery_cx, battery_cy + battery_h/2 + 27])
      translate([0, -fuse_h/2-2]) square([velcro_slot_h, velcro_slot_w], center=true);

    // body screws
    //
    translate([0, 0]) circle(screw_r, $fn=FN);
    translate([w0, 0]) circle(screw_r, $fn=FN);
    translate([w0, h-hmid]) circle(screw_r, $fn=FN);
    translate([w1, h]) circle(screw_r, $fn=FN);
    translate([0, h]) circle(screw_r, $fn=FN);
    
  }
  
  
}

translate([-50,0]) power_plate();

bh_bottom_plate();
translate([170,0]) bh_wall_plate();
translate([0, 250]) bh_top_plate();