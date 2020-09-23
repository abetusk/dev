// License: CC0
//

$fs=1/20;

//FACE_WIDTH = 50;
//FACE_HEIGHT = 30;
//BODY_LENGTH = 50;

FACE_WIDTH = 50*2;
FACE_HEIGHT = 30*2;
BODY_LENGTH = 50*2;

MATERIAL_THICKNESS = 3;

// degrees
//
FACE_TILT  = 60;

UNDER_LENGTH = BODY_LENGTH + FACE_HEIGHT*cos(FACE_TILT);
BODY_HEIGHT = FACE_HEIGHT*sin(FACE_TILT);

BEND_R = 1;
BEND_K = 0.5;
BEND_C = (FACE_TILT/360)*(2*PI)*(BEND_R + BEND_K*MATERIAL_THICKNESS);

BEND_C90 = (90/360)*(2*PI)*(BEND_R + BEND_K*MATERIAL_THICKNESS);

module circle_outline(R, r,ang_s,ang_e,ang_d) {
  union() {
    for (a = [ang_s:(ang_d):(ang_e-ang_d)]) {
      x0 = R*cos(a);
      y0 = R*sin(a);
      x1 = R*cos(a+ang_d);
      y1 = R*sin(a+ang_d);
      hull() {
        translate([x0,y0]) circle(r);
        translate([x1,y1]) circle(r);
      }
    }
  }
}

module face() {
  w = FACE_WIDTH;
  h = FACE_HEIGHT;
  earh = h/3;
  earw = w/5;

  _r = FACE_WIDTH / 12.5;
  _r1 = FACE_WIDTH / 25;
  _r2 = FACE_WIDTH / 33.5;

  _ds = FACE_WIDTH/50;
  _ds1 = FACE_HEIGHT/6;
  _ds2 = FACE_WIDTH/8.5;
  _ds3 = FACE_HEIGHT/5.25;

  _nose_r = FACE_HEIGHT/22.25;

  difference() {

    // face and ears
    //
    union() {
      square([w,h], center=true);
      translate([-w/2, h/2]) polygon([[0,0],[0,earh],[1,earh],[earw,0]]);
      translate([w/2, h/2]) polygon([[0,0],[0,earh],[-1,earh],[-earw,0]]);
    }

    // eyebrow left
    //
    //translate([-w/3.3 - 3.75, h/24 + 5.75]) circle_outline(2,1, 90,170, 10);
    translate([-w/3.3 - _r2, h/24 + _ds3]) circle_outline(_r1, _ds, 90,170, 10);

    // eye left
    //
    //translate([-w/3.3,h/24]) circle_outline(3.75,1, 0, -180, -10);
    translate([-w/3.3,h/24]) circle_outline(_r, _ds, 0, -180, -10);

    // eyebrow right
    //
    //translate([ w/3.3 + 3.75, h/24 + 5.75]) circle_outline(2,1, 90,10, -10);
    translate([ w/3.3 + _r2, h/24 + _ds3]) circle_outline(_r1, _ds, 90,10, -10);

    // eye right
    //
    //translate([ w/3.3,h/24]) circle_outline(3.75,1, 0, -180, -10);
    translate([ w/3.3,h/24]) circle_outline(_r, _ds, 0, -180, -10);

    //translate([-(w/3.3 + 3.75 + 2), -h/24 - 5]) circle(1.5);
    //translate([ (w/3.3 + 3.75 + 2), -h/24 - 5]) circle(1.5);

    translate([-(w/3.3 + _ds2), -h/24 - _ds1]) circle(_r2);
    translate([ (w/3.3 + _ds2), -h/24 - _ds1]) circle(_r2);

    // mount and nose
    translate([0,-1])
    union() {
      //translate([0,1]) circle(1.35);
      //translate([-w/16,0]) circle_outline(w/16, 1, 0, -140, -10);
      //translate([ w/16,0]) circle_outline(w/16, 1, 180,180+140, 10);
      translate([0,1]) circle(_nose_r);
      translate([-w/16,0]) circle_outline(w/16, _ds, 0, -140, -10);
      translate([ w/16,0]) circle_outline(w/16, _ds, 180,180+140, 10);
    }

  }
}

module top() {
  square([FACE_WIDTH, BODY_LENGTH], center=true);
}

module side_left() {
  _mt = MATERIAL_THICKNESS;
  H = FACE_HEIGHT*sin(FACE_TILT);
  dw = FACE_HEIGHT*cos(FACE_TILT);
  w = BODY_LENGTH;

  __x = _mt/tan(FACE_TILT);
  union() {
    square([w, H], center=true);
    translate([w/2,-H/2]) polygon([[0,0],[0,H],[dw,0]]);

/*
    difference() {
      translate([-_mt/2,,H/2 + _mt/2])
        square([w + _mt, _mt], center=true);
      translate([w/2,H/2]) polygon([[0,0],[-__x,_mt],[0,_mt]]);
    }
*/

