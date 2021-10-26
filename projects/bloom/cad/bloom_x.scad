// Licnese: CC0
//

$fn=32;

od_r = 6/2;
id_r = 2/2;

d_0 = 25;
d_link_0 = d_0/2;
w_0 = od_r + 4;

m2_r = 2/1;
arm_w = m2_r + 8;

//horn_r = 6/3;
horn_r = 5.75/3;
//horn_w = 3.25;
horn_w = 3.15;
horn_l = 16.25;

module horn_single() {
  
  union() {
    circle(horn_r);
    hull() {
      circle(horn_w/2);
      translate([horn_l - horn_r - horn_w/2,0]) circle(horn_w/2);
    };
  };
  
}

module scissor_base_servo() {

  difference() {
    union() {
      circle(w_0);
      translate([d_link_0/2,0]) square([d_link_0,arm_w], center=true);
      //translate([d_link_0,0]) circle(w_0);
      translate([1.5*d_link_0,0]) square([d_link_0,arm_w], center=true);
      translate([2*d_link_0,0]) circle(w_0);
    };

    horn_single();
    //translate([d_link_0,0]) circle(od_r);
    translate([2*d_link_0,0]) circle(od_r);
    
    //translate([d_link_0/2,0]) circle(m2_r);
    //translate([3*d_link_0/2,0]) circle(m2_r);

    
  }

}

module scissor_base_inner() {
  
  difference() {
    union() {
      circle(w_0);
      translate([d_link_0/2,0]) square([d_link_0,arm_w], center=true);
      //translate([d_link_0,0]) circle(w_0);
      translate([1.5*d_link_0,0]) square([d_link_0,arm_w], center=true);
      translate([2*d_link_0,0]) circle(w_0);
    };
    
    circle(od_r);
    //translate([d_link_0,0]) circle(od_r);
    translate([2*d_link_0,0]) circle(od_r);
    
    //translate([d_link_0/2,0]) circle(m2_r);
    //translate([3*d_link_0/2,0]) circle(m2_r);

    
  }
  
}

//translate([0,10]) horn_single();
scissor_base_inner();
translate([0,-15]) scissor_base_servo();