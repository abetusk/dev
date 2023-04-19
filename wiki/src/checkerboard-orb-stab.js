//
// To the extent possible under law, the person who associated CC0 with
// this project has waived all copyright and related or neighboring rights
// to this file.
// 
// You should have received a copy of the CC0 legalcode along with this
// work.  If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
//


let alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
var fxhash = "oo" + Array(49).fill(0).map(_=>alphabet[(Math.random()*alphabet.length)|0]).join('')
let b58dec = str=>[...str].reduce((p,c)=>p*alphabet.length+alphabet.indexOf(c)|0, 0)
let fxhashTrunc = fxhash.slice(2)
let regex = new RegExp(".{" + ((fxhash.length/4)|0) + "}", 'g')
let hashes = fxhashTrunc.match(regex).map(h => b58dec(h))
let sfc32 = (a, b, c, d) => {
  return () => {
    a |= 0; b |= 0; c |= 0; d |= 0
    var t = (a + b | 0) + d | 0
    d = d + 1 | 0
    a = b ^ b >>> 9
    b = c + (c << 3) | 0
    c = c << 21 | c >>> 11
    c = c + t | 0
    return (t >>> 0) / 4294967296
  }
}
var fxrand = sfc32(...hashes)

//debug
//fxhash = 'ookFPxFBEkqMV3nM5Q4wq8yGM5u17XzjmaZWWCbkHPit5q2wzJZ'


function _irnd(n) {
  //return Math.floor(Math.random()*n);
  return Math.floor(fxrand()*n);
}

// in bounds
//
function _ib(pos, n) {
  if ((pos.x >= 0) &&
      (pos.y >= 0) &&
      (pos.x < n) &&
      (pos.y < n) ) {
    return true;
  }

  return false;
}

// linear increasing permutation schedule
//
function perm_lin_inc(n) {
  let p = [];
  for (let ii=0; ii<n; ii++) {
    p.push( _irnd(ii+1) );
  }
  return p;
}

function _pusha(aa, a) {
  let v = [];
  for (let i=0; i<a.length; i++) {
    v.push(a[i]);
  }
  aa.push(v);
}

// enumerate linear increasing permutation
// array
//
function enum_f(n) {
  let res = [];

  let p = [];
  for (let ii=0; ii<n; ii++) { p.push(0); }

  let lsp = n-1;

  while (1) {
    let cur_idx = lsp;

    while (p[cur_idx] > cur_idx) {
      p[cur_idx] = 0;
      cur_idx--;
      if (cur_idx < 0) { break; }
      p[cur_idx]++;
    }
    if (cur_idx < 0) { break; }

    _pusha(res, p);

    p[lsp]++;
  }

  return res;
}

