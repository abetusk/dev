#!/usr/bin/perl
#
# preload x and y positions for feed motions
#

use strict;
use Getopt::Std;

$Getopt::Std::STANDARD_HELP_VERSION = 1;

my $VERSION_STR = "0.1 alpha";
my $UC = 0;
my $SPACE = "";

sub VERSION_MESSAGE {
  print "ngc_translate version ", $VERSION_STR, "\n"
}

sub usage
{
  print "usage:\n";
  print " [-f inp]              input gcode file (defaults to stdin)\n";
  print " [-o out]              output gcode file (defaults to stdout)\n";
  print " [-x x]                x translation amount\n";
  print " [-y y]                y translation amount\n";
  print " [-z z]                z translation amount\n";
  print " [-s s]                x,y,z scaling factor\n";
  print " [-U]                  use upper case gcode (lower case default)\n";
  print " [-S]                  space betwen x/y gcode\n";
  print " [-C]                  print comment header in ngc file (GRBL style)\n";
  print " [-h|--help]           help (this screen)\n";
  print " [--version]           print version string\n";
  return 1;
}

sub HELP_MESSAGE {
  usage();
}

usage() and exit(0) if (scalar(@ARGV) == 0);

open(my $FH_INP, "-");
open(my $FH_OUT, ">-");
my %opts;
getopts("f:o:x:y:z:s:hUSC", \%opts);

my $x_shift = 0.0;
my $y_shift = 0.0;
my $z_shift = 0.0;
my $s_scale = 1.0;

if (exists($opts{h})) { usage(); exit; }
open($FH_INP, $opts{f}) if ($opts{f});
open($FH_OUT, ">$opts{o}") if ($opts{o});
$x_shift = $opts{x} if ($opts{x});
$y_shift = $opts{y} if ($opts{y});
$z_shift = $opts{z} if ($opts{z});
$s_scale = $opts{s} if ($opts{s});
$UC = 1 if ($opts{U});
$SPACE = " " if ($opts{S});

my $show_comments=0;
if (exists($opts{C})) { $show_comments=1; }

my @gcode;
while (<$FH_INP>)
{
  push @gcode, $_;
}
close $FH_INP if fileno $FH_INP != fileno STDIN;

my %state;

$state{x} = undef;
$state{prev_x} = undef;
$state{y} = undef;
$state{prev_y} = undef;
$state{z} = undef;
$state{prev_z} = undef;
$state{g} = undef;
$state{line_no} = 0;

$state{del_x} = 1;
$state{del_y} = 1;
$state{del_z} = 1;

$state{z_up}  = 1;

$state{x_dir} = 0;
$state{y_dir} = 0;
$state{z_dir} = 0;

my $op;
my $operand;

if ($show_comments) {
  print $FH_OUT "( x_shift $x_shift, y_shift $y_shift, z_shift $z_shift, s_scale $s_scale )\n";
}

foreach my $line (@gcode)
{
  chomp($line);
  $state{line_no}++;

  if ( ($line =~ /^\s*;/) or
       ($line =~ /^\s*$/) )
  {
    print $FH_OUT $line, "\n";
    next;
  }

  while ($line)
  {

    if ($line =~ /^\s*$/)
    {
      $line = "";
      next;
    }


    # print comment
    if (is_comment($line))
    {
      ($op, $line) = chomp_comment($line);
      print $FH_OUT $op;
      next;
    }

    if (is_op($line))
    {
      ($op, $operand, $line) = chomp_op($line);

      state_f($operand) if ( is_op_f($op) ) ;
      state_s($operand) if ( is_op_s($op) ) ;

      state_g($operand) if ( is_op_g($op) ) ;
      state_m($operand) if ( is_op_m($op) ) ;

      state_x($operand) if ( is_op_x($op) ) ;
      state_y($operand) if ( is_op_y($op) ) ;
      state_z($operand) if ( is_op_z($op) ) ;

      state_i($operand) if ( is_op_i($op) ) ;
      state_j($operand) if ( is_op_j($op) ) ;

      state_p($operand) if ( is_op_p($op) ) ;

      next;
    }

    print $FH_OUT $line, " ( unprocessed )\n";
    $line = '';

  }
  print $FH_OUT "\n";

}
close $FH_OUT if fileno $FH_OUT != fileno STDOUT;

sub is_comment
{
  my $l = shift;
  return $l =~ /^\s*\([^\)]*\)/;
}

sub chomp_comment
{
  my $l = shift;
  $l =~ /^\s*\([^\)]*\)\s*/;
  my $c = substr $l, 0, @+[0];
  $l =~ s/^\s*\([^\)]*\)\s*//;
  return ($c, $l);
}

sub is_op
{
  my $l = shift;
  return $l =~ /^\s*([^\d-]+\s*)+/;
}

