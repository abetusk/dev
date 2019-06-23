// LICENSE: CC0
//

// units are in mm
//

FN=25;

screw_r = 3/2;

encoder_hole_diam = 7;

corner_r = 5;

// 31 19
encoder_dist = 25;

encoder_plate_corner_r = corner_r;
encoder_plate_width = 56;
encoder_plate_height = 34;

encoder_plate_upper_width = encoder_plate_width - 4*encoder_plate_corner_r;
encoder_plate_upper_height = encoder_plate_height - 4*encoder_plate_corner_r;

body_corner_r = corner_r;
body_w0 = 92;
body_w1 = 62;
body_h = 142;
body_h_mid = 67;

access_w = 30;
access_h = 28;



rpi_screw_r = 2.5/2;  
rpi_screw_w = 23.25;
rpi_screw_h = 58;
  
strap_screw_len = rpi_screw_h/2;
strap_r = screw_r + 4;


module rpi_cable_strap() {
  
  difference() {
    hull() {
      circle(strap_r, $fn=FN);
      translate([0, strap_screw_len]) circle(strap_r, $fn=FN);
    }
    circle(screw_r, $fn=FN);
    translate([0, strap_screw_len]) circle(screw_r, $fn=FN);
  }
  
}

module body_wall_access_plate() {
  r = body_corner_r;
  w0 = body_w0 - 2*r;
  w1 = body_w1 - 2*r;
  h = body_h - 2*r;
  hmid = body_h_mid;
  
  in0 = 2*r;
  inh = h-2*r;
  inw0 = w0-2*r;
  inw1 = w1- r;  //??
  inhmid = hmid-2*r;
  
  aw = access_w - 2*r;
  ah = access_h - 2*r;
  x_access = w0/2;

  difference() {
    union() {
        
      hull() {
        translate([  0, h]) circle(r, $fn=FN);
        translate([  x_access-aw, h]) circle(r, $fn=FN);
      }
      hull() {
        translate([  x_access-aw, h]) circle(r, $fn=FN);
        translate([  x_access-aw, h-ah]) circle(r, $fn=FN);
      }
      hull() {
        translate([  x_access-aw, h-ah]) circle(r, $fn=FN);
        translate([ x_access+aw, h-ah]) circle(r, $fn=FN);
      }
      hull() {
        translate([ x_access+aw, h-ah]) circle(r, $fn=FN);
        translate([ x_access+aw, h]) circle(r, $fn=FN);
      }
      hull() {
        translate([ x_access+aw, h]) circle(r, $fn=FN);
        translate([ w0, h]) circle(r, $fn=FN);
      }
      
      
      hull() {
        translate([ w0, h]) circle(r, $fn=FN);
        translate([ w0, h-hmid]) circle(r, $fn=FN);
      }
      hull() {
        translate([ w0, h-hmid]) circle(r, $fn=FN);
        translate([ w1, 0]) circle(r, $fn=FN);
      }
      hull() {
        translate([ w1, 0]) circle(r, $fn=FN);
        translate([  0, 0]) circle(r, $fn=FN);
      }
      hull() {
        translate([  0, 0]) circle(r, $fn=FN);
        translate([  0, h]) circle(r, $fn=FN);
      }
    }

    translate([0, h]) circle(screw_r, $fn=FN);
    translate([w0, h]) circle(screw_r, $fn=FN);
    translate([w0, h-hmid]) circle(screw_r, $fn=FN);
    translate([w1, 0]) circle(screw_r, $fn=FN);
    translate([0,0]) circle(screw_r, $fn=FN);
  } 
}


module body_wall_plate() {
    
  r = body_corner_r;
  w0 = body_w0 - 2*r;
  w1 = body_w1 - 2*r;
  h = body_h - 2*r;
  hmid = body_h_mid;
  
  in0 = 2*r;
  inh = h-2*r;
  inw0 = w0-2*r;
  inw1 = w1- r;  //??
  inhmid = hmid-2*r;
  