function sched_ribbon_tile(g_info, sched) {
  g_info.ribbon = [];

  let g = g_info.grid;
  let n = g_info.n;
  let ribbon_pnt = g_info.ribbon;

  let ribbon_len = [];
  let tile_id = 0;

  // initial starting positions
  //
  for (let d=0; d<n; d++) {
    let v = sched[d];
    let spos = { "x": d - v, "y" : v };
    g[ spos.x ][ spos.y ] = tile_id;

    g_info.ribbon_start.push( {"x": spos.x, "y": spos.y });
    ribbon_pnt.push( [ { "x":spos.x, "y": spos.y } ] );
    tile_id++;
  }
  for (let i=0; i<n; i++) { ribbon_len.push(1); }

  // a little inefficient but walk the diagonal
  // 'wave front'
  //

  for (let d=0; d<(2*n-1); d++) {

    pos = { "x": d, "y": 0 };
    if (d >= n) {
      pos.x = n-1;
      pos.y = d-n+1;
    }

    let pos_sched = [];
    while ( _ib(pos, n) ) {
      pos_sched.push( { "x": pos.x, "y": pos.y } );
      pos.x--;
      pos.y++;
    }

    while (pos_sched.length > 0) {

      for (let idx=0; idx<pos_sched.length; idx++) {
        let p = pos_sched[idx];
        let nxt_r = {"x": p.x+1, "y": p.y+0 };
        let nxt_u = {"x": p.x+0, "y": p.y+1 };

        let x = p.x;
        let y = p.y;

        // degenerate condition
        //
        if ((!_ib(nxt_r, n)) && (!_ib(nxt_u,n))) {
          pos_sched.pop();
          break;
        }

        // ribbon complete, ignore
        //
        let v = g[p.x][p.y];
        if (ribbon_len[v] >= n) {
          pos_sched[idx] = pos_sched[ pos_sched.length-1 ];
          pos_sched.pop();
          break;
        }

        // on edge
        //
        if ( _ib(nxt_r, n) &&
             (!_ib(nxt_u, n)) ) {
          g[ nxt_r.x ][ nxt_r.y ] = v;
          ribbon_pnt[v].push( { "x":nxt_r.x, "y": nxt_r.y });
          ribbon_len[v]++;

          pos_sched[idx] = pos_sched[ pos_sched.length-1 ];
          pos_sched.pop();
          break;
        }

        // on edge
        //
        if ( _ib(nxt_u, n) &&
             (!_ib(nxt_r, n)) ) {
          g[ nxt_u.x ][ nxt_u.y ] = v;
          ribbon_pnt[v].push( { "x":nxt_u.x, "y": nxt_u.y });
          ribbon_len[v]++;

          pos_sched[idx] = pos_sched[ pos_sched.length-1 ];
          pos_sched.pop();
          break;
        }

        let val_u = g[ nxt_u.x ][ nxt_u.y ];
        let val_r = g[ nxt_r.x ][ nxt_r.y ];

        if ( (val_u < 0) && (val_r >= 0) ) {
          g[ nxt_u.x ][ nxt_u.y ] = g[x][y];
          ribbon_pnt[g[x][y]].push( { "x":nxt_u.x, "y": nxt_u.y });
          ribbon_len[g[x][y]]++;

          pos_sched[idx] = pos_sched[ pos_sched.length-1 ];
          pos_sched.pop();
          break;
        }

        if ( (val_u >= 0) && (val_r < 0) ) {
          g[ nxt_r.x ][ nxt_r.y ] = g[x][y];
          ribbon_pnt[g[x][y]].push( { "x":nxt_r.x, "y": nxt_r.y });
          ribbon_len[g[x][y]]++;

          pos_sched[idx] = pos_sched[ pos_sched.length-1 ];
          pos_sched.pop();
          break;
        }

      }

    }
  }


}

