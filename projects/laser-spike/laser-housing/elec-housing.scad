MAIN_W = 100;
MAIN_H = 200;

X_R = 20;
SCREW_R=5;

FN=32;

RELIEF_H=10;
RELIEF_W=16;

module plate() {
  
  difference() {
    union() {
      square([MAIN_W, MAIN_H], center=true);
      
      hull() {
        circle(X_R);
        translate([-MAIN_W/2, MAIN_H/2]) circle(X_R, $fn=FN);
      };
      
      hull() {
        circle(X_R);
        translate([ MAIN_W/2, MAIN_H/2]) circle(X_R, $fn=FN);
      };
      
      hull() {
        circle(X_R);
        translate([-MAIN_W/2,-MAIN_H/2]) circle(X_R, $fn=FN);
      };
      
      hull() {
        circle(X_R);
        translate([ MAIN_W/2,-MAIN_H/2]) circle(X_R, $fn=FN);
      };
    };
    
    // screw holes
    //
    translate([ MAIN_W/2,-MAIN_H/2]) circle(SCREW_R, $fn=FN);
    translate([-MAIN_W/2,-MAIN_H/2]) circle(SCREW_R, $fn=FN);
    translate([-MAIN_W/2, MAIN_H/2]) circle(SCREW_R, $fn=FN);
    translate([ MAIN_W/2, MAIN_H/2]) circle(SCREW_R, $fn=FN);
    
    // strain relief
    translate([RELIEF_W,MAIN_H/2 - RELIEF_H])  circle(SCREW_R, $fn=FN);
    translate([-RELIEF_W,MAIN_H/2 - RELIEF_H])  circle(SCREW_R, $fn=FN);
  }
    
  
}

plate();