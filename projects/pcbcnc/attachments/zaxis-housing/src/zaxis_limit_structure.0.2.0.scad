MATERIAL_THICKNESS = 3;

//MOTOR_D = 41.81;
//MOTOR_D = 43;
MOTOR_D = 44.5;
MOTOR_R = MOTOR_D/2;
ZAXIS_W = 63.97;
ZAXIS_DEPTH = 50.63;
ZAXIS_H = 35.38;

BT_OVERHANG_EDGE = 25;
BT_OVERHANG_FRONT = 60;

FINGER_W = 14;
FINGER_H = MATERIAL_THICKNESS;

ZLIMIT_W = 28;
ZLIMIT_H = 16;

//BACK_PLATE_W = ZAXIS_W + 2*ZLIMIT_W + 2*8;
BACK_PLATE_W = ZAXIS_W + 2*8;
BACK_PLATE_H = 35;

module side_holder_bottom() {
  w = 20;
  s = 40;
  t = FINGER_H;
  
  xx = 10;
  d=5;

  difference() {
    union() {
      square([s,w], center=true);
      translate([ (s/2 - FINGER_H/2) + t, w/3]) square([FINGER_H,w/3], center=true);
      translate([ (s/2 - FINGER_H/2) + t,-w/3]) square([FINGER_H,w/3], center=true);
    };
    translate([-(5*s/12 - d/2),0]) circle(d/2, $fn=16);
    translate([-(1*s/12 - d/2),0]) circle(d/2, $fn=16);
    translate([ (s/2 - FINGER_W), (w/2 - FINGER_H/2)]) square([FINGER_W, FINGER_H], center=true);
    translate([ (s/2 - FINGER_W),-(w/2 - FINGER_H/2)]) square([FINGER_W, FINGER_H], center=true);
    translate([ (s/2 - FINGER_H/2) + t, 0]) square([FINGER_H, w/3], center=true);
  }
  
}

module side_holder_up() {
  w = 20;
  s = 40;
  d=5;
  t = FINGER_H;
  difference() {
    union() {
      square([s,w], center=true);
      translate([ (s/2 + FINGER_H/2), 0]) square([FINGER_H, w/3], center=true);
    };
    translate([-7*s/24,0]) switch_holes2();
    translate([ (s/2 - FINGER_W), (w/2 - FINGER_H/2)]) square([FINGER_W, FINGER_H], center=true);
    translate([ (s/2 - FINGER_W),-(w/2 - FINGER_H/2)]) square([FINGER_W, FINGER_H], center=true);
  
  }
  
}

module side_holder_connect(h=0) {
  s = 3*FINGER_W/2;
  t = MATERIAL_THICKNESS;
  union() {
    polygon([[0,0],[s,s],[s,0]]);
    //polygon([[0,0],[s,s],[s,t], [s-FINGER_W/2,t], [s-FINGER_W/2,0],[s,0]]);
    translate([0,-FINGER_H-h]) square([FINGER_W,FINGER_H]);
    translate([s,FINGER_W/2-h]) square([FINGER_H, FINGER_W]);
  }
}

module top_holder() {
  w = 40;
  s = 20;
  ofx = -0;
  ofy = -10;
  
  difference() {
    union() {
      //square([30,10]);
      square([w,s]);
      //translate([-10,-20,0]) square([10,20]);
      translate([ofx-s/2,ofy-w/2,0]) square([10,20]);
      //polygon( points=[[0,w/2],[-s/2,0],[0,-s/8],[w/8,0]], paths=[[0,1,2,3,0]]);
      polygon( points=[[0,w/2],[ofx-s/2,ofy],[ofx,ofy-s/8],[w/8,0]], paths=[[0,1,2,3,0]]);
    }
    translate([w/3,s/2]) circle(2.5,$fn=16);
    translate([3*w/4,s/2]) circle(2.5, $fn=16);
    //translate([-4,-12]) rotate(90, [0,0,1]) switch_holes2();
    translate([ofx-4,ofy-12]) rotate(90, [0,0,1]) switch_holes2();
  }
}


module side_plate() {
  cable_slot_w = 4.75;
  cable_slot_h = 2;
  
  ofst = 50;
  
  w = ZAXIS_W - ofst;
  h = ZAXIS_H + 3*cable_slot_h;
  
