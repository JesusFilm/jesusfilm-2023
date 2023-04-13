<?php
/**
 * Cards renderer.
 * 
 * @global $attributes array The block attributes.
 * @global $content string The block default content.
 * @global $block WP_Block The block instance.
 * 
 * @package JesusFilm/JesusFilm-2023
 */

$gap = _wp_array_get( $attributes, array( 'style', 'spacing', 'blockGap' ) );
// Skip if gap value contains unsupported characters.
// Regex for CSS value borrowed from `safecss_filter_attr`, and used here
// because we only want to match against the value, not the CSS attribute.
if ( is_array( $gap ) ) {
	foreach ( $gap as $key => $value ) {
		// Make sure $value is a string to avoid PHP 8.1 deprecation error in preg_match() when the value is null.
		$value = is_string( $value ) ? $value : '';
		$value = $value && preg_match( '%[\\\(&=}]|/\*%', $value ) ? null : $value;

		// Get spacing CSS variable from preset value if provided.
		if ( is_string( $value ) && str_contains( $value, 'var:preset|spacing|' ) ) {
			$index_to_splice = strrpos( $value, '|' ) + 1;
			$slug            = _wp_to_kebab_case( substr( $value, $index_to_splice ) );
			$value           = "var(--wp--preset--spacing--$slug)";
		}

		$gap[ $key ] = $value;
	}
} else {
	// Make sure $gap is a string to avoid PHP 8.1 deprecation error in preg_match() when the value is null.
	$gap = is_string( $gap ) ? $gap : '';
	$gap = $gap && preg_match( '%[\\\(&=}]|/\*%', $gap ) ? null : $gap;

	// Get spacing CSS variable from preset value if provided.
	if ( is_string( $gap ) && str_contains( $gap, 'var:preset|spacing|' ) ) {
		$index_to_splice = strrpos( $gap, '|' ) + 1;
		$slug            = _wp_to_kebab_case( substr( $gap, $index_to_splice ) );
		$gap             = "var(--wp--preset--spacing--$slug)";
	}
}

$class   = wp_unique_id( 'wp-block-cards-' );
$content = preg_replace(
	'/' . preg_quote( 'class="', '/' ) . '/',
	'class="' . $class . ' ',
	$content,
	1
);

// --gallery-block--gutter-size is deprecated. --wp--style--gallery-gap-default should be used by themes that want to set a default
// gap on the gallery.
$fallback_gap = 'var( --wp--style--block-gap, 20px )';
$gap_value    = $gap ? $gap : $fallback_gap;
$gap_column   = $gap_value;

if ( is_array( $gap_value ) ) {
	$gap_row    = isset( $gap_value['top'] ) ? $gap_value['top'] : $fallback_gap;
	$gap_column = isset( $gap_value['left'] ) ? $gap_value['left'] : $fallback_gap;
	$gap_value  = $gap_row === $gap_column ? $gap_row : $gap_row . ' ' . $gap_column;
}

// The unstable gallery gap calculation requires a real value (such as `0px`) and not `0`.
if ( '0' === $gap_column ) {
	$gap_column = '0px';
}

// Set the CSS variable to the column value, and the `gap` property to the combined gap value.
$style = '.' . $class . '{ gap: ' . $gap_value . '; --gap: ' . $gap_value . '; --columns: ' . absint( $attributes['columns'] ?? 0 ) . '}';

wp_enqueue_block_support_styles( $style, 11 );
echo $content;
