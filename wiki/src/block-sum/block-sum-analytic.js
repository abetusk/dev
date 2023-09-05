//
// LICENSE: CC0
//


function cell2pos( cell, n ) {
  cell = Math.floor(cell);
  let x = cell % n;
  cell -= x;
  cell = Math.floor(cell / n);

  let y = cell % n;
  cell -= y;
  cell = Math.floor(cell / n);

  let z = cell % n;
  cell -= z;
  cell = Math.floor(cell / n);

  return [x,y,z];
}

function pos2cell(x,y,z,n) {
  return (z*n*n) + (y*n) + x;
}

function _check() {
  let N = 6;
  for (z=0; z<N; z++) {
    for (y=0; y<N; y++) {
      for (x=0; x<N; x++) {
        let cell = pos2cell(x,y,z,N);
        console.log([x,y,z], cell, cell2pos(cell, N));
      }
    }
  }
}

function printM(M, n) {
  let N = n*n*n;
  for (z=0; z<n; z++) {
    for (y=0; y<n; y++) {
      let line_str = [];
      for (x=0; x<n; x++) {
        line_str.push( M[ pos2cell(x,y,z,n) ].toString() );
      }
      console.log(line_str.join(" "));
    }
    console.log("");
  }
}

function fillM(M, n, s) {

  M[ pos2cell(0,0,0,n) ] = "m(0,0,0)";
  M[ pos2cell(s,0,0,n) ] = "m(s,0,0)";
  M[ pos2cell(0,s,0,n) ] = "m(0,s,0)";
  M[ pos2cell(0,0,s,n) ] = "m(0,0,s)";
  M[ pos2cell(0,s,s,n) ] = "m(0,s,s)";
  M[ pos2cell(s,0,s,n) ] = "m(s,0,s)";
  M[ pos2cell(s,s,0,n) ] = "m(s,s,0)";
  M[ pos2cell(s,s,s,n) ] = "m(s,s,s)";

  for (let x=1; x<s; x++) {
    M[ pos2cell(x,0,0,n) ] = "l(x,0,0)";
    M[ pos2cell(x,s,0,n) ] = "l(x,s,0)";
    M[ pos2cell(x,0,s,n) ] = "l(x,0,s)";
    M[ pos2cell(x,s,s,n) ] = "l(x,s,s)";
  }

  for (let y=1; y<s; y++) {
    M[ pos2cell(0,y,0,n) ] = "l(0,y,0)";
    M[ pos2cell(0,y,s,n) ] = "l(0,y,s)";
    M[ pos2cell(s,y,0,n) ] = "l(s,y,0)";
    M[ pos2cell(s,y,s,n) ] = "l(s,y,s)";
  }

  for (let z=1; z<s; z++) {
    M[ pos2cell(0,0,z,n) ] = "l(0,0,z)";
    M[ pos2cell(0,s,z,n) ] = "l(0,s,z)";
    M[ pos2cell(s,0,z,n) ] = "l(s,0,z)";
    M[ pos2cell(s,s,z,n) ] = "l(s,s,z)";
  }

  for (let x=1; x<s; x++) {
    for (let y=1; y<s; y++) {
      M[ pos2cell(x,y,0,n) ] = "p(x,y,0)";
      M[ pos2cell(x,y,s,n) ] = "p(x,y,s)";
    }
  }

  for (let x=1; x<s; x++) {
    for (let z=1; z<s; z++) {
      M[ pos2cell(x,0,z,n) ] = "p(x,0,z)";
      M[ pos2cell(x,s,z,n) ] = "p(x,s,z)";
    }
  }

  for (let y=1; y<s; y++) {
    for (let z=1; z<s; z++) {
      M[ pos2cell(0,y,z,n) ] = "p(0,y,z)";
      M[ pos2cell(s,y,z,n) ] = "p(s,y,z)";
    }
  }

  for (let z=1; z<s; z++) {
    for (let y=1; y<s; y++) {
      for (let x=1; x<s; x++) {
        M[pos2cell(x,y,z,n)] = "b(x,y,z)";
      }
    }
  }

  let pos = pos2cell(0,0,0,n);


}

function enumerate_sub_block(M, n, b) {
  let s = b+1;

  // last one [1,1,1] is the one we want as the destination
  //
  let sp = [ [0,0,0],
             [1,0,0],
             [0,1,0],
             [0,0,1],
             [1,1,0],
             [1,0,1],
             [0,1,1],
             [1,1,1] ];

  let block_list_all = [];

  let item_list = [
    "m(s,s,s)", "m(0,s,s)", "m(s,0,s)", "m(s,s,0)", "m(s,0,0)", "m(0,s,0)", "m(0,0,s)", "m(0,0,0)",
    "l(x,0,0)", "l(x,0,s)", "l(x,s,0)", "l(x,s,s)",
    "l(0,y,0)", "l(0,y,s)", "l(s,y,0)", "l(s,y,s)",
    "l(0,0,z)", "l(0,s,z)", "l(s,0,z)", "l(s,s,z)",
    "p(x,y,0)", "p(x,y,s)", "p(x,0,z)", "p(x,s,z)", "p(0,y,z)", "p(s,y,z)",
    "b(x,y,z)" ];

  let item_map = {};
  for (let ii=0; ii<item_list.length; ii++) {
    item_map[ item_list[ii] ] = ii;
  }

  for (let p_idx in sp) {
    let p = sp[p_idx];

    let block_map = {};
    let block_list = [];

    for (let z=p[2]; z<=(p[2]+b); z++) {
      for (let y=p[1]; y<=(p[1]+b); y++) {
        for (let x=p[0]; x<=(p[0]+b); x++) {

          let v = M[ pos2cell(x,y,z,n) ];
          if (!(v in block_map)) {
            block_map[v] = true;
            block_list.push(v);
          }

        }
      }
    }

    block_list_all.push(block_list);

  }


  let ws = 8;
  let ws_str = "";
  for (let ii=0; ii<ws; ii++) { ws_str += " "; }

  for (let ii=0; ii<block_list_all.length; ii++) {
    let line_a = [];
    for (let jj=0; jj<item_list.length; jj++) { line_a.push(ws_str); }
    for (let jj=0; jj<block_list_all[ii].length; jj++) {
      let v = block_list_all[ii][jj];
      let pos = item_map[ v ];
      line_a[pos] = v;
    }
    let block_id = "B[" + sp[ii][0].toString() + "," + sp[ii][1].toString() + "," + sp[ii][2].toString() + "]";
    console.log( block_id + ": " + line_a.join(" ") );
  }

}

let n = 6;
let N = n*n*n;
let M = [];

let b = 3;

for (let cell=0; cell<N; cell++) {
  M.push(0);
}

fillM(M,n, b+1);
printM(M,n);


enumerate_sub_block(M, n, b);
