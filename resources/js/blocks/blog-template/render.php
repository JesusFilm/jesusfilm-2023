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
$page_key = isset( $block->context['queryId'] ) ? 'query-' . $block->context['queryId'] . '-page' : 'query-page';
$page     = empty( $_GET[ $page_key ] ) ? 1 : (int) $_GET[ $page_key ];
$max_page = isset( $block->context['query']['pages'] ) ? (int) $block->context['query']['pages'] : 0;

// Use global query if needed.
$use_global_query = ( isset( $block->context['query']['inherit'] ) && $block->context['query']['inherit'] );
if ( $use_global_query ) {
	global $wp_query;
	$query = clone $wp_query;

	$total         = ! $max_page || $max_page > $wp_query->max_num_pages ? $wp_query->max_num_pages : $max_page;
	$paginate_args = array(
		'prev_next' => false,
		'total'     => $total,
	);
	
	$pagination = paginate_links( $paginate_args );
} else {
	$query = new WP_Query( build_query_vars_from_query_block( $block, $page ) );
	// `paginate_links` works with the global $wp_query, so we have to
	// temporarily switch it with our custom query.
	$prev_wp_query = $wp_query;
	$wp_query      = $query;
	$total         = ! $max_page || $max_page > $wp_query->max_num_pages ? $wp_query->max_num_pages : $max_page;
	$paginate_args = array(
		'base'      => '%_%',
		'format'    => "?$page_key=%#%",
		'current'   => max( 1, $page ),
		'total'     => $total,
		'prev_next' => false,
	);
	if ( 1 !== $page ) {
		$paginate_args['add_args'] = array( 'cst' => '' );
	}
	// We still need to preserve `paged` query param if exists, as is used
	// for Queries that inherit from global context.
	$paged = empty( $_GET['paged'] ) ? null : (int) $_GET['paged'];
	if ( $paged ) {
		$paginate_args['add_args'] = array( 'paged' => $paged );
	}
	$pagination = paginate_links( $paginate_args );
	wp_reset_postdata(); // Restore original Post Data.
	$wp_query = $prev_wp_query;

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
<?php echo get_block_wrapper_attributes( array( 'data-block' => json_encode( $block ) ) ); ?>>
	<ul class="wp-block-jf-blog-template__posts"><?php echo $content; ?></ul>

	<?php 
	if ( ! empty( $pagination ) ) {
		print $pagination;} 
	?>
</div>

<?php