function random_ribbon_tile(g_info) {

  g_info.ribbon = [];

  let g = g_info.grid;
  let n = g_info.n;
  let ribbon_pnt = g_info.ribbon;

  let ribbon_len = [];
  let tile_id = 0;

  // initial starting positions
  //
  for (let d=0; d<n; d++) {
    let v = _irnd(d+1);
    let spos = { "x": d - v, "y" : v };
    g[ spos.x ][ spos.y ] = tile_id;

    g_info.ribbon_start.push( {"x": spos.x, "y": spos.y });
    ribbon_pnt.push( [ { "x":spos.x, "y": spos.y } ] );
    tile_id++;
  }
  for (let i=0; i<n; i++) { ribbon_len.push(1); }

  // a little inefficient but walk the diagonal
  // 'wave front'
  //

  for (let d=0; d<(2*n-1); d++) {

    pos = { "x": d, "y": 0 };
    if (d >= n) {
      pos.x = n-1;
      pos.y = d-n+1;
    }

    let pos_sched = [];
    while ( _ib(pos, n) ) {
      pos_sched.push( { "x": pos.x, "y": pos.y } );
      pos.x--;
      pos.y++;
    }

    while (pos_sched.length > 0) {

      for (let idx=0; idx<pos_sched.length; idx++) {
        let p = pos_sched[idx];
        let nxt_r = {"x": p.x+1, "y": p.y+0 };
        let nxt_u = {"x": p.x+0, "y": p.y+1 };

        let x = p.x;
        let y = p.y;

        // degenerate condition
        //
        if ((!_ib(nxt_r, n)) && (!_ib(nxt_u,n))) {
          pos_sched.pop();
          break;
        }

        // ribbon complete, ignore
        //
        let v = g[p.x][p.y];
        if (ribbon_len[v] >= n) {
          pos_sched[idx] = pos_sched[ pos_sched.length-1 ];
          pos_sched.pop();
          break;
        }

        // on edge
        //
        if ( _ib(nxt_r, n) &&
             (!_ib(nxt_u, n)) ) {
          g[ nxt_r.x ][ nxt_r.y ] = v;
          ribbon_pnt[v].push( { "x":nxt_r.x, "y": nxt_r.y });
          ribbon_len[v]++;

          pos_sched[idx] = pos_sched[ pos_sched.length-1 ];
          pos_sched.pop();
          break;
        }

        // on edge
        //
        if ( _ib(nxt_u, n) &&
             (!_ib(nxt_r, n)) ) {
          g[ nxt_u.x ][ nxt_u.y ] = v;
          ribbon_pnt[v].push( { "x":nxt_u.x, "y": nxt_u.y });
          ribbon_len[v]++;

          pos_sched[idx] = pos_sched[ pos_sched.length-1 ];
          pos_sched.pop();
          break;
        }

        let val_u = g[ nxt_u.x ][ nxt_u.y ];
        let val_r = g[ nxt_r.x ][ nxt_r.y ];

        if ( (val_u < 0) && (val_r >= 0) ) {
          g[ nxt_u.x ][ nxt_u.y ] = g[x][y];
          ribbon_pnt[g[x][y]].push( { "x":nxt_u.x, "y": nxt_u.y });
          ribbon_len[g[x][y]]++;

          pos_sched[idx] = pos_sched[ pos_sched.length-1 ];
          pos_sched.pop();
          break;
        }

        if ( (val_u >= 0) && (val_r < 0) ) {
          g[ nxt_r.x ][ nxt_r.y ] = g[x][y];
          ribbon_pnt[g[x][y]].push( { "x":nxt_r.x, "y": nxt_r.y });
          ribbon_len[g[x][y]]++;

          pos_sched[idx] = pos_sched[ pos_sched.length-1 ];
          pos_sched.pop();
          break;
        }

      }

    }
  }

}

function init_grid(n) {
  let g = [];
  for (let ii=0; ii<n; ii++) {
    g.push([]);
    for (let jj=0; jj<n; jj++) {
      g[ii].push(-1);
    }
  }

  return g;
}

function _fmt(s, n) {
  let m = s.length;
  for (let i=0; i<(n-m); i++) {
    s = " " + s;
  }
  return s;
}

function ascii_grid(g) {
  let n = g.length;
  for (let y=(n-1); y>=0; y--) {

    let s_u = "";
    let s_v = "";
    for (let x=0; x<n; x++) {

      let yp = y+1;
      let yn = y-1;
      let xp = x+1;
      let xn = x-1;

      let val_u = -1,
          val_d = -1,
          val_r = -1,
          val_l = -1;

      if (xn >= 0) { val_l = g[xn][y]; }
      if (xp < n)  { val_r = g[xp][y]; }
      if (yn >= 0) { val_d = g[x][yn]; }
      if (yp < n)  { val_u = g[x][yp]; }

      if (val_u != g[x][y]) { s_u += "---"; }
      else { s_u += "   "; }

      if (val_l != g[x][y]) { s_v += "|  "; }
      else { s_v += "   "; }

    }
    s_v += "|";
    console.log(s_u);
    console.log(s_v);
  }

  let _s = '';
  for (let x=0; x<n; x++) {
    _s += "---";
  }
  console.log(_s);
}

function print_grid(g, reverse_y) {
  reverse_y = ((typeof reverse_y === "undefined") ? false : reverse_y);

  let n = g.length;
  let y_s = 0,
      y_d = 1,
      y_B = n;

  if (reverse_y) {
    y_s = n-1;
    y_d = -1;
    y_B = -1;
  }

  for (let y=y_s; y!=y_B; y+=y_d) {
    let s = "";
    for (let x=0; x<n; x++) {
      let _ns = g[x][y].toString();
      if (g[x][y] < 0) {
        _ns = ".";
      }
      let nstr = _fmt(_ns, 2);
      s += " " + nstr;
    }
    console.log(s);
  }

}