  difference() {
    // main body
    //
    //square([ZAXIS_W, ZAXIS_H], center=true);
    union() {
      //square([ZAXIS_W, ZAXIS_H], center=true);
      square([ZAXIS_W, h], center=true);
      //translate([ZAXIS_W/2 + ZAXIS_W/4,0]) square([ZAXIS_W/2, ZAXIS_H], center=true);
      translate([ZAXIS_W/2 + ZAXIS_W/4,0]) square([ZAXIS_W, h], center=true);
    }
    
    translate([ZAXIS_W/2 + 6,h/2]) square([ZAXIS_W, 4*cable_slot_h], center=true);
    translate([ZAXIS_W/2 + 6,-h/2]) square([ZAXIS_W, 4*cable_slot_h], center=true);
    
    // platform slots
    //
    translate([-(FINGER_W-ofst), ZAXIS_H/4]) square( [FINGER_W, FINGER_H], center=true);
    translate([-(FINGER_W-ofst),-ZAXIS_H/4]) square( [FINGER_W, FINGER_H], center=true);
    translate([ (FINGER_W+ofst), ZAXIS_H/4]) square( [FINGER_W, FINGER_H], center=true);
    translate([ (FINGER_W+ofst),-ZAXIS_H/4]) square( [FINGER_W, FINGER_H], center=true);
    
    // cable tile slots
    //
    /*
    translate([-(ZAXIS_W/2 - 2*cable_slot_h), (ZAXIS_H/2 - 1.5*cable_slot_h)])
      square([cable_slot_w, cable_slot_h], center=true);
    translate([-(ZAXIS_W/2 - 2*cable_slot_h),-(ZAXIS_H/2 - 1.5*cable_slot_h)])
      square([cable_slot_w, cable_slot_h], center=true);
    translate([ (ZAXIS_W/2 - 2*cable_slot_h), (ZAXIS_H/2 - 1.5*cable_slot_h)])
      square([cable_slot_w, cable_slot_h], center=true);
    translate([ (ZAXIS_W/2 - 2*cable_slot_h),-(ZAXIS_H/2 - 1.5*cable_slot_h)])
      square([cable_slot_w, cable_slot_h], center=true);
    translate([ 0, (ZAXIS_H/2 - 1.5*cable_slot_h)]) square([cable_slot_w, cable_slot_h], center=true);
    translate([ 0,-(ZAXIS_H/2 - 1.5*cable_slot_h)]) square([cable_slot_w, cable_slot_h], center=true);
    */
    translate([-(ZAXIS_W/2 - 2*cable_slot_h), (h/2 - 1.5*cable_slot_h)])
      square([cable_slot_w, cable_slot_h], center=true);
    translate([-(ZAXIS_W/2 - 2*cable_slot_h),-(h/2 - 1.5*cable_slot_h)])
      square([cable_slot_w, cable_slot_h], center=true);
    translate([ (ZAXIS_W/2 - 2*cable_slot_h), (h/2 - 1.5*cable_slot_h)])
      square([cable_slot_w, cable_slot_h], center=true);
    translate([ (ZAXIS_W/2 - 2*cable_slot_h),-(h/2 - 1.5*cable_slot_h)])
      square([cable_slot_w, cable_slot_h], center=true);
    translate([ 0, (h/2 - 1.5*cable_slot_h)]) square([cable_slot_w, cable_slot_h], center=true);
    translate([ 0,-(h/2 - 1.5*cable_slot_h)]) square([cable_slot_w, cable_slot_h], center=true);
    
    // center access
    //
    square([ZAXIS_W/2, 4], center=true);
    circle(cable_slot_h*3, $fn=16);
    
    translate([ofst,0]) square([ZAXIS_W/2, 4], center=true);
    translate([ofst,0]) circle(cable_slot_h*3, $fn=16);
    
    // center cable tie
    //
    translate([-(ZAXIS_W/2 - 1.5*cable_slot_h), 0]) square([3*cable_slot_h, cable_slot_w], center=true);
    translate([ (ZAXIS_W/2 - 1.5*cable_slot_h), 0]) square([3*cable_slot_h, cable_slot_w], center=true);
  }
}



module side_plate_bottom() {
  cable_slot_w = 4.75;
  cable_slot_h = 2;
  
  //ofst = 33;
  ofst = 28;
  
  w = ZAXIS_W - ofst;
  h = ZAXIS_H + 3*cable_slot_h;
  
