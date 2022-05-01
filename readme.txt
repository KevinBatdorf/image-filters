=== Image Filters ===
Contributors:      kbat82
Tags:              block
Tested up to:      5.9
Stable tag:        0.1.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Apply image filters to the core image block.

== Description ==

TODO

== Installation ==

1. Activate the plugin through the 'Plugins' screen in WordPress


== Frequently Asked Questions ==

= Do you save the images to my file system? =

Yes, when you select an image filter, the new image will be added to the WP media library.

= What happens if I disable your block? =

You will still have the edited image, which you can use however you like.

= My browser seems locked up? =

When processing a very large image, the browser may lock up during a single filter process. If you close the modal (even if you just press the button while it's locked), it will safely stop after that image has completed. You can open/close the modal at any time without concern.

= It seems slow or stuck =

If it seems stuck, just close the modal and reopen it. I've tried to strike a balance between aggressive loading vs loading on demand, so it should only use resources when you want to. If you clsoe the modal and open it back up, the previous images will be cached until you reload the page. If it's just slow, the image may be pretty large or complex. These filters are manipulating the actual image and not just placing a filter over top. Either wait a bit, or try closing/reopening to trigger a restart on a stalled filter.

= Can I filter an already filtered image? =

Sure, but it involves a couple steps. We keep track of the source image until it's changed from the image block, so if you swap an image then open the modal again, it will use the source image to build the filters. You will just need to remove the image and add it back again.

= The filters all look the same! =

It just depends on the image, I guess. I've noticed this too with some images. It is what it is. I hope you enjoy the plugin with other images at least!

== Screenshots ==

1. This screen shot description corresponds to screenshot-1.(png|jpg|jpeg|gif). Note that the screenshot is taken from
the /assets directory or the directory that contains the stable readme.txt (tags or trunk). Screenshots in the /assets
directory take precedence. For example, `/assets/screenshot-1.png` would win over `/tags/4.3/screenshot-1.png`
(or jpg, jpeg, gif).
2. This is the second screen shot

== Changelog ==

= 0.1.0 =
* Release