  difference() {
    
    union() {
            
      hull() {
        translate([  0, h]) circle(r, $fn=FN);
        translate([ w0, h]) circle(r, $fn=FN);
      }
      
      hull() {
        translate([ w0, h]) circle(r, $fn=FN);
        translate([ w0, h-hmid]) circle(r, $fn=FN);
      }
      hull() {
        translate([ w0, h-hmid]) circle(r, $fn=FN);
        translate([ w1, 0]) circle(r, $fn=FN);
      }
      hull() {
        translate([ w1, 0]) circle(r, $fn=FN);
        translate([  0, 0]) circle(r, $fn=FN);
      }
      hull() {
        translate([  0, 0]) circle(r, $fn=FN);
        translate([  0, h]) circle(r, $fn=FN);
      }
    }
    
    // joining screws
    
    translate([0, h]) circle(screw_r, $fn=FN);
    translate([w0, h]) circle(screw_r, $fn=FN);
    translate([w0, h-hmid]) circle(screw_r, $fn=FN);
    translate([w1, 0]) circle(screw_r, $fn=FN);
    translate([0,0]) circle(screw_r, $fn=FN);
  }
}


module _encoder_hole_lip() {
  r = encoder_plate_corner_r;
  w = encoder_plate_width - 2*r;
  h = encoder_plate_height - 2*r;
  
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

module body_top_plate() {
   
  r = body_corner_r;
  w0 = body_w0 - 2*r;
  w1 = body_w1 - 2*r;
  h = body_h - 2*r;
  hmid = body_h_mid;

  enc_r = encoder_plate_corner_r;
  enc_w = encoder_plate_width - 2*enc_r;
  enc_h = encoder_plate_height - 2*enc_r;
  
  lip_cx = w1/2;
  lip_cy = (h-hmid)/2 + 5;
  
  hole_x = enc_w/2;
  hole_y = enc_h/2;

  strap_cx = w0/2 + 10;
  strap_cy = h - 20;

  difference() {
    hull() {
      translate([  0, h]) circle(r, $fn=FN);
      translate([ w0, h]) circle(r, $fn=FN);
      translate([ w0, h-hmid]) circle(r, $fn=FN);
      translate([ w1, 0]) circle(r, $fn=FN);
      translate([  0, 0]) circle(r, $fn=FN);
      
    }

    // housing plate screw fastners
    //
    translate([0, h]) circle(screw_r, $fn=FN);
    translate([w0, h]) circle(screw_r, $fn=FN);
    translate([w0, h-hmid]) circle(screw_r, $fn=FN);
    translate([w1, 0]) circle(screw_r, $fn=FN);
    translate([0,0]) circle(screw_r, $fn=FN);

    // encoder lip
    //
    translate([lip_cx, lip_cy]) rotate(90, [0,0,1])
    for (i=[0:0]) {
      _encoder_hole_lip();
      translate([-hole_x, hole_y]) circle(screw_r, $fn=FN);
      translate([ hole_x, hole_y]) circle(screw_r, $fn=FN);
      translate([ hole_x,-hole_y]) circle(screw_r, $fn=FN);
      translate([-hole_x,-hole_y]) circle(screw_r, $fn=FN);
    }

    translate([strap_cx - strap_screw_len/2, strap_cy]) circle(screw_r, $fn=FN);
    translate([strap_cx + strap_screw_len/2, strap_cy]) circle(screw_r, $fn=FN);

  }
}

module body_bottom_plate() {
  
