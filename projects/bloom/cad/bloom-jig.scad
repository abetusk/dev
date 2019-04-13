// bloom jig
// licensed under CC0
//

FN=20;
SCREW_R = 1;
INNER_R = 10/2;
OUTER_R = 20/2;

module square_form0() {
  r = INNER_R;
  screw_r = SCREW_R;
  screw_ds = 3*SCREW_R;
  
  difference() {
    square([2*r,2*r], center=true);
    circle(screw_r, $fn=FN);
    rotate(0.0, [0,0,1]) translate([screw_ds,0]) circle(screw_r, $fn=FN);
    rotate(90.0, [0,0,1]) translate([screw_ds,0]) circle(screw_r, $fn=FN);
    
  };
}

module square_form1() {
  r = INNER_R + 2;
  screw_r = SCREW_R;
  screw_ds = 3*SCREW_R;
  
  difference() {
    square([2*r,2*r], center=true);
    circle(screw_r, $fn=FN);
    rotate(0.0, [0,0,1]) translate([screw_ds,0]) circle(screw_r, $fn=FN);
    rotate(90.0, [0,0,1]) translate([screw_ds,0]) circle(screw_r, $fn=FN);
    
    rotate(45.0, [0,0,1]) translate([0,2*r]) square([2*r, 2*r], center=true);
    
  };
}



module outer_top_plate() {
  r = OUTER_R;
  ds = tan(45.0/2)*r;
  h=3;
  screw_r = SCREW_R;
  screw_ds = screw_r + 5;
  
  difference() {
    union() {
      polygon([ [r,ds], [r,-ds], [ds,-r], [-ds,-r], [-r,-ds], [-r,ds], [-ds,r], [ds,r] ]);
      translate([0,r+h/2]) square( [2*ds, h], center=true);
      translate([0,-(r+h/2)]) square( [2*ds, h], center=true);
      translate([-(r+h/2),0]) square( [h,2*ds], center=true);
      translate([ (r+h/2),0]) square( [h,2*ds], center=true);
    };
    circle(screw_r, $fn=FN);
    rotate(0.0, [0,0,1]) translate([screw_ds, 0]) circle(screw_r, $fn=FN);
//    rotate(45.0, [0,0,1]) translate([screw_ds, 0]) circle(screw_r, $fn=FN);
//    rotate(2*45.0, [0,0,1]) translate([screw_ds, 0]) circle(screw_r, $fn=FN);
    rotate(3*45.0, [0,0,1]) translate([screw_ds, 0]) circle(screw_r, $fn=FN);
//    rotate(4*45.0, [0,0,1]) translate([screw_ds, 0]) circle(screw_r, $fn=FN);
//    rotate(5*45.0, [0,0,1]) translate([screw_ds, 0]) circle(screw_r, $fn=FN);
//    rotate(6*45.0, [0,0,1]) translate([screw_ds, 0]) circle(screw_r, $fn=FN);
//    rotate(7*45.0, [0,0,1]) translate([screw_ds, 0]) circle(screw_r, $fn=FN);

  }

}


module outer_middle_plate_x() {
  r = OUTER_R;
  ds = tan(45.0/2)*r;
  _r = sqrt(r*r + ds*ds);
  h=3;
  screw_r = SCREW_R;
  screw_ds = screw_r + 5;
  tab_ds = 2*ds - 2;
  
  difference() {
    union() {
      polygon([ [r,ds], [r,-ds], [ds,-r], [-ds,-r], [-r,-ds], [-r,ds], [-ds,r], [ds,r] ]);
      translate([0,r+h/2]) square( [tab_ds, h], center=true);
      translate([0,-(r+h/2)]) square( [tab_ds, h], center=true);
      translate([-(r+h/2),0]) square( [h,tab_ds], center=true);
      translate([ (r+h/2),0]) square( [h,tab_ds], center=true);
      
      rotate(45.0, [0,0,1]) translate([0,r+h/2]) square( [tab_ds, h], center=true);
      rotate(3*45.0, [0,0,1]) translate([0,(r+h/2)]) square( [tab_ds, h], center=true);
      rotate(5*45.0, [0,0,1]) translate([0,(r+h/2)]) square( [tab_ds, h], center=true);
      rotate(7*45.0, [0,0,1]) translate([0,(r+h/2)]) square( [tab_ds, h], center=true);
      
      //rotate(45.0/2.0,[0,0,1]) translate([_r,2.1]) rotate(45.0,[0,0,1]) square(3, center=true);
    };
    circle(screw_r, $fn=FN);
    rotate(0.0, [0,0,1]) translate([screw_ds, 0]) circle(screw_r, $fn=FN);
    rotate(3*45.0, [0,0,1]) translate([screw_ds, 0]) circle(screw_r, $fn=FN);
  }

}

