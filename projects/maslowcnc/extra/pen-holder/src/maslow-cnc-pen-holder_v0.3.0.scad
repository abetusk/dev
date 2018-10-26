material_thickness = 3;

adapter_hole_d = .25*25.4;

plate_d = 60;

pen_R = 15/2;

band_access_w = 10;
band_access_h = 6;

spacer_width = 30;
spacer_height= 40/2;
spacer_inset_width = 2*material_thickness;
spacer_inset_height = material_thickness;

rubber_band_w = 12;
rubber_band_h = 10;

cable_tie_w = 5;
cable_tie_h = 4;

cable_tie_dx = 10;
cable_tie_dy = 15;

module adapter_plate() {
  difference() {
    circle(plate_d/2);
    circle(adapter_hole_d/2);
    rotate(60, [0,0,1]) translate([0,15*plate_d/(2*20)])
     square([spacer_inset_width, spacer_inset_height], center=true);
    rotate(-60, [0,0,1]) translate([0,15*plate_d/(2*20)])
     square([spacer_inset_width, spacer_inset_height], center=true);
    rotate(180, [0,0,1]) translate([0,15*plate_d/(2*20)])
     square([spacer_inset_width, spacer_inset_height], center=true);
    
       
    translate([-cable_tie_dx, cable_tie_dy]) square([cable_tie_h, cable_tie_w], center=true);
    translate([ cable_tie_dx, cable_tie_dy]) square([cable_tie_h, cable_tie_w], center=true);
    
    translate([-cable_tie_dx,-cable_tie_dy]) square([cable_tie_h, cable_tie_w], center=true);
    translate([ cable_tie_dx,-cable_tie_dy]) square([cable_tie_h, cable_tie_w], center=true);
  }
}

module rubber_band_plate() {
  rbf=1.5;
  
  union() {
    difference() {
      circle(plate_d/2);
      circle(pen_R);
      rotate(60, [0,0,1]) translate([0,15*plate_d/(2*20)])
       square([spacer_inset_width, spacer_inset_height], center=true);
      rotate(-60, [0,0,1]) translate([0,15*plate_d/(2*20)])
       square([spacer_inset_width, spacer_inset_height], center=true);
      rotate(180, [0,0,1]) translate([0,15*plate_d/(2*20)])
       square([spacer_inset_width, spacer_inset_height], center=true);
     
      // rubber band openings
      //
      translate([-(plate_d/2 - rubber_band_h*rbf), 0]) square([rubber_band_h, rubber_band_w], center=true); 
      translate([ (plate_d/2 - rubber_band_h*rbf), 0]) square([rubber_band_h, rubber_band_w], center=true); 
      
      
      translate([-cable_tie_dx, cable_tie_dy]) square([cable_tie_h, cable_tie_w], center=true);
      translate([ cable_tie_dx, cable_tie_dy]) square([cable_tie_h, cable_tie_w], center=true);
      
      translate([-cable_tie_dx,-cable_tie_dy]) square([cable_tie_h, cable_tie_w], center=true);
      translate([ cable_tie_dx,-cable_tie_dy]) square([cable_tie_h, cable_tie_w], center=true);
      
    }
    
    translate([-(plate_d/2 - rubber_band_h*rbf),0]) square([rubber_band_h/4, rubber_band_w/2], center=true);
    translate([-(plate_d/2 - rubber_band_h*rbf - rubber_band_h/4),0])
      square([rubber_band_h/2, rubber_band_w/4], center=true);
    translate([ (plate_d/2 - rubber_band_h*rbf),0]) square([rubber_band_h/4, rubber_band_w/2], center=true);
    translate([ (plate_d/2 - rubber_band_h*rbf - rubber_band_h/4),0])
      square([rubber_band_h/2, rubber_band_w/4], center=true);
  }
}

module spacer_plate() {
  rbf=1.5;

  difference() {
    circle(plate_d/2);
    circle(pen_R);
    rotate(60, [0,0,1]) translate([0,15*plate_d/(2*20)])
     square([spacer_inset_width, spacer_inset_height], center=true);
    rotate(-60, [0,0,1]) translate([0,15*plate_d/(2*20)])
     square([spacer_inset_width, spacer_inset_height], center=true);
    rotate(180, [0,0,1]) translate([0,15*plate_d/(2*20)])
     square([spacer_inset_width, spacer_inset_height], center=true);
   
    // rubber band openings
    //
    translate([-(plate_d/2 - rubber_band_h*rbf), 0]) square([rubber_band_h, rubber_band_w], center=true); 
    translate([ (plate_d/2 - rubber_band_h*rbf), 0]) square([rubber_band_h, rubber_band_w], center=true); 
    
    
    translate([-cable_tie_dx, cable_tie_dy]) square([cable_tie_h, cable_tie_w], center=true);
    translate([ cable_tie_dx, cable_tie_dy]) square([cable_tie_h, cable_tie_w], center=true);
    
    translate([-cable_tie_dx,-cable_tie_dy]) square([cable_tie_h, cable_tie_w], center=true);
    translate([ cable_tie_dx,-cable_tie_dy]) square([cable_tie_h, cable_tie_w], center=true);
    
  }
}

module vertical_separato_double(n=3,m=1) {
  z = material_thickness*n;
  v = material_thickness*m;
  
  union() {
    
    square([spacer_width, spacer_height], center=true);
    
    translate([(spacer_width/2 - spacer_inset_width/2), spacer_height/2 + z/2])
      square([spacer_inset_width, z], center=true);
    translate([-(spacer_width/2 - spacer_inset_width/2), spacer_height/2 + z/2])
      square([spacer_inset_width, z], center=true);
    
    translate([(spacer_width/2 - spacer_inset_width/2), -spacer_height/2 - v/2])
      square([spacer_inset_width, v], center=true);
    translate([-(spacer_width/2 - spacer_inset_width/2), -spacer_height/2 - v/2])
      square([spacer_inset_width, v], center=true);
    
  }
}

module vertical_separator(n=3,m=1) {
  z = material_thickness*n;
  v = material_thickness*m;
  
  union() {
    
    square([spacer_width, spacer_height], center=true);
    
    translate([(0), spacer_height/2 + z/2])
      square([spacer_inset_width, z], center=true);
    
    translate([(0), -spacer_height/2 - v/2])
      square([spacer_inset_width, v], center=true);    
  }
}

module all() {
  dx = plate_d + 2;
  dy = plate_d + 2;
  adapter_plate();
  translate([dx,0]) rubber_band_plate();
  translate([0, dy]) spacer_plate();
  translate([dx, dy]) spacer_plate();
  translate([dx+50, 0]) vertical_separator();
  translate([dx+85, 0]) vertical_separator();
  translate([dx+70, 55])  rotate(90, [0,0,1]) vertical_separator();
}

translate([plate_d/2, plate_d/2]) all();
