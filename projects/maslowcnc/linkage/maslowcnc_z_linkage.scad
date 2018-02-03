// licensed under CC0
//
// still a work in progress.
// the dimensions need to be confirmed.
// the 'dingy' especially needs to be confirmed.
//

module saw_end_linkage( base_length,
                  width,
                  saw_h,
                  circle_d_mid) {
  difference() {
    union() {
      square([base_length, width], center=true);
      polygon([[-base_length/2.0,width/2],
               [-base_length/2.0 - saw_h, 0],
               [-base_length/2.0,-width/2]]);
      polygon([[ base_length/2.0,width/2],
               [ base_length/2.0 + saw_h, 0],
               [ base_length/2.0,-width/2]]);
    }

    translate([0,0]) circle(d=circle_d_mid);
  }
}
   


// center_hole_p from circle end of base edge
//
module circle_saw_end_linkage( base_length,
                  width,
                  saw_h,
                  center_hole_p, 
                  circle_d_left,
                  circle_d_mid) {
  difference() {
    union() {
      square([base_length, width], center=true);
      translate([-base_length/2,0]) circle(d=width);
      polygon([[base_length/2.0,width/2],
               [base_length/2.0 + saw_h, 0],
               [base_length/2.0,-width/2]]);
    }
    translate([-base_length/2,0]) circle(d=circle_d_left);    
    translate([-(base_length/2.0) + center_hole_p ,0]) circle(d=circle_d_mid);
  }
}
   

module circle_end_linkage( base_length,
                  width,
                  circle_d_left,
                  circle_d_mid,
                  circle_d_right) {

  difference() {
    union() {
      square([base_length, width], center=true);
      translate([-base_length/2,0]) circle(d=width);
      translate([ base_length/2,0]) circle(d=width);
    }
    
    translate([-base_length/2,0]) circle(d=circle_d_left);
    translate([0,0]) circle(d=circle_d_mid);
    translate([ base_length/2,0]) circle(d=circle_d_right);
  }
  
}

module dingy(base_length,
             width,
             circle_d,
             hole_l_a,
             hole_w_a,
             hole_l_b,
             hole_w_b) {
  difference() {
    union() {
      square([base_length,width], center=true);
      translate([base_length/2,0]) circle(d=width);
    }
    translate([base_length/2,0]) circle(d=circle_d);
    translate([-base_length/2.0 + 4.35 + hole_l_a/2, 0])
      square([hole_l_a, hole_w_a], center=true);
    translate([-base_length/2.0 + 4.35 + hole_l_a + hole_l_b/2,0, 0])
      square([hole_l_b, hole_w_b], center=true);
    translate([-base_length/2.0 + 4.35 + hole_l_a + hole_l_b, 0])
      circle(d=hole_w_b);
  }
}

module linkage_cross(base_length,
                     width,
                     tab_length,
                     tab_width,
                     square_hole_length,
                     square_hole_width) {
  difference() {
    union() {
      square([base_length, width], center=true);
      translate([base_length/2 + tab_length/2, 0])
        square([tab_length, tab_width], center=true);
      translate([-(base_length/2 + tab_length/2), 0])
        square([tab_length, tab_width], center=true);
    }
    square([square_hole_length, square_hole_width], center=true);
  }
}


// a2, f2
//w=18.75;
w=20;
l=247-w;
translate([0, 0*w]) circle_end_linkage(l, w, 6.5, 6.5, 9.15);
translate([0, 2*w]) circle_end_linkage(l, w, 6.5, 6.5, 9.15);

// b1, b3
translate([0, 4*w]) circle_end_linkage(l, w, 6.5, 6.5, 6.5);
translate([0, 6*w]) circle_end_linkage(l, w, 6.5, 6.5, 6.5);

// d1, d3, c2
translate([0, -2*w]) circle_end_linkage(l, w, 6.5, 0, 9.15);
translate([0, -4*w]) circle_end_linkage(l, w, 6.5, 0, 9.15);
translate([0, -6*w]) circle_end_linkage(l, w, 6.5, 0, 9.15);

// a1, a3, f1, f3
saw_h = 5.75;
ll=223 - saw_h - (w/2);
center_hole_p = l/2;
translate([l + 3*w, 0*w]) circle_saw_end_linkage(ll, w, saw_h, center_hole_p,9.15, 6.5);
translate([l+3*w, -2*w]) circle_saw_end_linkage(ll, w, saw_h, center_hole_p, 9.15, 6.5);
translate([l+3*w, -4*w]) circle_saw_end_linkage(ll, w, saw_h, center_hole_p, 9.15, 6.5);
translate([l+3*w, -6*w]) circle_saw_end_linkage(ll, w, saw_h, center_hole_p, 9.15, 6.5);

// e1, e2, e3
translate([l+3*w, 2*w]) circle_saw_end_linkage(ll, w, saw_h, center_hole_p, 6.5, 6.5);
translate([l+3*w, 4*w]) circle_saw_end_linkage(ll, w, saw_h, center_hole_p, 6.5, 6.5);
translate([l+3*w, 6*w]) circle_saw_end_linkage(ll, w, saw_h, center_hole_p, 6.5, 6.5);

// b2
//lll=182;
lll=230;
translate([0, -8*w]) saw_end_linkage(lll, w, saw_h, 6.5);

// g2, g2
cross_tab_width = 9.2;
translate([0, -10*w])
  linkage_cross(18.75, w, 6, cross_tab_width, 8.75, 6.5);
translate([3*w, -10*w])
  linkage_cross(18.75, w, 6, cross_tab_width, 8.75, 6.5);
  
// c1 c3, d2

translate([6*w,-10*w])
  difference() { circle(d=18.75); circle(d=9.7); }
  
translate([9*w,-10*w])
  difference() { circle(d=18.75); circle(d=9.7); }
translate([12*w,-10*w])
  difference() { circle(d=18.75); circle(d=9.7); }

// g1, g1, g3, g3
dingy_l = 60.5 - w/2;
fudge = 0.5;
translate([0, -12*w])
  dingy(dingy_l, w, 6.5, 6, cross_tab_width + fudge,, 9, 7.45);
translate([4*w, -12*w])
  dingy(dingy_l, w, 6.5, 6, cross_tab_width + fudge, 9, 7.45);
translate([0, -14*w])
  dingy(dingy_l, w, 6.5, 6, cross_tab_width + fudge, 9, 7.45);
translate([4*w, -14*w])
  dingy(dingy_l, w, 6.5, 6, cross_tab_width + fudge, 9, 7.45);