  difference() {
    // main body
    //
    //square([ZAXIS_W, ZAXIS_H], center=true);
    union() {
      //square([ZAXIS_W, ZAXIS_H], center=true);
      square([ZAXIS_W, h], center=true);
      //translate([ZAXIS_W/2 + ZAXIS_W/4,0]) square([ZAXIS_W/2, ZAXIS_H], center=true);
      translate([ZAXIS_W/2 + ZAXIS_W/4,0]) square([ZAXIS_W, h], center=true);
    }
    
    translate([ZAXIS_W/2 + 6,h/2]) square([ZAXIS_W, 4*cable_slot_h], center=true);
    translate([ZAXIS_W/2 + 6,-h/2]) square([ZAXIS_W, 4*cable_slot_h], center=true);
    
    translate([-ZAXIS_W/4 + 2, h/2]) square([ZAXIS_W/4, 4*cable_slot_h], center=true);
    translate([-ZAXIS_W/4 + 2, -h/2]) square([ZAXIS_W/4, 4*cable_slot_h], center=true);
    
    // platform slots
    //
    translate([-(FINGER_W-ofst), ZAXIS_H/4]) square( [FINGER_W, FINGER_H], center=true);
    translate([-(FINGER_W-ofst),-ZAXIS_H/4]) square( [FINGER_W, FINGER_H], center=true);
    translate([ (FINGER_W+ofst), ZAXIS_H/4]) square( [FINGER_W, FINGER_H], center=true);
    translate([ (FINGER_W+ofst),-ZAXIS_H/4]) square( [FINGER_W, FINGER_H], center=true);
    
    // cable tile slots
    //
    /*
    translate([-(ZAXIS_W/2 - 2*cable_slot_h), (ZAXIS_H/2 - 1.5*cable_slot_h)])
      square([cable_slot_w, cable_slot_h], center=true);
    translate([-(ZAXIS_W/2 - 2*cable_slot_h),-(ZAXIS_H/2 - 1.5*cable_slot_h)])
      square([cable_slot_w, cable_slot_h], center=true);
    translate([ (ZAXIS_W/2 - 2*cable_slot_h), (ZAXIS_H/2 - 1.5*cable_slot_h)])
      square([cable_slot_w, cable_slot_h], center=true);
    translate([ (ZAXIS_W/2 - 2*cable_slot_h),-(ZAXIS_H/2 - 1.5*cable_slot_h)])
      square([cable_slot_w, cable_slot_h], center=true);
    translate([ 0, (ZAXIS_H/2 - 1.5*cable_slot_h)]) square([cable_slot_w, cable_slot_h], center=true);
    translate([ 0,-(ZAXIS_H/2 - 1.5*cable_slot_h)]) square([cable_slot_w, cable_slot_h], center=true);
    */
    translate([-(ZAXIS_W/2 - 2*cable_slot_h), (h/2 - 1.5*cable_slot_h)])
      square([cable_slot_w, cable_slot_h], center=true);
    translate([-(ZAXIS_W/2 - 2*cable_slot_h),-(h/2 - 1.5*cable_slot_h)])
      square([cable_slot_w, cable_slot_h], center=true);
    translate([ (ZAXIS_W/2 - 2*cable_slot_h), (h/2 - 1.5*cable_slot_h)])
      square([cable_slot_w, cable_slot_h], center=true);
    translate([ (ZAXIS_W/2 - 2*cable_slot_h),-(h/2 - 1.5*cable_slot_h)])
      square([cable_slot_w, cable_slot_h], center=true);
    translate([ 0, (h/2 - 1.5*cable_slot_h)]) square([cable_slot_w, cable_slot_h], center=true);
    translate([ 0,-(h/2 - 1.5*cable_slot_h)]) square([cable_slot_w, cable_slot_h], center=true);
    
    // center access
    //
    translate([ofst,0]) square([ZAXIS_W/2, 4], center=true);
    translate([ofst,0]) circle(cable_slot_h*3, $fn=16);
    
    //translate([ofst,0]) square([ZAXIS_W/2, 4], center=true);
    //translate([ofst,0]) circle(cable_slot_h*3, $fn=16);
    
    // center cable tie
    //
    translate([-(ZAXIS_W/2 - 1.5*cable_slot_h), 0]) square([3*cable_slot_h, cable_slot_w], center=true);
    translate([ (ZAXIS_W/2 - 1.5*cable_slot_h), 0]) square([3*cable_slot_h, cable_slot_w], center=true);
  }
}

