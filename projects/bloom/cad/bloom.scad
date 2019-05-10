// License: CC0

FN=20;
MATERIAL_THICKNESS = 3;
M2_R = 1;
MID_W = 10;

FUDGE=0.0625;

base_r = 20;
tab_beam_w = 2;
tab_beam_s = MID_W + tab_beam_w/2;

anchor_h = 16;
anchor_h1 = 12;

tab = 2;
shaft_h = 60;

module beam_a() {
  w = 50;
  h = M2_R*2 + 4;
  s_r = M2_R;
  _m = MATERIAL_THICKNESS;
  m = _m + FUDGE;
  difference() {
    hull() {
      translate([-(w/2 - h/2),0]) circle(h/2, $fn=FN);
      translate([ (w/2 - h/2),0]) circle(h/2, $fn=FN);
    }
    //square([w,h], center=true);
    translate([-(w/2 - 2 - s_r),0]) circle(s_r, $fn=FN);
    translate([ (w/2 - 2 - s_r),0]) circle(s_r, $fn=FN);
    translate([-(MID_W/2 + m/2), h/2]) square([m,h], center=true);
    translate([ (MID_W/2 + m/2), h/2]) square([m,h], center=true);
    translate([0,h/2]) square([tab_beam_w,h], center=true);
  };
}

module beam_b() {
  w = 50;
  h = M2_R*2 + 4;
  s_r = M2_R;
  _m = MATERIAL_THICKNESS;
  m = _m + FUDGE;
  difference() {
    hull() {
      translate([-(w/2 - h/2),0]) circle(h/2, $fn=FN);
      translate([ (w/2 - h/2),0]) circle(h/2, $fn=FN);
    }
    //square([w,h], center=true);
    translate([-(w/2 - 2 - s_r),0]) circle(s_r, $fn=FN);
    translate([ (w/2 - 2 - s_r),0]) circle(s_r, $fn=FN);
    translate([-(MID_W/2 + m/2), -h/2]) square([m,h], center=true);
    translate([ (MID_W/2 + m/2), -h/2]) square([m,h], center=true);
    translate([0,h/2]) square([tab_beam_w,h], center=true);
  };
}

module beam_join() {
  _m = MATERIAL_THICKNESS;
  m = _m + FUDGE;
  difference() {
    union() {
      square([MID_W, MID_W], center=true);
      translate([ 0,  (MID_W/2 + m/2) ]) square([tab_beam_w,m], center=true);
      translate([ 0, -(MID_W/2 + m/2) ]) square([tab_beam_w,m], center=true);
      translate([ (MID_W/2 + m/2), 0]) square([m,tab_beam_w], center=true);
      translate([-(MID_W/2 + m/2), 0]) square([m,tab_beam_w], center=true);
    };
    square([m,m], center=true);
  };
}

module anchor_beam_a() {
  w = 50;
  h = M2_R*2 + 4;
  s_r = M2_R;
  _m = MATERIAL_THICKNESS;
  m = _m + FUDGE;
  dr = 5;
  n=8;
  difference() {
    union() {

      // circle joiner
      for (a = [0:n]) {
        translate([-(w/2), dr])
          hull() {
            rotate(-(90 + 90*a/n), [0,0,1]) translate([dr,0]) circle(h/2, $fn=FN);
            rotate(-(90 + 90*(a+1)/n), [0,0,1]) translate([dr,0]) circle(h/2, $fn=FN);
          };

        translate([ (w/2), dr])
          hull() {
            rotate( -(90*a/n), [0,0,1]) translate([dr,0]) circle(h/2, $fn=FN);
            rotate( -(90*(a+1)/n), [0,0,1]) translate([dr,0]) circle(h/2, $fn=FN);
          };
      };
      
      // left up
      hull() {
        translate([-(w/2 + dr), dr ]) circle(h/2, $fn=FN);
        translate([-(w/2 + dr), anchor_h]) circle(h/2, $fn=FN);
      };
      
      //right up
      hull() {
        translate([ (w/2 + dr), dr ]) circle(h/2, $fn=FN);
        translate([ (w/2 + dr), anchor_h]) circle(h/2, $fn=FN);
      };
      
      square([w,h], center=true);
      translate([-tab_beam_s, -m]) square([tab_beam_w, m], center=true);
      translate([ tab_beam_s, -m]) square([tab_beam_w, m], center=true);
    };
    
    //holes
    translate( [-(w/2+dr), anchor_h ]) circle(s_r, $fn=FN);
    translate( [ (w/2+dr), anchor_h ]) circle(s_r, $fn=FN);
    
    translate( [-(w/2+dr), anchor_h1]) circle(s_r, $fn=FN);
    translate( [ (w/2+dr), anchor_h1 ]) circle(s_r, $fn=FN);
    
    //translate([-(w/2 - 2 - s_r),0]) circle(s_r, $fn=FN);
    //translate([ (w/2 - 2 - s_r),0]) circle(s_r, $fn=FN);
    
    // tabs
    translate([-(MID_W/2 + m/2), h/2]) square([m,h], center=true);
    translate([ (MID_W/2 + m/2), h/2]) square([m,h], center=true);
  };
}