sub chomp_op
{
  my $l = shift;
  
  $l =~ /^\s*([^\d-]+\s*)+/;

  my $op = substr $l, 0, @+[0];
  $l =~ s/^\s*([^\d-]+\s*)+//;

  die "parse error at line $state{line_no} ($l, $op)" if (! ($l =~ /^\s*(-?\d+\s*(\.\s*\d+)?)/));
  my $operand = substr $l, 0, @+[0];

  $l =~ s/^\s*(-?\s*\d+\s*(\.\s*\d+)?)//;

  $op =~ s/^\s+//;
  $op =~ s/\s+$//;
  $operand =~ s/^\s+//;
  $operand =~ s/\s+$//;
  $l =~ s/^\s+//;
  $l =~ s/\s+$//;

  return ($op, $operand, $l);
}

sub is_op_f { my $l = shift; return $l =~ /^\s*[fF]\s*$/; }
sub is_op_s { my $l = shift; return $l =~ /^\s*[sS]\s*$/; }

sub is_op_g { my $l = shift; return $l =~ /^\s*[gG]\s*$/; }
sub is_op_m { my $l = shift; return $l =~ /^\s*[mM]\s*$/; }
sub is_op_t { my $l = shift; return $l =~ /^\s*[tT]\s*$/; }
sub is_op_x { my $l = shift; return $l =~ /^\s*[xX]\s*$/; }
sub is_op_y { my $l = shift; return $l =~ /^\s*[yY]\s*$/; }
sub is_op_z { my $l = shift; return $l =~ /^\s*[zZ]\s*$/; }

sub is_op_i { my $l = shift; return $l =~ /^\s*[iI]\s*$/; }
sub is_op_j { my $l = shift; return $l =~ /^\s*[jJ]\s*$/; }
sub is_op_p { my $l = shift; return $l =~ /^\s*[pP]\s*$/; }

sub state_g0 { my $l = shift; $state{g} = 0; }
sub state_g1 { my $l = shift; $state{g} = 1; }
sub state_g2 { my $l = shift; $state{g} = 2; }
sub state_g3 { my $l = shift; $state{g} = 3; }

sub state_f
{
  my $f = shift;
  if ($UC) {
    print $FH_OUT "F$f";
  } else {
    print $FH_OUT "f$f";
  }
}

sub state_s
{
  my $s = shift;
  if ($UC) {
    print $FH_OUT "S$s";
  } else {
    print $FH_OUT "s$s";
  }
}


sub state_g
{
  my $g = shift;
  $state{g} = $g;

  if ($UC) {
    print $FH_OUT "G$g";
  } else {
    print $FH_OUT "g$g";
  }
}

sub state_m
{
  my $m = shift;
  if ($UC) {
    print $FH_OUT "M$m";
  } else {
    print $FH_OUT "m$m";
  }
}

sub state_i
{
  my $i = shift;
  if ($UC) {
    print $FH_OUT "I", sprintf("%4.8f", $s_scale*$i) ;
  } else {
    print $FH_OUT "i", sprintf("%4.8f", $s_scale*$i) ;
  }
}

sub state_j
{
  my $j = shift;
  if ($UC) {
    print $FH_OUT "J", sprintf("%4.8f", $s_scale*$j) ;
  } else {
    print $FH_OUT "j", sprintf("%4.8f", $s_scale*$j) ;
  }
}

sub state_p
{
  my $p = shift;
  if ($UC) {
    print $FH_OUT "P$p";
  } else {
    print $FH_OUT "p$p";
  }
}

sub state_x 
{
  my $x = shift;

  my $prev_dir = $state{x_dir};

  $state{x_dir} = ( ($x > $state{x}) ? 1 : -1 ) if (defined($state{x}));
  $state{prev_x} = $state{x};
  $state{x} = $x;

  if ($UC) {
    print $FH_OUT "${SPACE}X", sprintf("%4.8f", $s_scale*($x + $x_shift)) ;
  } else {
    print $FH_OUT "${SPACE}x", sprintf("%4.8f", $s_scale*($x + $x_shift)) ;
  }
}

sub state_y
{
  my $y = shift;

  my $prev_dir = $state{y_dir};

  $state{y_dir} = ( ($y > $state{y}) ? 1 : -1 ) if (defined($state{y}));
  $state{prev_y} = $state{y};
  $state{y} = $y;

  if ($UC) {
    print $FH_OUT "${SPACE}Y", sprintf("%4.8f", $s_scale*($y + $y_shift)) ;
  } else {
    print $FH_OUT "${SPACE}y", sprintf("%4.8f", $s_scale*($y + $y_shift)) ;
  }
}

sub state_z
{
  my $z = shift;

  my $prev_dir = $state{z_dir};

  $state{z_dir} = ( ($z > $state{z}) ? 1 : -1 ) if (defined($state{z}));
  $state{prev_z} = $state{z};
  $state{z} = $z;

  if ($UC) {
    print $FH_OUT "${SPACE}Z", sprintf("%4.8f", $s_scale*($z + $z_shift)) ;
  } else {
    print $FH_OUT "${SPACE}z", sprintf("%4.8f", $s_scale*($z + $z_shift)) ;
  }
}
