=== Image Filters ===
Contributors:      kbat82
Tags:              filter, image, block, dramatic, lofi
Tested up to:      5.9
Stable tag:        1.0.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Choose from 22 beautiful filters to bring your images to life.

== Description ==

Image filters is a Gutenberg block that wraps around the native core image block that when opened, will generate a curated set of 22 image filters processed using the binary code of the image itself (i.e. not a CSS overlay or filter).

- Follow [@kevinbatdorf](https://twitter.com/kevinbatdorf) on Twitter
- View on [GitHub](https://github.com/KevinBatdorf/image-filters)

= Features =
- No server requirements.
- Clones the source image and saves it to the media library.
- Wraps around the core image block, doesn't filter it.

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

= wasmWebAssembly.instantiateStreaming console message =

While it's not required, you can speed up the filter processing by making sure your server understands application/wasm files and serves them with the proper mime type. In Nginx, for example, you would add a directive like:
`types {
    application/wasm wasm;
}`

== Screenshots ==

1. An example showing the filtered images
2. An example showing the filtered images
3. An example showing the filtered images


== Changelog ==

= 1.0.0 =
* Initial Release
