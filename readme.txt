=== Image Filters ===
Contributors:      kbat82
Tags:              block
Tested up to:      5.9
Stable tag:        0.1.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Choose from 22 advanced image filters to bring your images to life. No CSS.

== Description ==

Image filters is a Gutenberg block that wraps around the native core image block that when opened, will generate a curated set of 22 image filters processed using the binary code of the image itself (i.e. not a CSS fitler overlay).

- Follow [@kevinbatdorf](https://twitter.com/kevinbatdorf) on Twitter
- View on [GitHub](https://github.com/KevinBatdorf/image-filters)

= Features =
- No server requirements.
- Clones the source image and saves it to the media library.
- Wraps around the core image block, doesn't filter it.

= Tips =
- While it's not required, you can speed up the filter processing by making sure your server understands application/wasm files and serves them with the proper mime type. In Nginx, for example, you would add a directive like:
`types {
    application/wasm wasm;
}`

= More coming =
I may expand this block to include more image editing features such as watermarking, resizing, cropping, more filters, and more. Open an issue if you have any feature requests, or show support by leavign a review.

== Installation ==

1. Activate the plugin through the 'Plugins' screen in WordPress

== Frequently Asked Questions ==

= Do you save the images to my file system? =

Yes, when you press to import an image filter, the new image will be added to the WP media library.

= What happens if I disable your block? =

You will still have the edited image, which you can use however you like.

= My browser seems locked up? =

When processing a large or complex image, the browser may lock up during a single filter process. If you close the modal (even if you just press the x button while it's locked or press escape), it will safely stop after that single filter has completed. You can open/close the modal at any time without concern and previous filters are cached until reload.

== Screenshots ==

1. This screen shot description corresponds to screenshot-1.(png|jpg|jpeg|gif). Note that the screenshot is taken from
the /assets directory or the directory that contains the stable readme.txt (tags or trunk). Screenshots in the /assets
directory take precedence. For example, `/assets/screenshot-1.png` would win over `/tags/4.3/screenshot-1.png`
(or jpg, jpeg, gif).
2. This is the second screen shot

== Changelog ==

= 0.1.0 =
* Release