module anchor_beam_b() {
  w = 50;
  h = M2_R*2 + 4;
  s_r = M2_R;
  _m = MATERIAL_THICKNESS;
  m = _m + FUDGE;
  dr = 5;
  n=8;
  difference() {
    union() {

      // circle joiner
      for (a = [0:n]) {
        translate([-(w/2), dr])
          hull() {
            rotate(-(90 + 90*a/n), [0,0,1]) translate([dr,0]) circle(h/2, $fn=FN);
            rotate(-(90 + 90*(a+1)/n), [0,0,1]) translate([dr,0]) circle(h/2, $fn=FN);
          };

        translate([ (w/2), dr])
          hull() {
            rotate( -(90*a/n), [0,0,1]) translate([dr,0]) circle(h/2, $fn=FN);
            rotate( -(90*(a+1)/n), [0,0,1]) translate([dr,0]) circle(h/2, $fn=FN);
          };
      };
      
      // left up
      hull() {
        translate([-(w/2 + dr), dr ]) circle(h/2, $fn=FN);
        translate([-(w/2 + dr), anchor_h]) circle(h/2, $fn=FN);
      };
      
      //right up
      hull() {
        translate([ (w/2 + dr), dr ]) circle(h/2, $fn=FN);
        translate([ (w/2 + dr), anchor_h]) circle(h/2, $fn=FN);
      };
      
      square([w,h], center=true);
      translate([-tab_beam_s, -m]) square([tab_beam_w, m], center=true);
      translate([ tab_beam_s, -m]) square([tab_beam_w, m], center=true);
    };
    
    //holes
    translate( [-(w/2+dr), anchor_h ]) circle(s_r, $fn=FN);
    translate( [ (w/2+dr), anchor_h ]) circle(s_r, $fn=FN);
    
    translate( [-(w/2+dr), anchor_h1]) circle(s_r, $fn=FN);
    translate( [ (w/2+dr), anchor_h1 ]) circle(s_r, $fn=FN);
    
    //translate([-(w/2 - 2 - s_r),0]) circle(s_r, $fn=FN);
    //translate([ (w/2 - 2 - s_r),0]) circle(s_r, $fn=FN);
    
    // slots
    translate([-(MID_W/2 + m/2), -h/2]) square([m,h], center=true);
    translate([ (MID_W/2 + m/2), -h/2]) square([m,h], center=true);
  };
}

module lever() {
  h = M2_R*2 + 4;
  _m = MATERIAL_THICKNESS;
  m = _m+ FUDGE;
  s_r = M2_R;
  w = 26;
  difference() {
    hull() {
      translate([-(w/2-h/2),0]) circle(h/2, $fn=FN);
      translate([ (w/2-h/2),0]) circle(h/2, $fn=FN);
    };
    translate([-(w/2-s_r-2), 0]) circle(s_r, $fn=FN);
    hull() {
      translate([ (w/2-s_r-2),0]) circle(s_r, $fn=FN);
      translate([-(w/2-s_r-2-4*s_r),0]) circle(s_r, $fn=FN);
    };
  };
}