  r = body_corner_r;
  w0 = body_w0 - 2*r;
  w1 = body_w1 - 2*r;
  h = body_h - 2*r;
  hmid = body_h_mid;

  
  rpi_cx = w0/2;
  rpi_cy = h - hmid + rpi_screw_w;

  
  difference() {
    hull() {
      translate([  0, h]) circle(r, $fn=FN);
      translate([ w0, h]) circle(r, $fn=FN);
      translate([ w0, h-hmid]) circle(r, $fn=FN);
      translate([ w1, 0]) circle(r, $fn=FN);
      translate([  0, 0]) circle(r, $fn=FN);
      
    }
    
    // housing screws
    //
    translate([0, h]) circle(screw_r, $fn=FN);
    translate([w0, h]) circle(screw_r, $fn=FN);
    translate([w0, h-hmid]) circle(screw_r, $fn=FN);
    translate([w1, 0]) circle(screw_r, $fn=FN);
    translate([0,0]) circle(screw_r, $fn=FN);
    
    
    // rpi screws
    //
    translate([rpi_cx, rpi_cy])
    for (i=[0:0]) {
      translate([-rpi_screw_h/2, rpi_screw_w/2]) circle(rpi_screw_r, $fn=FN);
      translate([ rpi_screw_h/2, rpi_screw_w/2]) circle(rpi_screw_r, $fn=FN);
      translate([ rpi_screw_h/2,-rpi_screw_w/2]) circle(rpi_screw_r, $fn=FN);
      translate([-rpi_screw_h/2,-rpi_screw_w/2]) circle(rpi_screw_r, $fn=FN);
    }
    
    // strap screws
    translate([rpi_cx, rpi_cy])
    for (i=[0:0]) {
      translate([-rpi_screw_h/2,rpi_screw_w/2 + 18]) circle(screw_r, $fn=FN);
      translate([-rpi_screw_h/2 + strap_screw_len,rpi_screw_w/2 + 18]) circle(screw_r, $fn=FN);
    }
    
  }
}

module encoder_plate() {
  
  r = encoder_plate_corner_r;
  w = encoder_plate_width - 2*r;
  h = encoder_plate_height - 2*r;
  
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
    
    translate([-encoder_dist/2, 0]) circle(encoder_hole_diam/2, $fn=FN);
    translate([ encoder_dist/2, 0]) circle(encoder_hole_diam/2, $fn=FN);
    
    translate([-hole_x, hole_y]) circle(screw_r, $fn=FN);
    translate([ hole_x, hole_y]) circle(screw_r, $fn=FN);
    translate([ hole_x,-hole_y]) circle(screw_r, $fn=FN);
    translate([-hole_x,-hole_y]) circle(screw_r, $fn=FN);
    
    //_encoder_hole_lip();
  }
}

module pack_for_cut_a() {
  translate([140,0]) rotate(90, [0,0,1]) body_bottom_plate();
  translate([285,0]) rotate(90, [0,0,1]) body_top_plate();
  translate([140,95]) rotate(90, [0,0,1]) body_wall_plate();
  //translate([285,95]) rotate(90, [0,0,1]) body_wall_plate();
  translate([285,95]) rotate(90, [0,0,1]) body_wall_access_plate();
//  translate([305,0]) body_wall_access_plate();
  translate([70, 130]) encoder_plate();
  translate([185, 130]) rpi_cable_strap();
  translate([198, 130]) rpi_cable_strap();
  translate([210, 130]) rpi_cable_strap();
  translate([225, 130]) rpi_cable_strap();
}

module pack_for_cut_b() {
  translate([140,0]) rotate(90, [0,0,1]) body_wall_plate();
  translate([285,0]) rotate(90, [0,0,1]) body_wall_plate();
  translate([140,95]) rotate(90, [0,0,1]) body_wall_plate();
  translate([285,95]) rotate(90, [0,0,1]) body_wall_access_plate();
  translate([70, 130]) encoder_plate();
}

pack_for_cut_a();
//pack_for_cut_b();

//body_wall_access_plate();

/*
module __debug() {
  encoder_plate();
  translate([40,-60]) body_bottom_plate();
  translate([160, -60]) body_top_plate();
  translate([0, 100]) body_wall_plate();
  translate([100,100]) body_wall_access_plate();
}
*/