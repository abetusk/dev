Resize with Imagemagick
---

Using Imagemagick's `convert` tool, you can resize an image but Imagemagick
does interpolation so the resulting image can look pretty bad.

For example, using the input (animated) gif:

![Input (small) animated gif](img/2015-10-27/tree_anim_inp.gif)

And issuing the command to resize it by a factor of 4:

```bash
$ convert tree_anim_inp.gif -resize 400% tree_anim_ugly.gif
```

produces the interpolated (and ugly) picture:

![Ugly interpolated animated gif](img/2015-10-27/tree_anim_ugly.gif)

Instead, use the `scale` command:

```bash
$ convert tree_anim_inp.gif -scale 400% tree_anim_out.gif
```

![Clean scaled up animated gif](img//2015-10-27/tree_anim_out.gif)


### Reference

* [ImageMagick resize without interpolation](http://stackoverflow.com/questions/32485277/imagemagick-resize-without-interpolation)

---

Saving animated GIFs in Gimp
---

Save as a `.gif` file extension.  When exporting, there will be an option to save as an animation:

![Save as animated Gif in Gimp](img/2015-10-27/save_anim_gimp.png)

Check it and you should have an animated GIF.

###### 2015-10-27