module platform_fixed_top() {
  _m = MATERIAL_THICKNESS;
  m = _m+ FUDGE;
  difference() {
    circle(base_r, $fn=2*FN);
    square([MID_W,MID_W], center=true);
    
    translate([-tab_beam_s, (MID_W/2 + m/2)]) square([tab_beam_w, m], center=true);
    translate([ tab_beam_s, (MID_W/2 + m/2)]) square([tab_beam_w, m], center=true);
    translate([ tab_beam_s,-(MID_W/2 + m/2)]) square([tab_beam_w, m], center=true);
    translate([-tab_beam_s,-(MID_W/2 + m/2)]) square([tab_beam_w, m], center=true);
    
    translate([ (MID_W/2 + m/2), tab_beam_s]) square([m,tab_beam_w], center=true);
    translate([-(MID_W/2 + m/2), tab_beam_s]) square([m,tab_beam_w], center=true);
    translate([-(MID_W/2 + m/2),-tab_beam_s]) square([m,tab_beam_w], center=true);
    translate([ (MID_W/2 + m/2),-tab_beam_s]) square([m,tab_beam_w], center=true);
    
    rotate(  0, [0,0,1]) translate([-17,0]) square([m,tab_beam_w], center=true);
    rotate( 45, [0,0,1]) translate([-17,0]) square([m,tab_beam_w], center=true);
    rotate( 90, [0,0,1]) translate([-17,0]) square([m,tab_beam_w], center=true);
    rotate(135, [0,0,1]) translate([-17,0]) square([m,tab_beam_w], center=true);
    rotate(180, [0,0,1]) translate([-17,0]) square([m,tab_beam_w], center=true);

    rotate(-45, [0,0,1]) translate([-17,0]) square([m,tab_beam_w], center=true);
    rotate(-90, [0,0,1]) translate([-17,0]) square([m,tab_beam_w], center=true);
    rotate(-135, [0,0,1]) translate([-17,0]) square([m,tab_beam_w], center=true);


  };
}


module platform_fixed_bottom() {
  _m = MATERIAL_THICKNESS;
  m = _m+ FUDGE;
  difference() {
    circle(base_r, $fn=2*FN);
    rotate(45, [0,0,1]) square([MID_W,MID_W], center=true);
    
    translate([-tab_beam_s, (MID_W/2 + m/2)]) square([tab_beam_w, m], center=true);
    translate([ tab_beam_s, (MID_W/2 + m/2)]) square([tab_beam_w, m], center=true);
    translate([ tab_beam_s,-(MID_W/2 + m/2)]) square([tab_beam_w, m], center=true);
    translate([-tab_beam_s,-(MID_W/2 + m/2)]) square([tab_beam_w, m], center=true);
    
    translate([ (MID_W/2 + m/2), tab_beam_s]) square([m,tab_beam_w], center=true);
    translate([-(MID_W/2 + m/2), tab_beam_s]) square([m,tab_beam_w], center=true);
    translate([-(MID_W/2 + m/2),-tab_beam_s]) square([m,tab_beam_w], center=true);
    translate([ (MID_W/2 + m/2),-tab_beam_s]) square([m,tab_beam_w], center=true);
    
    rotate(  0, [0,0,1]) translate([-17,0]) square([m,tab_beam_w], center=true);
    rotate( 45, [0,0,1]) translate([-17,0]) square([m,tab_beam_w], center=true);
    rotate( 90, [0,0,1]) translate([-17,0]) square([m,tab_beam_w], center=true);
    rotate(135, [0,0,1]) translate([-17,0]) square([m,tab_beam_w], center=true);
    rotate(180, [0,0,1]) translate([-17,0]) square([m,tab_beam_w], center=true);

    rotate(-45, [0,0,1]) translate([-17,0]) square([m,tab_beam_w], center=true);
    rotate(-90, [0,0,1]) translate([-17,0]) square([m,tab_beam_w], center=true);
    rotate(-135, [0,0,1]) translate([-17,0]) square([m,tab_beam_w], center=true);


  };
}


