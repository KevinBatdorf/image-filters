<?php
/**
 * Plugin Name:       Image Filters
 * Description:       A blcok that wraps the image block and lets you apply filters to it.
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Kevin Batdorf
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       image-filters
 *
 * @package           kevinbatdorf
 */

add_action('init', function () {
    register_block_type(__DIR__ . '/build');
});
function custom_upload_mimes($existing_mimes)
{
    $existing_mimes['wasm'] = 'application/wasm';

    return $existing_mimes;
}

add_filter('upload_mimes', 'custom_upload_mimes');