    translate([-(w/2 + _mt/2), 0])
      square([_mt, H], center=true);
  }
}

module side_right() {
  _mt = MATERIAL_THICKNESS;
  H = FACE_HEIGHT*sin(FACE_TILT);
  dw = FACE_HEIGHT*cos(FACE_TILT);
  w = BODY_LENGTH;

  __x = _mt/tan(FACE_TILT);
  union() {
    square([w, H], center=true);
    translate([-w/2,-H/2]) polygon([[0,0],[0,H],[-dw,0]]);

/*
    difference() {
      translate([_mt/2,,H/2 + _mt/2])
        square([w + _mt, _mt], center=true);
      translate([-w/2,H/2]) polygon([[0,0],[0,_mt],[__x,_mt]]);
    }
*/

    translate([w/2 + _mt/2, 0])
      square([_mt, H], center=true);
  }
}

module back() {
  h = FACE_HEIGHT*sin(FACE_TILT);
  w = FACE_WIDTH;

  square([w,h], center=true);
}

module render_group1() {
  _notch = 5;
  difference() {
    union() {
      top();
      translate([0,BODY_LENGTH/2 + BODY_HEIGHT/2 + BEND_C90]) back();

      translate([0,BODY_LENGTH/2 +  BEND_C90/2])
        square([FACE_WIDTH-_notch, BEND_C90], center=true);

      translate([-(FACE_WIDTH/2 + BEND_C90 + BODY_HEIGHT/2), 0])
        rotate(-90, [0,0,1])
        side_left();

      translate([-(FACE_WIDTH/2 + BEND_C90/2), 0])
        square([BEND_C90,BODY_LENGTH-_notch], center=true);

      translate([ (FACE_WIDTH/2 + BEND_C90 + BODY_HEIGHT/2), 0])
        rotate( 90, [0,0,1])
        side_right();

      translate([ (FACE_WIDTH/2 + BEND_C90/2), 0])
        square([BEND_C90,BODY_LENGTH-_notch], center=true);
    }

    translate([0,BODY_LENGTH/2])
    union() {
      translate([-FACE_WIDTH/2,0]) square([0.5,0.5], center=true);
      translate([FACE_WIDTH/2,0]) square([0.5,0.5], center=true);
      square([0.5,0.5], center=true);
      translate([FACE_WIDTH/4,0]) square([0.5,0.5], center=true);
      translate([-FACE_WIDTH/4,0]) square([0.5,0.5], center=true);
    } 



  }
}


module render_group0() {

  difference() {
    union() {

/*
      translate([FACE_WIDTH/2 + BEND_C, -FACE_HEIGHT/2])
        rotate(90-FACE_TILT, [0,0,1])
        translate([BODY_LENGTH/2 + (UNDER_LENGTH - BODY_LENGTH),BODY_HEIGHT/2])
        side_right();

      translate([-(FACE_WIDTH/2 + BEND_C), -FACE_HEIGHT/2])
        rotate(FACE_TILT-90, [0,0,1])
        translate([-(BODY_LENGTH/2 + (UNDER_LENGTH - BODY_LENGTH)),BODY_HEIGHT/2])
        side_left();
*/

      face();

/*
      translate([-FACE_WIDTH/2 - BEND_C/2, 0])
        square([BEND_C, FACE_HEIGHT], center=true);
      translate([ FACE_WIDTH/2 + BEND_C/2, 0])
        square([BEND_C, FACE_HEIGHT], center=true);
*/
    }
    translate([-FACE_WIDTH/2 - BEND_C/2,0]) square([0.5,0.5], center=true);
    translate([-FACE_WIDTH/2 - BEND_C/2, FACE_HEIGHT/2]) square([0.5,0.5], center=true);
    translate([-FACE_WIDTH/2 - BEND_C/2, FACE_HEIGHT/4]) square([0.5,0.5], center=true);
    translate([-FACE_WIDTH/2 - BEND_C/2,-FACE_HEIGHT/2]) square([0.5,0.5], center=true);
    translate([-FACE_WIDTH/2 - BEND_C/2,-FACE_HEIGHT/4]) square([0.5,0.5], center=true);

    translate([ FACE_WIDTH/2 + BEND_C/2,0]) square([0.5,0.5], center=true);
    translate([ FACE_WIDTH/2 + BEND_C/2, FACE_HEIGHT/2]) square([0.5,0.5], center=true);
    translate([ FACE_WIDTH/2 + BEND_C/2, FACE_HEIGHT/4]) square([0.5,0.5], center=true);
    translate([ FACE_WIDTH/2 + BEND_C/2,-FACE_HEIGHT/2]) square([0.5,0.5], center=true);
    translate([ FACE_WIDTH/2 + BEND_C/2,-FACE_HEIGHT/4]) square([0.5,0.5], center=true);
  }
}

render_group0();
translate([0,105]) render_group1();
