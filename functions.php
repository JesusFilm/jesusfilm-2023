<?php
/**
 * Theme functions.
 * 
 * @package JesusFilm/JesusFilm-2023
 */

namespace JesusFilm;

/**
 * Enqueue scripts
 *
 * @return void
 */
function enqueue_scripts() {
	wp_enqueue_style( 'jesusfilm', get_stylesheet_uri(), array(), wp_get_theme( 'jesusfilm-2023' )->get( 'Version' ) );
	wp_enqueue_script( 'jesusfilm', get_theme_file_uri( 'assets/js/main.js' ), array(), wp_get_theme( 'jesusfilm-2023' )->get( 'Version' ), true );
}
\add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_scripts' );

/**
 * Enqueue editor scripts
 *
 * @return void
 */
function enqueue_block_editor_scripts() {
	wp_enqueue_style( 'jesusfilm-editor', get_theme_file_uri( 'assets/css/editor.css' ), array(), wp_get_theme( 'jesusfilm-2023' )->get( 'Version' ) );
	wp_enqueue_script( 'jesusfilm-editor', get_theme_file_uri( 'assets/js/editor.js' ), array(), wp_get_theme( 'jesusfilm-2023' )->get( 'Version' ), true );
}
\add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\enqueue_block_editor_scripts' );

/**
 * Load translations
 * 
 * @return void
 */
function theme_setup() {
	load_theme_textdomain( 'jesusfilm', get_template_directory() . '/languages' );
}
\add_action( 'after_setup_theme', __NAMESPACE__ . '\theme_setup' );

/**
 * Register custom blocks
 *
 * @return void
 */
function register_blocks_init() {
	register_block_type_from_metadata( __DIR__ . '/assets/js/blocks/cards' );
	register_block_type_from_metadata( __DIR__ . '/assets/js/blocks/cards-card' );
	register_block_type_from_metadata( __DIR__ . '/assets/js/blocks/expandable-menu' );
	register_block_type_from_metadata( __DIR__ . '/assets/js/blocks/expandable-menu-item' );
	register_block_type_from_metadata( __DIR__ . '/assets/js/blocks/more-link' );
	register_block_type_from_metadata( __DIR__ . '/assets/js/blocks/card' );
	register_block_type_from_metadata( __DIR__ . '/assets/js/blocks/template-part' );
	register_block_type_from_metadata( __DIR__ . '/assets/js/blocks/breadcrumbs' );
	register_block_type_from_metadata( __DIR__ . '/assets/js/blocks/blog' );
	register_block_type_from_metadata( __DIR__ . '/assets/js/blocks/blog-template', array( 'skip_inner_blocks' => true ) );
	register_block_type_from_metadata( __DIR__ . '/assets/js/blocks/blog-filter' );
}
\add_action( 'init', __NAMESPACE__ . '\register_blocks_init' );

/**
 * Clip paths
 * 
 * @see https://yoksel.github.io/relative-clip-path/
 */
function clip_paths() {
	?>

	<svg class="clip-path" style="display: none">
		<clipPath id="clip-path-1" clipPathUnits="objectBoundingBox"><path d="M0.049,0 C0.022,0,0,0.03,0,0.066 v0.508 c0,0.03,0.015,0.056,0.035,0.064 l0.941,0.361 c0.012,0.004,0.023,-0.008,0.023,-0.024 V0.066 C1,0.03,0.978,0,0.951,0 H0.049"></path></clipPath>
	</svg>

	<?php
}
\add_action( 'wp_footer', __NAMESPACE__ . '\clip_paths' );
\add_action( 'admin_footer', __NAMESPACE__ . '\clip_paths' );

/**
 * Excerpt length.
 *
 * @param int $length Default excerpt length.
 * @return int
 */
function excerpt_length( $length ) {
	return 22;
}
\add_filter( 'excerpt_length', __NAMESPACE__ . '\excerpt_length' );

/**
 * Excerpt more.
 *
 * @param string $more Default excerpt more.
 * @return string
 */
function excerpt_more( $more ) {
	return '&hellip;';
}
\add_filter( 'excerpt_more', __NAMESPACE__ . '\excerpt_more' );

function rest_api_init() {
	\register_rest_route(
		'jf/v1',
		'/blog',
		array(
			'validate_callback' => '__return_true',
			'callback'          => __NAMESPACE__ . '\rest_api_blog_endpoint',

		)
	);
}
\add_action( 'rest_api_init', __NAMESPACE__ . '\rest_api_init' );

function rest_api_blog_endpoint( $request ) {
	$block = json_decode( base64_decode( $request->get_param( 'block' ) ) );

	$block->context      = json_decode( json_encode( $block->context ), true );
	$block->parsed_block = json_decode( json_encode( $block->parsed_block ), true );

	$page_key = isset( $block->context['queryId'] ) ? 'query-' . $block->context['queryId'] . '-page' : 'query-page';
	$page     = empty( $_GET[ $page_key ] ) ? 1 : (int) $_GET[ $page_key ];

	// Use global query if needed.
	$use_global_query = ( isset( $block->context['query']['inherit'] ) && $block->context['query']['inherit'] );
	if ( $use_global_query ) {
		global $wp_query;
		$query = clone $wp_query;
	} else {
		$query_args = build_query_vars_from_query_block( $block, $page );
		$query      = new \WP_Query( $query_args );
	}

	if ( ! $query->have_posts() ) {
		return '';
	}

	if ( block_core_post_template_uses_featured_image( $block->inner_blocks ) ) {
		update_post_thumbnail_cache( $query );
	}

	$classnames = '';
	if ( isset( $block->context['displayLayout'] ) && isset( $block->context['query'] ) ) {
		if ( isset( $block->context['displayLayout']['type'] ) && 'flex' === $block->context['displayLayout']['type'] ) {
			$classnames = "is-flex-container columns-{$block->context['displayLayout']['columns']}";
		}
	}
	if ( isset( $attributes['style']['elements']['link']['color']['text'] ) ) {
		$classnames .= ' has-link-color';
	}

	$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => trim( $classnames ) ) );

	$content = '';
	while ( $query->have_posts() ) {
		$query->the_post();

		// Get an instance of the current Post Template block.
		$block_instance = $block->parsed_block;

		// Set the block name to one that does not correspond to an existing registered block.
		// This ensures that for the inner instances of the Post Template block, we do not render any block supports.
		$block_instance['blockName'] = 'core/null';

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

	$content = apply_filters( 'render_block', $content, $block->parsed_block, $block );
	// $content = gutenberg_render_layout_support_flag( $content, $block->parsed_block );

	// $core_styles_keys         = array( 'block-supports' );
	// $compiled_core_stylesheet = '';
	// $style_tag_id             = 'core';
	// // Adds comment if code is prettified to identify core styles sections in debugging.
	// $should_prettify = true;
	// foreach ( $core_styles_keys as $style_key ) {
	// if ( $should_prettify ) {
	// $compiled_core_stylesheet .= "/**\n * Core styles: $style_key\n */\n";
	// }
	// Chains core store ids to signify what the styles contain.
	// $style_tag_id             .= '-' . $style_key;
	// $compiled_core_stylesheet .= wp_style_engine_get_stylesheet_from_context( $style_key, array() );
	// }

	// var_dump( $compiled_core_stylesheet );

	/*
	* Use this function to restore the context of the template tags
	* from a secondary query loop back to the main query loop.
	* Since we use two custom loops, it's safest to always restore.
	*/
	wp_reset_postdata();

	return rest_ensure_response( $content );

}
