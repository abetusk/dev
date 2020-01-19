// Licnese: CC0
//

function ilog3_f(n) {
  var B=1, k=0;

  if (n==0) { return -1; }
  if (n==1) { return 0; }
  for (B=1,k=0; k<31; k++) {
    B*=3;
    if (B>n) { return k; }
  }
  return -2;
}

function ilog3(n) {
  return Math.floor(Math.log(n)/Math.log(3));
}

function rotationShuffle(ab, s_pos) {
  var n = ab.length - s_pos;
  if ((n%2)!=0) { n--; }

  for (var k=0; k<n; k++) {
    //....

  }
}


function inPlaceShuffle(ab) {
  var n = ab.length;
  var n_log3_threshold = 2;

  if ((n%2)!=0) { n--; }
  if (n<2) { return 0; }

  var n_log3 = ilog3(n);
  var n_bulk = Math.pow(3, n_log3);
  var n_remain = n - n_bulk;

  var s_pos = 0;
  var n_tot = n;

  while (n_log3 > n_log3_threshold) {

    var g = 1;
    for (kpow=0; kpow<n_log3; kpow++) {

      var h = g;
      do {
        var next_h = (h*g) % n_bulk;

        var ele = s_pos + h;
        var next_ele = s_pos + next_h;

        h = next_h;
      } while (h != g);

      g *= 3;
    }

    s_pos += n_bulk;
    n_tot = n_remain;

    n_log3 = ilog3(n_tot);
    if (n_log3 <= n_log3_threshold) { break; }
    n_bulk = Math.pow(3, n_log3);
    n_remain = n - n_bulk;
  }

  rotationShuffle(ab, s_pos);

}

for (var n=0; n<1000; n++) {
  console.log(">>>", n, ilog3(n));
}