// 15 , 5
module platform() {
  platform_w = ZAXIS_W-18;
  platform_h = ZAXIS_H;
  difference() {
    
    //main body
    //
    square([platform_w, platform_h], center=true);
    
    translate([-platform_w/2,0]) circle(2.5);
    translate([ platform_w/2,0]) circle(2.5);
    
    //support slots
    //
    translate([-FINGER_W, platform_h/4]) square([FINGER_W, FINGER_H], center=true);
    translate([-FINGER_W,-platform_h/4]) square([FINGER_W, FINGER_H], center=true);
    translate([ FINGER_W, platform_h/4]) square([FINGER_W, FINGER_H], center=true);
    translate([ FINGER_W,-platform_h/4]) square([FINGER_W, FINGER_H], center=true);
    
    // limit switch holes
    //
    //translate([-5, (platform_h/2 - ZLIMIT_H/2)]) mirror([1,0,0]) switch_holes();
    //translate([-5,-(platform_h/2 - ZLIMIT_H/2)])switch_holes();
    
    translate([ 0, (platform_h/2 - ZLIMIT_H/2)])
      mirror([1,0,0]) switch_holes();
    translate([ 0,-(platform_h/2 - ZLIMIT_H/2)])
      switch_holes();
    
    
    translate([-(platform_w/2 - ZLIMIT_W/2), (platform_h/2 - ZLIMIT_H/2)])
      mirror([1,0,0]) switch_holes();
    translate([-(platform_w/2 - ZLIMIT_W/2),-(platform_h/2 - ZLIMIT_H/2)])
      switch_holes();
    translate([ (platform_w/2 - ZLIMIT_W/2),-(platform_h/2 - ZLIMIT_H/2)])
      switch_holes();
    translate([ (platform_w/2 - ZLIMIT_W/2), (platform_h/2 - ZLIMIT_H/2)])
      mirror([1,0,0]) switch_holes();    
  }
}

module platform_support(support_base_h=2) {
  //a=90/4;
  a=90/2;
  support_base_w = 3*FINGER_W;
  //support_base_h = 10;
  //support_base_h = 2;
  C0=30;
  C1=15;
  
  xh = sin(a) * support_base_w;
  difference() {
    union() {
      
      // bottom half with fingers
      //
      square([support_base_w, support_base_h], center=true);
      translate([-FINGER_W, -(support_base_h/2 + FINGER_H/2)]) square([FINGER_W, FINGER_H], center=true);
      translate([ FINGER_W, -(support_base_h/2 + FINGER_H/2)]) square([FINGER_W, FINGER_H], center=true);
      
      // triangular upper half
      //
      translate([-support_base_w/2, support_base_h/2])
      intersection() {
        rotate(a, [0,0,1]) mirror([0,1,0]) square([2*support_base_w, C0*support_base_h]);
        //color([1,0,0]) square([support_base_w, C1*support_base_h]);
        square([support_base_w, xh]);
      };
      
      // fingers for triangular upper half
      //
      translate([-(support_base_w/2), support_base_h/2])
        rotate(a, [0,0,1])
        square([FINGER_W, FINGER_H]);

      translate([-3*FINGER_W/2,support_base_h/2])
        rotate(a, [0,0,1])
        translate([2*FINGER_W,0])
        square([FINGER_W, FINGER_H]);
    }
    
    translate([0,-support_base_h/2]) circle(FINGER_W/3);
  }
}


module switch_holes() {
  diam = 3.2;
  w = ZLIMIT_W;
  h = ZLIMIT_H;
  topl_offset = 1.45;
  topu_offset = 1.53;
  
  rightr_offset = 1.45;
  rightb_offset = 1.3;
  
  translate([-w/2+topl_offset+diam/2, h/2 - topu_offset - diam/2]) circle(diam/2, $fn=16);
  translate([ w/2-rightr_offset-diam/2, -h/2 + rightb_offset + diam/2]) circle(diam/2, $fn=16);
}

module switch_holes2() {
  // w=20, h=10
  // top hole to top = 5.78
  // bot hole to bot = 1.78
  // side hole to side = 4
  // inside hole to inside hole = 7
  // hole diam = 2.5
  diam = 2.5;
  w = 20;
  h = 10;
  x_from_cent = 7/2+diam/2;
  y_from_cent = 5.75-(h/2)+diam/2;
  