function pnt_ribbon(g_info, reverse_y, only_upper) {
  reverse_y = ((typeof reverse_y === "undefined") ? false : reverse_y);
  only_upper = ((typeof only_upper === "undefined") ? false : only_upper);
  let ribbon = g_info.ribbon;

  //only_upper = true;

  let n = g_info.n;

  let dx = 0.5;
  let dy = 0.5;

  let _eps = (1/1024);

  let ribbon_pnt = [];

  let mm = [ 0, 0, 0, 0 ];

  for (let idx=0; idx<ribbon.length; idx++) {
    let p = ribbon[idx];

    if (idx == 0) {
      mm[0] = p[0].x - dx;
      mm[1] = p[0].y - dy;
      mm[2] = p[0].x + dx;
      mm[3] = p[0].y - dy;
    }

    let lines = [];
    lines.push( [ p[0].x - dx, p[0].y - dy ] );
    lines.push( [ p[0].x + dx, p[0].y - dy ] );
    for (let ii=1; ii<p.length; ii++) {
      let prv = p[ii-1];
      let cur = p[ii];

      if ( (cur.x - dx) < mm[0] ) { mm[0] = cur.x - dx; }
      if ( (cur.y - dy) < mm[1] ) { mm[1] = cur.y - dy; }
      if ( (cur.x + dx) > mm[2] ) { mm[2] = cur.x + dx; }
      if ( (cur.y + dy) > mm[3] ) { mm[3] = cur.y + dy; }

      if ( (prv.x - dx) < mm[0] ) { mm[0] = prv.x - dx; }
      if ( (prv.y - dy) < mm[1] ) { mm[1] = prv.y - dy; }
      if ( (prv.x + dx) > mm[2] ) { mm[2] = prv.x + dx; }
      if ( (prv.y + dy) > mm[3] ) { mm[3] = prv.y + dy; }

      if ( Math.abs(cur.y - prv.y) < _eps) {
        lines.push( [ cur.x - dx, cur.y - dy ] );
        lines.push( [ cur.x + dx, cur.y - dy ] );
      }
      else {
        lines.push( [ cur.x + dx, prv.y - dy ] );
        lines.push( [ cur.x + dx, prv.y + dy ] );
      }

    }

    let m = p.length-1;

    lines.push( [ p[m].x + dx, p[m].y + dy ] );

    if (!only_upper) {
      lines.push( [ p[m].x - dx, p[m].y + dy ] );
      for (let ii=(m-1); ii>=0; ii--) {
        let prv = p[ii+1];
        let cur = p[ii];

        if ( Math.abs(cur.y - prv.y) < _eps) {
          lines.push( [ cur.x + dx, cur.y + dy ] );
          lines.push( [ cur.x - dx, cur.y + dy ] );
        }
        else {
          lines.push( [ cur.x - dx, prv.y + dy ] );
          lines.push( [ cur.x - dx, prv.y - dy ] );
        }
      }
      lines.push( [ p[0].x - dx, p[0].y + dy ] );
      lines.push( [ p[0].x - dx, p[0].y - dy ] );
    }

    ribbon_pnt.push(lines);

  }

  let minx = -0.5,
      maxx = (n-1) + 0.5,
      miny = -0.5,
      maxy = (n-1) + 0.5;

  if (only_upper) {
    let lines = [];
    lines.push( [mm[0],mm[1]] );
    lines.push( [mm[0],mm[3]] );
    lines.push( [mm[2],mm[3]] );

    ribbon_pnt.push(lines);
  }

  if (reverse_y) {
    miny = - ((n-1) + 0.5);
    maxy = 0.5;
    for (let idx=0; idx<ribbon_pnt.length; idx++) {
      for (let ii=0; ii<ribbon_pnt[idx].length; ii++) {
        ribbon_pnt[idx][ii][1] *= -1;
      }
    }
  }

  let spanx = Math.abs(maxx - minx),
      spany = Math.abs(maxy - miny);

  let sx = minx,
      sy = -miny;

  //if (reverse_y) { sy *= -1; }

  for (let idx=0; idx<ribbon_pnt.length; idx++) {
    for (let ii=0; ii<ribbon_pnt[idx].length; ii++) {
      ribbon_pnt[idx][ii][0] = 
        ((ribbon_pnt[idx][ii][0] + sx)/spanx);
      ribbon_pnt[idx][ii][1] = 
        ((ribbon_pnt[idx][ii][1] + sy)/spany);
    }
  }

  return ribbon_pnt;

}