module outer_middle_plate() {
  r = OUTER_R;
  ds = tan(45.0/2)*r;
  _r = sqrt(r*r + ds*ds);
  h=3;
  screw_r = SCREW_R;
  screw_ds = screw_r + 5;
  tab_ds = 2*ds ;
  
  c_r=0.5;
  
  difference() {
    union() {
      polygon([ [r,ds], [r,-ds], [ds,-r], [-ds,-r], [-r,-ds], [-r,ds], [-ds,r], [ds,r] ]);
      translate([0,r+h/2]) square( [tab_ds, h], center=true);
      translate([0,-(r+h/2)]) square( [tab_ds, h], center=true);
      translate([-(r+h/2),0]) square( [h,tab_ds], center=true);
      translate([ (r+h/2),0]) square( [h,tab_ds], center=true);
      
      rotate(45.0, [0,0,1]) translate([0,r+h/2]) square( [tab_ds, h], center=true);
      rotate(3*45.0, [0,0,1]) translate([0,(r+h/2)]) square( [tab_ds, h], center=true);
      rotate(5*45.0, [0,0,1]) translate([0,(r+h/2)]) square( [tab_ds, h], center=true);
      rotate(7*45.0, [0,0,1]) translate([0,(r+h/2)]) square( [tab_ds, h], center=true);
      
      //rotate(45.0/2.0,[0,0,1]) translate([_r,2.1]) rotate(45.0,[0,0,1]) square(3, center=true);
    };
    
    rotate(45/2,[0,0,1])
    hull() {
      translate([_r+c_r,0]) circle(c_r, $fn=FN);
      translate([_r+2*c_r,0]) circle(c_r, $fn=FN);
    };
    
    rotate(3*45/2,[0,0,1])
    hull() {
      translate([_r+c_r,0]) circle(c_r, $fn=FN);
      translate([_r+2*c_r,0]) circle(c_r, $fn=FN);
    };

    rotate(5*45/2,[0,0,1])
    hull() {
      translate([_r+c_r,0]) circle(c_r, $fn=FN);
      translate([_r+2*c_r,0]) circle(c_r, $fn=FN);
    };

    rotate(7*45/2,[0,0,1])
    hull() {
      translate([_r+c_r,0]) circle(c_r, $fn=FN);
      translate([_r+2*c_r,0]) circle(c_r, $fn=FN);
    };

    rotate(9*45/2,[0,0,1])
    hull() {
      translate([_r+c_r,0]) circle(c_r, $fn=FN);
      translate([_r+2*c_r,0]) circle(c_r, $fn=FN);
    };

    rotate(11*45/2,[0,0,1])
    hull() {
      translate([_r+c_r,0]) circle(c_r, $fn=FN);
      translate([_r+2*c_r,0]) circle(c_r, $fn=FN);
    };

    rotate(13*45/2,[0,0,1])
    hull() {
      translate([_r+c_r,0]) circle(c_r, $fn=FN);
      translate([_r+2*c_r,0]) circle(c_r, $fn=FN);
    };

    rotate(15*45/2,[0,0,1])
    hull() {
      translate([_r+c_r,0]) circle(c_r, $fn=FN);
      translate([_r+2*c_r,0]) circle(c_r, $fn=FN);
    };

    
    
    circle(screw_r, $fn=FN);
    rotate(0.0, [0,0,1]) translate([screw_ds, 0]) circle(screw_r, $fn=FN);
    rotate(3*45.0, [0,0,1]) translate([screw_ds, 0]) circle(screw_r, $fn=FN);
  }

}

square_form0();
translate([15,0]) square_form1();
translate([0,15]) square_form1();

translate([25,25]) outer_middle_plate();
translate([50,0]) outer_top_plate();