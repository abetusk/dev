MATERIAL_THICKNESS = 3;

//MOTOR_D = 41.81;
MOTOR_D = 43;
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

BACK_PLATE_W = ZAXIS_W + 2*ZLIMIT_W + 2*8;
BACK_PLATE_H = 35;

module slots() {
  
}

/*
module plate() {
  difference() {
    slot_translate = overhang/2 + MOTOR_D/2;
    square( 2*overhang + MOTOR_D, center=true );
    hull() {
      circle(MOTOR_D/2);
      translate([0,-5*overhang]) circle(MOTOR_D/2);
    };
    translate([-slot_translate,0]) rotate(-45, [0,0,1]) square([5,20], center=true);
    translate([ slot_translate,0]) rotate( 45, [0,0,1]) square([5,20], center=true);
  }
}
*/

module tb_plate() {
  overhang = BT_OVERHANG_EDGE;
  cable_slot_x = 13;
  cable_slot_y = 10;
  cable_slot_w = 4;
  cable_slot_h = 2;
  
  finger_front = 30;
  
  difference() {
    
    // motor shaft slot
    //
    translate([-(2*overhang + MOTOR_D)/2,-MOTOR_R])
      square( [2*overhang + MOTOR_D, BT_OVERHANG_FRONT]);
    hull() {
      circle(MOTOR_R);
      translate([0,-MOTOR_D]) circle(MOTOR_R);
    };
    
    // cable tie slots
    //
    translate([-(MOTOR_R+cable_slot_x), cable_slot_y])
      square([cable_slot_w, cable_slot_h], center=true);
    translate([-(MOTOR_R+cable_slot_x), -cable_slot_y])
      square([cable_slot_w, cable_slot_h], center=true);
    translate([ (MOTOR_R+cable_slot_x), cable_slot_y])
      square([cable_slot_w, cable_slot_h], center=true);
    translate([ (MOTOR_R+cable_slot_x), -cable_slot_y])
      square([cable_slot_w, cable_slot_h], center=true);

    // plate finger slots
    //
    translate([0,finger_front + (FINGER_H/2)])
      square([FINGER_W, FINGER_H], center=true);
    translate([-2*FINGER_W,finger_front + (FINGER_H/2)])
      square([FINGER_W, FINGER_H], center=true);
    translate([2*FINGER_W,finger_front + (FINGER_H/2)])
      square([FINGER_W, FINGER_H], center=true);    
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
  
  translate([-w/2+topl_offset+diam/2, h/2 - topu_offset - diam/2]) circle(diam/2);
  translate([ w/2-rightr_offset-diam/2, -h/2 + rightb_offset + diam/2]) circle(diam/2);
}

module back_plate() {
  
  //debugging: visual guides for zaxis width
  //
  //translate([-ZAXIS_W/2,ZAXIS_H/2]) square([1,6], center=true);
  //translate([ ZAXIS_W/2,ZAXIS_H/2]) square([1,6], center=true);
  //
  //debug
  
  difference() {
    square([BACK_PLATE_W, BACK_PLATE_H], center=true);
    
    // side tie slots
    //
    //translate([-((ZAXIS_W/2) + 4), 6]) square([2,4], center=true);
    //translate([-((ZAXIS_W/2) + 4), -6]) square([2,4], center=true);
    //translate([ ((ZAXIS_W/2) + 4), 6]) square([2,4], center=true);
    //translate([ ((ZAXIS_W/2) + 4), -6]) square([2,4], center=true);

    translate([-((ZAXIS_W/2) + 1), 0]) square([2,4], center=true);
    translate([ ((ZAXIS_W/2) + 1), 0]) square([2,4], center=true);
    
    // top/bottom tie slots
    //
    translate([-((ZAXIS_W/2) + 4), ((ZAXIS_H/2) - 4)]) square([4,2], center=true);
    translate([-((ZAXIS_W/2) + 4),-((ZAXIS_H/2) - 4)]) square([4,2], center=true);
    translate([ ((ZAXIS_W/2) + 4), ((ZAXIS_H/2) - 4)]) square([4,2], center=true);
    translate([ ((ZAXIS_W/2) + 4),-((ZAXIS_H/2) - 4)]) square([4,2], center=true);
    
    translate([-(ZAXIS_W/2+ZLIMIT_W/2+7), BACK_PLATE_H/2 - 10]) switch_holes();
    translate([ (ZAXIS_W/2+ZLIMIT_W/2+7), -BACK_PLATE_H/2 + 10])
      rotate(a=180, [0,0,1])
      switch_holes();
    
  }
}


module front_plate() {
  fh = FINGER_H+1;

  difference() {
    union() {
      square([BACK_PLATE_W, BACK_PLATE_H], center=true);
      
      // top fingers
      //
      translate([0,BACK_PLATE_H/2 + FINGER_H/2])
        square([FINGER_W, fh], center=true);
      translate([ (2*FINGER_W),BACK_PLATE_H/2 + FINGER_H/2])
        square([FINGER_W, fh], center=true);
      translate([-(2*FINGER_W),BACK_PLATE_H/2 + FINGER_H/2])
        square([FINGER_W, fh], center=true);
      
      // bottom fingers
      //
      translate([0,-(BACK_PLATE_H/2 + FINGER_H/2)])
        square([FINGER_W, fh], center=true);
      translate([ (2*FINGER_W),-(BACK_PLATE_H/2 + FINGER_H/2)])
        square([FINGER_W, fh], center=true);
      translate([-(2*FINGER_W),-(BACK_PLATE_H/2 + FINGER_H/2)])
        square([FINGER_W, fh], center=true);
    }
    
    translate([-((ZAXIS_W/2) + 1), 0]) square([2,4], center=true);
    translate([ ((ZAXIS_W/2) + 1), 0]) square([2,4], center=true);
    
    // top/bottom tie slots
    //
    translate([-((ZAXIS_W/2) + 4), ((ZAXIS_H/2) - 4)]) square([4,2], center=true);
    translate([-((ZAXIS_W/2) + 4),-((ZAXIS_H/2) - 4)]) square([4,2], center=true);
    translate([ ((ZAXIS_W/2) + 4), ((ZAXIS_H/2) - 4)]) square([4,2], center=true);
    translate([ ((ZAXIS_W/2) + 4),-((ZAXIS_H/2) - 4)]) square([4,2], center=true);
    
    
  }
}


module all() {

  tb_plate();
  translate([0,65]) tb_plate();

  translate([130,0]) back_plate();
  translate([130,60]) front_plate();
}

translate([50,30]) all();