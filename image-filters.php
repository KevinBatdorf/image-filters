<?php
/**
 * Plugin Name:       Image Filters
 * Description:       Choose from 22 advanced image filters to bring your images to life. No CSS.
 * Requires at least: 5.9
 * Requires PHP:      7.0
 * Version:           1.2.4
 * Author:            Kevin Batdorf
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       image-filters
 *
 * @package           kevinbatdorf
 */

add_action('init', function () {
    register_block_type(__DIR__ . '/build');
    wp_set_script_translations('kevinbatdorf-image-filters', 'image-filters');
});