  translate([x_from_cent,y_from_cent]) circle(diam/2, $fn=16);
  translate([-x_from_cent, y_from_cent]) circle(diam/2, $fn=16);
  
}


module switch_spacer2() {
  // w=20, h=10
  // top hole to top = 5.78
  // bot hole to bot = 1.78
  // side hole to side = 4
  // inside hole to inside hole = 7
  // hole diam = 2.5
  diam = 2.5;
  w = 20;
  h = 10;
  x_from_cent = 7/2+diam/2;
  y_from_cent = 5.75-(h/2)+diam/2;
  
  difference() {
    square([w,h], center=true);
    translate([x_from_cent,y_from_cent]) circle(diam/2, $fn=16);
    translate([-x_from_cent, y_from_cent]) circle(diam/2, $fn=16);
  }
  
}

module all() {
  side_plate();
  translate([0,40]) side_plate();
  
  //translate([65,0]) platform();
  //translate([65,40]) platform();

  translate([245,0]) platform();
  translate([245,40]) platform();


  translate([-8,65]) platform_support();
  translate([40,65]) platform_support();

  translate([87,65]) platform_support();

  translate([100,2]) rotate(-90, [0,0,1])  platform_support();
  
  translate([135,10]) rotate(45,[0,0,1]) top_holder();
  translate([175,30]) rotate(-135, [0,0,1]) top_holder();
  
  translate([162,70]) rotate(90, [0,0,1]) switch_spacer2();
  translate([165,90]) switch_spacer2();
  


  translate([131,68]) side_holder_bottom();
  translate([190,0]) rotate(45, [0,0,1]) side_holder_bottom();
  
  translate([130,90]) side_holder_up();
  translate([195,50]) rotate(90,[0,0,1]) side_holder_up();
  
  translate([98,50]) rotate(-90, [0,0,1]) side_holder_connect();
  translate([115,35]) rotate(90, [0,0,1]) side_holder_connect();
  translate([145,53]) rotate(180, [0,0,1]) side_holder_connect();
  translate([193,80]) rotate(180,[0,0,1]) side_holder_connect();
}


module platforms() {
  dx= 120;
  dy = 45;
  side_plate();
  translate([0,dy]) side_plate_bottom();
  
  translate([0.95*dx,0]) platform();
  translate([0.95*dx,dy]) platform();

  translate([-8,1.8*dy]) platform_support(10);
  translate([0.95*dy,1.6*dy]) platform_support(10);

  translate([dx,1.6*dy]) platform_support();
  translate([2*dy,2.2*dy]) rotate(-180, [0,0,1])  platform_support();
  
  //translate([1.3*dx,70]) switch_spacer2();
  //translate([1.3*dx,50]) switch_spacer2();

}

module platform_side_bottom_only() {
  dx= 120;
  dy = 30;
  translate([0,0]) side_plate_bottom();
  
  translate([-7,dy]) platform_support(10);
  translate([48,dy]) platform_support(10);

}


module all() {
  
  dx= 120;
  dy = 30;
  translate([0,0]) side_plate_bottom();
  
  translate([-7,dy]) platform_support(10);
  translate([48,dy]) platform_support(10);
  
  translate([dx,0]) side_plate();
  translate([dx,dy]) platform_support();
  translate([dx + 50,dy]) platform_support();
  
  
  
  translate([0,4*dy]) rotate(45,[0,0,1]) top_holder();
  translate([45,4*dy]) rotate(-135, [0,0,1]) top_holder();
  
  translate([162,170]) rotate(90, [0,0,1]) switch_spacer2();
  translate([165,190]) switch_spacer2();
  


  translate([101,108]) side_holder_bottom();
  translate([150,100]) rotate(45, [0,0,1]) side_holder_bottom();
  
  translate([130,190]) side_holder_up();
  translate([195,150]) rotate(90,[0,0,1]) side_holder_up();
  
  translate([98,150]) rotate(-90, [0,0,1]) side_holder_connect();
  translate([115,135]) rotate(90, [0,0,1]) side_holder_connect();
  translate([145,153]) rotate(180, [0,0,1]) side_holder_connect();
  translate([193,180]) rotate(180,[0,0,1]) side_holder_connect();

}

//translate([60,40]) all();
//translate([60,40]) platforms();
//translate([36,25]) platform_side_bottom_only();

all();