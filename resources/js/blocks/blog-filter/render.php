<?php
/**
 * Blog filter renderer.
 * 
 * @global $attributes array The block attributes.
 * @global $content string The block default content.
 * @global $block WP_Block The block instance.
 * 
 * @package JesusFilm/JesusFilm-2023
 */

?>

<div <?php echo get_block_wrapper_attributes( array( 'data-query' => json_encode( $attributes ) ) ); ?>>
</div>
