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

<div 
<?php 
echo get_block_wrapper_attributes(
	array(
		'data-query' => json_encode( $attributes ),
		'data-block' => urlencode( json_encode( $block ) ),
	) 
); 
?>
>
	<?php

	$query_args = $block->context['query'] ?? array();

	switch ( $attributes['filterType'] ?? null ) {
		case 'taxonomy':
			$posts_in_post_type = get_posts(
				array(
					'fields'         => 'ids',
					'post_type'      => $query_args['postType'],
					'posts_per_page' => -1,
				) 
			);

			$terms = wp_get_object_terms( $posts_in_post_type, $attributes['filterTaxonomy'] );

			if ( ! empty( $terms ) ) {
				print '<ul>';
				array_walk(
					$terms, 
					function( $term ) {
						printf( '<li><a>%s</a></li>', esc_html( $term->name ) );
					}
				);
				print '</ul>';
			}
			break;
		default:
			// Do something.
	}

	?>
</div>
