<?php
/**
 * Breadcrumbs renderer.
 * 
 * @global $attributes array The block attributes.
 * @global $content string The block default content.
 * @global $block WP_Block The block instance.
 * 
 * @package JesusFilm/JesusFilm-2023
 */

?>

<div <?php echo get_block_wrapper_attributes(); ?>>
	<?php
	if ( function_exists( 'rank_math_the_breadcrumbs' ) ) {
		rank_math_the_breadcrumbs();
	}
	?>
</div>
