material_thickness = 3;

D = 91.5;
guide_notch_width = 3;
guide_notch_height = 2.5;

drive_notch_width = 13;
drive_notch_height = 13;
drive_notch_depth = 8;

pen_R = 12.2/2;
pen_inner_R = 10.66/2;

screw_R = 5/2;

band_access_w = 10;
band_access_h = 6;

//s_dist = 55 + (guide_notch_width + drive_notch_width)/2;
s_dist = 57 + (guide_notch_width + drive_notch_width)/2;
ang_drive_guide_rad = s_dist / (D/2);
ang_drive_guide = ang_drive_guide_rad * 180 / PI;

spacer_width = 30;
spacer_height= 50;
spacer_inset_width = 4;
spacer_inset_height = material_thickness;

spacer_x0 = 0;
spacer_y0 = spacer_width/2 + 6;

spacer_x1 = spacer_width/2 + 6;
spacer_y1 = 0;

spacer_x2 = -(spacer_width/2 + 6);
spacer_y2 = 0;

spacer_x3 = 0;
spacer_y3 = -(spacer_width/2 + 6);

module spacer_holes() {
  dw = spacer_width/2 - spacer_inset_width/2;
  
  // spacers
  //
  translate([spacer_x0 - dw, spacer_y0])
    square([spacer_inset_width,spacer_inset_height], center=true);
  translate([spacer_x0 + dw, spacer_y0])
    square([spacer_inset_width,spacer_inset_height], center=true);
  
  translate([spacer_x1, spacer_y1 - dw])
    square([spacer_inset_height, spacer_inset_width], center=true);
  translate([spacer_x1, spacer_y1 + dw])
    square([spacer_inset_height, spacer_inset_width], center=true);
  
  translate([spacer_x2, spacer_y2 - dw])
    square([spacer_inset_height, spacer_inset_width], center=true);
  translate([spacer_x2, spacer_y2 + dw])
    square([spacer_inset_height, spacer_inset_width], center=true);

  translate([spacer_x3 - dw, spacer_y3])
    square([spacer_inset_width,spacer_inset_height], center=true);
  translate([spacer_x3 + dw, spacer_y3])
    square([spacer_inset_width,spacer_inset_height], center=true);
}

module spacer() {
  dw = spacer_width/2 - spacer_inset_width/2;
  dh = spacer_height/2 + spacer_inset_height/2;
  
  dh2 = spacer_height/2 + 5*spacer_inset_height/2;
  union() {
    square([spacer_width, spacer_height], center=true);
    translate([-dw, dh]) square([spacer_inset_width, spacer_inset_height],center=true);
    translate([ dw, dh]) square([spacer_inset_width, spacer_inset_height],center=true);
    
    translate([ dw,-dh2]) square([spacer_inset_width, 5*spacer_inset_height],center=true);
    translate([-dw,-dh2]) square([spacer_inset_width, 5*spacer_inset_height],center=true);
  }
}

// has no notch, needed to make sure notch catches for the z-axis movement
//
module center_circle(p_R) {
  
  difference() {
    union() {
      circle(D/2, $fn=64);
      rotate(ang_drive_guide, [0,0,1])
        translate([D/2-1, 0])
        square([guide_notch_height, guide_notch_width]);
    }
    translate([D/2,0]) square([drive_notch_depth, drive_notch_width], center=true);
    circle(p_R);
    translate([ D/3, 0]) circle(screw_R, $fn=16);
    translate([-D/3, 0]) circle(screw_R, $fn=16);
    translate([0, -D/3]) circle(screw_R, $fn=16);
    translate([0,  D/3]) circle(screw_R, $fn=16);
    translate([p_R + 5, 0]) square([band_access_h,band_access_w], center=true);
    translate([-(p_R + 5), 0]) square([band_access_h,band_access_w], center=true);
    
    // spacers
    //
    spacer_holes();

  }
  
}


// with notch
//
module outer_circle(p_R) {
  union() {
    difference() {
      union() {
        circle(D/2, $fn=64);
        rotate(ang_drive_guide, [0,0,1])
          translate([D/2-1, 0])
          square([guide_notch_height, guide_notch_width]);
        
      }
      circle(p_R);
      translate([ D/3, 0]) circle(screw_R, $fn=16);
      translate([-D/3, 0]) circle(screw_R, $fn=16);
      translate([0, -D/3]) circle(screw_R, $fn=16);
      translate([0,  D/3]) circle(screw_R, $fn=16);
      
      translate([p_R + 5, 0]) square([band_access_h, band_access_w], center=true);
      translate([-(p_R + 5), 0]) square([band_access_h, band_access_w], center=true);

      spacer_holes();
    }
    
    translate([p_R + 5, 0]) square([2.5, 6], center=true);
    translate([p_R + 5 - band_access_h/4, 0]) square([band_access_h/2, 4], center=true);
    translate([-(p_R + 5), 0]) square([2.5, 6], center=true);
    translate([-(p_R + 5 - band_access_h/4), 0]) square([band_access_h/2, 4], center=true);

  }

}

module all() {
  top_x = 95/2;
  dy = 14;
  
  translate([0,0])   center_circle(pen_R);
  translate([95,0])  center_circle(pen_R);
  translate([2*95,0]) outer_circle(pen_R);
  
  translate([top_x,95-dy]) center_circle(pen_R);
  translate([top_x + 95,95-dy]) outer_circle(pen_R);
  translate([top_x + 2*95,95-dy]) outer_circle(pen_R);
  
  translate([-20,90]) spacer();
  translate([3*95 - 30,0]) spacer();

}

module part_0() {
  translate([0,0])   center_circle(pen_R);
  translate([95,0])  center_circle(pen_R);

  translate([2*95,0]) center_circle(pen_R);

  translate([0,70]) rotate(90, [0,0,1]) spacer();
  translate([95+15,70]) rotate(90, [0,0,1]) spacer();

}

module part_1() {
  translate([0,0]) outer_circle(pen_R);

  translate([95,0]) outer_circle(pen_R);
  translate([2*95,0]) outer_circle(pen_R);

  translate([0,70]) rotate(90, [0,0,1]) spacer();
  translate([95+15,70]) rotate(90, [0,0,1]) spacer();

}


translate([96/2,96/2]) part_0();
//translate([96/2,96/2]) part_1();

//all();