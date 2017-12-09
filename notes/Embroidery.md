Embroidery Notes
===

File Formats
---

Taken from ["What Are The Embroidery File Formats?"](http://janome.com/en/learn/software-lessons/digitizer-jr.-version-3/what-are-the-embroidery-file-formats/):

* **.jan** - When an embroidery design is in the process of being constructed, Digitizer 10000 keeps track of each piece of the embroidery. The embroidery pieces are called objects. Each object is actually a description of the piece of embroidery. It has properties information such as size, shape, color, sequence within the design, stitch type and values, and rules for stitching.
If you make a change to an object, such as its color or shape, the properties description is changed. It is easier to modify an embroidery design which is a series of objects than it is to modify an embroidery design which is stitch-based.
The .jan file is the file that contains the embroidery's object properties. There is a "slot" for each object, so if there are 15 objects in an embroidery design, there will be 15 "slots" in the .jan file. It is the file format that is used while the embroidery is in its interim state. When you save an embroidery while it is incomplete, you should save it as a .jan file, so you can easily modify it later.
* **.jef** - The stitch-based file that is read by the MemoryCraft 10000.
* **.sew** - The stitch-based file format used by MemoryCraft 5700, 8000, and 9000 machines.
* **.pes** - A stitch-based file format used by Brother and Babylock embroidery home sewing machines.
* **.pec** - A stitch-based file format used by Brother and Babylock embroidery home sewing machines.
* **.hus** - The stitch-based file format used by Husqvarna/Viking embroidery home sewing machines.
* **.pcs** - The stitch-based file format used by Pfaff embroidery home sewing machines.
* **.csd** - The stitch-based file format used by Poem, Huskygram, and Singer EU embroidery home sewing machines.
* **.xxx** - The stitch-based file format used by Singer embroidery home sewing machines.
* **.dst** - The stitch-based file format used by Tajima commercial embroidery sewing machines.
* **.exp** - The stitch-based file format used by Melco commercial embroidery sewing machines.

---

Software and Libraries
---

* [libpes](https://github.com/treveradams/libpes) ([local version](pes-format.pdf)).
* [libpes-1](https://github.com/treveradams/libpes-1)
* [PES Wiki](https://github.com/frno7/libpes/wiki/PES-format)
* [inkscape-embroidery](https://github.com/treveradams/inkscape-embroidery)
* [Embroidery Reader](http://www.njcrawford.com/programs/embroidery-reader/) ([source](https://github.com/njcrawford/EmbroideryReader))
* [PHP embroidery reader](http://bobosch.dyndns.org/embroidery/showFile.php?pes.php)
* [Embroidermodder](https://github.com/Embroidermodder/Embroidermodder)
* [pesconvert](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/pesconvert.git)




