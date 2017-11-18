#!/bin/bash

ppi=300
mm_to_inch=25.40

g_scale="1.0"
px_to_mm=`echo "( 1.0 / $ppi ) * $mm_to_inch" | bc -l`

pfx_fns="layers/layer0 layers/layer1 layers/layer2"

premul=`echo 1000000 | bc -l`
invmul=`echo "1.0/$premul" | bc -l`

finmul=`echo "$invmul * $px_to_mm * $g_scale" | bc -l`

S_cut="S1.0"
S_engrave="S0.25"
S_move="S0.0"

F_cut="F800"
F_engrave="F4000"
F_move="F8000"

xshift=30
yshift=30

#rx=238
rx=20
ry=20


if [[ "$VERBOSE" -eq 1 ]] ; then
  echo "##"
  echo "## ppi $ppi"
  echo "## mm_to_inch $mm_to_inch"
  echo "## premul $premul"
  echo "## invmul $invmul"
  echo "## finmul $finmul"
  echo "##"
  echo "## S(cut,engrave,move) ($S_cut, $S_engrave, $S_move)"
  echo "## F(cut,engrave,move) ($F_cut, $F_engrave, $F_move)"
  echo "##"
  echo "## outline: $outline_fns"
  echo "##"
fi

mkdir -p aux
mkdir -p ngc

for pfx_fn in $pfx_fns ; do
  b=`basename $pfx_fn .png`
  fn="${pfx_fn}-mask.png"

  echo "$b $fn ..."

  cat $fn | pngtopnm | potrace > aux/$b.eps
  pstoedit -f gnuplot aux/$b.eps aux/$b.gp
  clipcli -s aux/$b.gp -F -x $premul -T > aux/$b-ord.gp
  echo -e "G21\nG90\nG1 $F_cut S0\nG0 $F_move S0\n" > ngc/$b-outline.ngc
  gp2ngc -i aux/$b-ord.gp --sfx-rapid "$F_rapid $S_move" --sfx-slow "$F_cut $S_cut" | \
    ngc_scale -s "$finmul" >> ngc/$b-outline.ngc
  ngc_rotate -f ngc/$b-outline.ngc -d 90 | \
    ngc_scale -x "-1" -y "1" | \
    ngc_translate -x $rx -y $ry -U -S > ngc/$b-outline-rot90.ngc
    #ngc_scale -s "$invmul" > ngc/$b.ngc
done

for pfx_fn in $pfx_fns ; do
  b=`basename $pfx_fn .png`
  ngc_fn="${pfx_fn}-relief.gcode"

  dos2unix "$ngc_fn"
  sed -i 's/;.*//g' "$ngc_fn"

  cat $ngc_fn > ngc/$b.ngc
  cat ngc/$b-outline.ngc >> ngc/$b.ngc
  cat ngc/$b-outline.ngc >> ngc/$b.ngc
done

dos2unix layers/layer3-relief.gcode
sed -i 's/;.*//g' layers/layer3-relief.gcode

cat layers/layer3-relief.gcode > ngc/layer3.ngc
cat layers/box.ngc >> ngc/layer3.ngc
cat layers/box.ngc >> ngc/layer3.ngc

for z in {0..3} ; do

  ngc_rotate -f ngc/layer$z.ngc -d 90 | \
    ngc_scale -x "-1" -y "1" | \
    ngc_translate -x $rx -y $ry -U -S | \
    sed 's/S/ S/g' | sed 's/F/ F/' | sed 's/^ *//' | \
    sed 's/G1 *'$F_engrave'/G1 '$F_engrave'\nG0 '$F_move'/' > ngc/layer$z-rot90.ngc

done

#exit
#
#ngc_rotate -f ngc/layer1.ngc -d 90 | \
#  ngc_translate -x $rx -y $ry -U -S | \
#  sed 's/S/ S/g' | sed 's/F/ F/' | sed 's/^ *//' > ngc/layer1-rot90.ngc
#
#ngc_rotate -f ngc/layer2.ngc -d 90 | \
#  ngc_translate -x $rx -y $ry -U -S | \
#  sed 's/S/ S/g' | sed 's/F/ F/' | sed 's/^ *//' > ngc/layer2-rot90.ngc
#
#ngc_rotate -f ngc/layer3.ngc -d 90 | \
#  ngc_translate -x $rx -y $ry -U -S | \
#  sed 's/S/ S/g' | sed 's/F/ F/' | sed 's/^ *//' > ngc/layer3-rot90.ngc