function ribbon_svg(g_info, svg_info) {
  let default_svg_info = {
    "use_header": true,
    "viewbox": [0,0,1,1],
    "stroke-width" : 1/16
  };
  svg_info = ((typeof svg_info === "undefined") ? default_svg_info : svg_info );

  let viewbox_w = svg_info.viewbox[2];
  let viewbox_h = svg_info.viewbox[3];

  let scale = ((viewbox_w < viewbox_h) ? viewbox_w : viewbox_h);
  let offset = [0,0];
  if (viewbox_w < viewbox_h) {
    offset = [ 0, (viewbox_h - viewbox_w)/2 ];
  }
  else {
    offset = [ (viewbox_w - viewbox_h)/2, 0 ];
  }

  let fi = [];
  let default_fill = "rgba(200,200,200,0.95)";
  for (let ii=0; ii<g_info.n; ii++) {
    fi.push( default_fill );
  }

  if ("fill_a" in svg_info) {
    fi = svg_info.fill_a;
  }


  //let sw = (1/(8*g_info.n));
  //let sw = (1/(16*g_info.n));
  //let sw = (1);
  let sw = svg_info['stroke-width'];
  let st = 'rgba(25,25,25, 0.95)';
  let sw_s = sw.toString();
  //let vb = [ -sw, -sw, 1+(2*sw), 1+(2*sw) ];
  let vb = [ 0, 0, viewbox_w, viewbox_h ];
  let vb_s = vb.map( t => t.toString() ).join(" ");

  let svg_header = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="' + vb_s + '" stroke="currentColor">';
  let svg_footer = '</svg>';

  let svg_body = '';

  // normalized to be in a [0,1]x[0,1] square
  //
  let rp = pnt_ribbon(g_info, true, false);

  for (let idx=0; idx<rp.length; idx++) {
    let x = rp[idx][0][0];
    let y = rp[idx][0][1];

    let path_pfx = '<path stroke-linecap="round" stroke-linejoin="round" stroke="' + st + '" stroke-width="' + sw_s + '" fill="' + fi[idx] + '" d="';
    let path_sfx = '" />';

    x *= (scale - 2*sw);
    y *= (scale - 2*sw);
    x += offset[0];
    y += offset[1];
    //let path_s = 'M ' + rp[idx][0][0].toString() + ' ' + rp[idx][0][1].toString() ;
    let path_s = "M " + x.toString() + " " + y.toString();
    for (let ii=1; ii<rp[idx].length; ii++) {
      let x = rp[idx][ii][0];
      let y = rp[idx][ii][1];
      x *= (scale - 2*sw);
      y *= (scale - 2*sw);
      x += offset[0];
      y += offset[1];

      //path_s += 'L ' + rp[idx][ii][0].toString() + ' ' + rp[idx][ii][1].toString();
      path_s += ' L ' + x.toString() + ' ' + y.toString();
    }
    svg_body += path_pfx + path_s + path_sfx + '\n';
  }

  if (svg_info.use_header == true ) {
    return [ svg_header, svg_body, svg_footer].join("\n");
  }

  return svg_body;


}

function fisher_yates_shuffle(a) {
  var t, n = a.length;
  for (var i=0; i<(n-1); i++) {
    var idx = i + Math.floor(Math.random()*(n-i));
    t = a[i];
    a[i] = a[idx];
    a[idx] = t;
  }
}

