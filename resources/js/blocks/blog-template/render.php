<?php
/**
 * Bloc template renderer.
 * 
 * @global $attributes array The block attributes.
 * @global $content string The block default content.
 * @global $block WP_Block The block instance.
 * 
 * @package JesusFilm/JesusFilm-2023
 */

// Use global query if needed.
$use_global_query = ( isset( $block->context['query']['inherit'] ) && $block->context['query']['inherit'] );
if ( $use_global_query ) {
	global $wp_query;
	$query = clone $wp_query;
} else {
	$query_args = build_query_vars_from_query_block( $block, $page );
	$query      = new WP_Query( $query_args );
}

// Get an instance of the current Post Template block.
$block_instance = $block->parsed_block;

// Set the block name to one that does not correspond to an existing registered block.
// This ensures that for the inner instances of the Post Template block, we do not render any block supports.
$block_instance['blockName'] = 'core/null';

$content = '';

while ( $query->have_posts() ) {
	$query->the_post();

	// Render the inner blocks of the Post Template block with `dynamic` set to `false` to prevent calling
	// `render_callback` and ensure that no wrapper markup is included.
	$block_content = (
	new \WP_Block(
		$block_instance,
		array(
			'postType' => get_post_type(),
			'postId'   => get_the_ID(),
		)
	)
	)->render( array( 'dynamic' => false ) );

	// Wrap the render inner blocks in a `li` element with the appropriate post classes.
	$post_classes = implode( ' ', get_post_class( 'wp-block-post' ) );
	$content     .= '<li class="' . esc_attr( $post_classes ) . '">' . $block_content . '</li>';
}

?>
<div 
<?php echo get_block_wrapper_attributes( array( 'data-block' => urlencode( base64_encode( json_encode( $block ) ) ) ) ); ?>>
	<ul class="wp-block-jf-blog-template__posts"><?php echo $content; ?></ul>
</div>

<?php
