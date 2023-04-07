=== Image Filters ===
Contributors:      kbat82
Tags:              filter, image, block, dramatic, lofi
Tested up to:      6.2
Stable tag:        1.2.4
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Choose from 22 beautiful image filters.

== Description ==

Image filters extends the core Gutenberg image block to provide a curated set of 22 image filters processed using the binary code of the image itself (i.e. not a CSS overlay or CSS filter).

- Follow [@kevinbatdorf](https://twitter.com/kevinbatdorf) on Twitter
- View on [GitHub](https://github.com/KevinBatdorf/image-filters)

= Features =
- No server requirements.
- Clones the source image and saves it to the media library.
- No lock in, deactivate at any time.

= More coming =
Over time I will expand this block to include more image editing features such as watermarking, more filters, image blending, and more. Open an issue if you have any feature requests, or show support by leavign a review.

== Installation ==

1. Activate the plugin through the 'Plugins' screen in WordPress

== Frequently Asked Questions ==

= Do you save the images to my file system? =

Yes, when you press to import an image filter, the new image will be added to the WP media library.

= What happens if I disable your block? =

You will still have the edited image, which you can use however you like.

= wasmWebAssembly.instantiateStreaming console message =

While it's not required (but recommended), you can speed up the filter processing by making sure your server understands application/wasm files and serves them with the proper mime type. In Nginx, for example, you would add a directive like:
`types {
    application/wasm wasm;
}`

== Screenshots ==

1. An example showing the filtered images
2. An example showing the filtered images


== Changelog ==

= 1.2.4 =
- Fixes issue with the build release process where it wasnt building the wasm binary

= 1.2.3 =
- Updates packages and tests WP6.2 compatibility

= 1.2.2 =
- Removes lock file cutting the zip size by a significant amount

= 1.2.1 =
- Fixes icon rendering in Firefox

= 1.2.0 =
- Replace link if set to link to the Media File
- Carry over more attributes on media replace
- Stop image processing/painting if importing
- Call function in filter instead of returning to fix filter lock

= 1.1.0 =
- Adds filters to the native image block
- The block will open the modal when inserted
- Various bug fixes and performance enhancements
- Prompt users to add an image if one doesn't exist

= 1.0.0 =
- Initial Release