function svg_ribbon_sheet(n, svg_info, row_n, col_n) {
  let sched_a  = enum_f(n);

  let m = sched_a.length;

  //let row_n = 12;
  //let col_n = 10;

  let view_w = svg_info.viewbox[2];
  let view_h = svg_info.viewbox[3];

  let w = view_w;
  let h = view_h;
  let extent = w;
  if (extent < h) {
    extent = h;
  }
  let scale = 0.65*view_h/row_n;

  let sx = 0.5 * view_w / col_n;
  let sy = 0.5 * view_h / row_n;

  sy -= 0.25 * view_h / row_n;
  sx -= 0.25 * view_w / col_n;

  sy = (0.5 * view_h / (row_n+1)) - (0.25*view_h/(row_n+1));

  let dx = view_w / col_n;
  let dy = view_h / row_n;

  dy = view_h / (row_n+1);

  //dy = view_h / (row_n+1);

  let svg_a = [ svg_info.svg_header ];

  let dv = 10;
  let sv = 255 - 10 - (n*dv);
  let rv = 3;

  let fill_a = [];
  for (let ii=0; ii<n; ii++) {
    let _r = Math.floor(sv + ii*dv + _irnd(rv) ).toString();
    let _g = Math.floor(sv + ii*dv + _irnd(rv) ).toString();
    let _b = Math.floor(sv + ii*dv + _irnd(rv) ).toString();
    fill_a.push( "rgba(" + [_r,_g,_b].join(",") + ",0.95)" );
  }
  fisher_yates_shuffle(fill_a);

  let sched_idx=0;
  for (let row_idx = 0; row_idx < row_n; row_idx++) {
    for (let col_idx = 0; col_idx < col_n; col_idx++) {
      let x = dx * col_idx + sx;
      let y = dy * row_idx + sy;

      let g_header = '<g transform="translate(' + x.toString() + ' ' + y.toString() + ') scale(' + scale.toString() + ')">';
      let g_footer = '</g>';

      let _svgh = {
        "use_header": false,
        "fill_a": fill_a,
        "stroke-width": (1/48),
        "viewbox": [0,0,1,1]
      };

      let grid_info = {
        'n': n,
        "ribbon_start": [],
        "ribbon":[],
        "grid": []
      };
      grid_info.grid = init_grid(grid_info.n);

      sched_ribbon_tile(grid_info, sched_a[sched_idx]);
      let g_body = ribbon_svg(grid_info, _svgh);
      sched_idx++;

      svg_a.push(g_header);
      svg_a.push(g_body);
      svg_a.push(g_footer);
    }
  }

  svg_a.push(svg_info.svg_footer);

  return svg_a.join("\n");

  //console.log(sched_a);
}

function _printge(ge) {
  let n = Math.floor(Math.sqrt(ge.length));
  for (let r=0; r<n; r++) {
    let s = "";
    for (let c=0; c<n; c++) {
      s += " " + ge[ r*n + c ].toString();
    }
    console.log(s);
  }
}

function permute(g, x) {
  let y = [];
  let n = g.length;

  for (let ii=0; ii<n; ii++) {
    y.push( x[ g[ii] ] );
  }

  return y;
}

function checkerboard_init(info) {


  let n = info.n;

  let m = n*n;
  let M =  (1<<m);

  let _eps = (1/(m+1));

  info.X = [];
  info.G = [];


  // lsb first
  //
  for (let idx=0; idx<M; idx++) {
    let v = [];
    for (let b=0; b<m; b++) {
      if ( (idx & (1<<b)) == 0 )  { v.push(0); }
      else                        { v.push(1) }

    }
    info.X.push(v);
  }


  let g_gen = [];

  let g_ident = [];
  for (let ii=0; ii<m; ii++) { g_ident.push(ii); }
  g_gen.push(g_ident);

  let g_mx = [];
  let g_my = [];
  for (let ii=0; ii<m; ii++) {
    g_mx.push(ii);
    g_my.push(ii);
  }
  for (let ii=0; ii<(n/2); ii++) {
    for (let jj=0; jj<n; jj++) {
      let idx_src = n*ii + jj;
      let idx_dst = n*(n-ii-1) + jj;

      let t = g_mx[idx_src];
      g_mx[idx_src] = g_mx[idx_dst];
      g_mx[idx_dst] = t;
    }
  }
  g_gen.push(g_mx);

  for (let ii=0; ii<n; ii++) {
    for (let jj=0; jj<(n/2); jj++) {
      let idx_src = n*ii + jj;
      let idx_dst = n*ii + (n-jj-1);

      let t = g_my[idx_src];
      g_my[idx_src] = g_my[idx_dst];
      g_my[idx_dst] = t;
    }
  }
  g_gen.push(g_my);

  let g_r = [];
  for (let ii=0; ii<m; ii++) { g_r.push(ii); }
  for (let r=0; r<n; r++) {
    for (let c=0; c<n; c++) {

      let a = 1;
      let d = ((n-1)/2);

      let xy    = [ a*r - d, a*c - d ];
      let xy_r  = [ Math.floor(-(xy[1]/a) + d ), Math.floor((xy[0]/a) + d )  ];
      xy_r  = [ -(xy[1]/a) + d , (xy[0]/a) + d   ];

      let idx_src = n*r + c;
      let idx_dst = n*xy_r[0] + xy_r[1];

      g_r[idx_dst] = g_ident[idx_src];
      
    }
  }
  g_gen.push(g_r);

  let g_uniq = {};

  for (let ii=0; ii<g_gen.length; ii++) {
    let g_key = g_gen[ii].join(":");
    g_uniq[g_key] = g_gen[ii];
    info.G.push(g_gen[ii]);
  }

  let still_adding = true;
  while (still_adding) {

    still_adding = false;

    for (let ii=0; ii<info.G.length; ii++) {
      for (let jj=0; jj<info.G.length; jj++) {
        let z = permute(info.G[ii], info.G[jj]);
        let z_key = z.join(":");

        if (!(z_key in g_uniq)) {
          g_uniq[z_key] = z;
          info.G.push(z);
          still_adding = true;
          break;
        }

        z = permute(info.G[jj], info.G[ii]);
        z_key = z.join(":");

        if (!(z_key in g_uniq)) {
          g_uniq[z_key] = z;
          info.G.push(z);
          still_adding = true;
          break;
        }

      }
      if (still_adding) { break; }
    }
  }


}