module shaft() {
  _m = MATERIAL_THICKNESS;
  m = _m + FUDGE;
  midsection_h = shaft_h/3;
  midsection_s = shaft_h/2 - midsection_h/2 - m;
  difference() {
    union() {
      square([m,shaft_h], center=true);
      translate([0,midsection_s]) square([MID_W,midsection_h], center=true);
    };
    translate([0,-(shaft_h/2 - 2)]) circle(0.5, $fn=FN);
    
    //translate([0,(shaft_h/4 + 6)]) square([m,m], center=true);
    translate([0,midsection_s + midsection_h/2 - 3*m/2]) square([m,m], center=true);
    //translate([0,(shaft_h/4 - 3)]) square([m,m], center=true);
    translate([0,midsection_s - midsection_h/2 + 3*m/2]) square([m,m], center=true);
  };
  
}

module shaft_side() {
  _m = MATERIAL_THICKNESS;
  m = _m + FUDGE;
  midsection_h = shaft_h/3;
  midsection_s = shaft_h/2 - midsection_h/2 - m;
  w = (MID_W-m)/2;
  union() {
    square([midsection_h, w]);
    translate([midsection_s - m/2,w+m/2]) square([m,m], center=true);
  };
}

module connector() {
  _m = MATERIAL_THICKNESS;
  m = _m + FUDGE;
  midsection_h = shaft_h/3;
  
  union() {
    square([midsection_h, _m], center=true);
    square([midsection_h-2*_m,2*m], center=true);
  };
}

module ok() {
  platform_fixed_bottom();
  translate([42,0]) platform_fixed_top();
  
  translate([16,26]) anchor_beam_a();
  translate([16,34]) beam_a();
  translate([16,42]) beam_a();
  
  translate([16,50]) anchor_beam_a();
  translate([16,58]) beam_a();
  translate([16,66]) beam_a();
  
  translate([86,26]) anchor_beam_a();
  translate([86,34]) beam_b();
  translate([86,42]) beam_b();
  
  translate([86,50]) anchor_beam_a();
  translate([86,58]) beam_b();
  translate([86,66]) beam_b();
  
  translate([100,-12]) anchor_beam_b();
  translate([87,-5]) lever();
  translate([87,2]) lever();
  translate([113.5,-5]) lever();
  translate([113.5,2]) lever();
  
  translate([100,14]) beam_join();
  translate([82,14]) beam_join();
  
  translate([126,30]) rotate(90, [0,0,1])
  group() {
  translate([13,-12]) anchor_beam_b();
  translate([0,-5]) lever();
  translate([0,2]) lever();
  translate([26.5,-5]) lever();
  translate([26.5,2]) lever();
  }
  
  translate([171,28]) rotate(90, [0,0,1]) anchor_beam_b();
  translate([148,20]) rotate(-90, [0,0,1]) anchor_beam_b();
 
  translate([14,76]) rotate(90,[0,0,1]) shaft(); 
  translate([32,70]) shaft_side(); 
  translate([54,70]) shaft_side(); 
  
  translate([86,74]) connector();
  translate([108,74]) connector();

  translate([155,36]) rotate(90, [0,0,1]) connector();
  translate([163,36]) rotate(90, [0,0,1]) connector();

  translate([155,14]) rotate(90, [0,0,1]) connector();
  translate([163,14]) rotate(90, [0,0,1]) connector();

  translate([145,64]) rotate(90, [0,0,1]) connector();

  translate([160,72]) connector();
  translate([160,65]) connector();

}


module xx() {
  //beam_a();
  //translate([0,10]) beam_b();
  //translate([-30,-25]) rotate(90, [0,0,1]) beam_a();
  //translate([0,22]) beam_join();

  translate([0,-25]) platform_fixed_top();

  translate([0,0]) anchor_beam_a();
  translate([0,10]) beam_a();
  translate([0,-50]) anchor_beam_b();

  translate([40, 30]) lever();
}

translate([20,20])
ok();





