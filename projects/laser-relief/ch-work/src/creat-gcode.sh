#!/bin/bash

VERBOSE=1

#g_scale=1.0
g_scale=0.5

ppi=300.0
mm_to_inch=25.40

px_to_mm=`echo "( 1.0 / $ppi ) * $mm_to_inch" | bc -l`

outline_fns="layer-09-b.png layer-07-b.png layer-05-b.png layer-03-b.png"
engrave_fns="layer-10.png layer-08.png layer-06.png layer-04.png"
layer_pairs="09,10 07,08 05,06 03,04"

premul=`echo 1000000 | bc -l`
invmul=`echo "1.0/$premul" | bc -l`

finmul=`echo "$invmul * $px_to_mm * $g_scale" | bc -l`

S_cut="S1.0"
S_engrave="S0.25"
S_move="S0.0"

F_cut="F800"
F_engrave="F1000"
F_move="F3000"

xshift=30
yshift=30

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
  echo "## engrave: $engrave_fns"
  echo "##"
fi

mkdir -p aux
mkdir -p ngc

for fn in $outline_fns ; do
  b=`basename $fn .png`

  echo "$b $fn ..."

  cat $fn | pngtopnm | potrace > aux/$b.eps
  pstoedit -f gnuplot aux/$b.eps aux/$b.gp
  clipcli -s aux/$b.gp -F -x $premul -T > aux/$b-ord.gp
  echo -e "G21\nG90\nG1 $F_cut S0\nG0 $F_move S0\n" > ngc/$b-outline.ngc
  gp2ngc -i aux/$b-ord.gp --sfx-rapid "$F_rapid $S_move" --sfx-slow "$F_cut $S_cut" | \
    ngc_scale -s "$finmul" >> ngc/$b-outline.ngc
    #ngc_scale -s "$invmul" > ngc/$b.ngc
done

for pair in $layer_pairs ; do
  outline_num=`echo $pair | cut -f1 -d,`
  engrave_num=`echo $pair | cut -f2 -d,`

  outline_ngc_fn="ngc/layer-$outline_num-b-outline.ngc"
  engrave_ngc_fn="engrave/layer-$engrave_num-engrave.ngc"

  if [[ "VERBOSE" -eq 1 ]] ; then
    echo "## outline_ngc_fn $outline_ngc_fn"
    echo "## engrave_ngc_fn $engrave_ngc_fn"
    echo "## creating ngc/layer-$outline_num-$engrave_num.ngc"
  fi

  cat $engrave_ngc_fn | \
    sed 's/;.*//g' | \
    ngc_scale -s $g_scale > ngc/layer-$outline_num-$engrave_num.ngc
  cp ngc/layer-$outline_num-$engrave_num.ngc ngc/layer-$engrave_num-s$g_scale.ngc

  ## do outline three times
  ##
  cat $outline_ngc_fn >> ngc/layer-$outline_num-$engrave_num.ngc
  cat $outline_ngc_fn >> ngc/layer-$outline_num-$engrave_num.ngc
  cat $outline_ngc_fn >> ngc/layer-$outline_num-$engrave_num.ngc
done

tfn=`tempfile`
for x in `find ngc -type f -name '*.ngc'` ; do
  grecode -shift +$xshift +$yshift $x > $tfn
  cp $tfn $x
done

rm $tfn

exit

## todo:
for fn in "$interior_fns" ; do
  b=`basename $fn .png`
  cat $fn | pngtopnm | potrace > aux/$b.eps
  pstoedit -f gnuplot aux/$b.eps aux/$b.gp
  clipcli -s aux/$b.gp -F -x $premul -T > aux/$b-ord.gp
  gp2ngc -i aux/$b-ord.gp --sfx-rapid "$F_rapid $S_move" --sfx-slow "$F_engrave $S_engrave" | \
    ngc_scale -s "$invmul" > ngc/$b.ngc
done