function checkerboard_print(info) {

  let n = info.n;
  let m = n*n;
  let M = (1<<m);

  console.log("## G", info.G.length);
  for (let ii=0; ii<info.G.length; ii++) {
    console.log("---");
    _printge(info.G[ii]);
  }

  console.log("===");

  console.log("## X", info.X.length);
  for (let idx=0; idx<info.X.length; idx++) {
    console.log("\n# c" + idx.toString());
    for (let r=0; r<n; r++) {
      let s = "";
      for (let c=0; c<n; c++) {
        s += ( (info.X[idx][ n*r + c ] > 0) ? '*' : '.' );
      }
      console.log(s);
    }
  }

}

if (typeof module !== "undefined") {

  let n = 3;

  let grid_info = {
    "n": n,
    "X": [],
    "G": []
  };

  checkerboard_init(grid_info);
  checkerboard_print(grid_info);

}

if (false) {


  let svg_info = {

    "viewbox": [ 0, 0, 25.4*18, 25.4*24 ],
    "viewbox_": '0 0 457.2 609.6',

    "use_header": false,
    "svg_header":  '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 457.2 609.6" stroke="currentColor">',
    "svg_footer": '</svg>',

    //"g_header": '<g transform="translate(10 10) scale(0.5)" >',
    "g_header": '<g transform="scale(0.5) translate(10 10)" >',
    "g_footer": '</g>'
  }

  let s = svg_ribbon_sheet(N, svg_info, 12, 10);
  //let s = svg_ribbon_sheet(N, svg_info, 6, 4);
  console.log(s);


  if (false) {
    grid_info.grid  = init_grid(N);

    sched = perm_lin_inc(N);

    //console.log(sched);

    //random_ribbon_tile(grid_info);
    sched_ribbon_tile(grid_info, sched);

    //print_grid(grid_info.grid, true);
    //ascii_grid(grid_info.grid);

    let svg_body = ribbon_svg(grid_info, svg_info);

    let a = [
      svg_info.svg_header,
      svg_info.g_header,
      svg_body,
      svg_info.g_footer,
      svg_info.svg_footer
    ];

    //console.log(ribbon_svg(grid_info));
    console.log( a.join("\n") );

    /*
    let rpnt = pnt_ribbon(grid_info, true);

    for (let idx=0; idx<rpnt.length; idx++) {
      console.log("\n\n");
      for (let ii=0; ii<rpnt[idx].length; ii++) {
        console.log(rpnt[idx][ii][0], rpnt[idx][ii][1]);
      }
    }
    */

    /*
    console.log(grid_info.ribbon_start);
    for (let i=0; i<grid_info.ribbon.length; i++) {
      console.log(i, grid_info.ribbon[i]);
    }
    */
  }

}
