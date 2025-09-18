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
	register_block_type_from_metadata( __DIR__ . '/assets/js/blocks/more-link' );
	register_block_type_from_metadata( __DIR__ . '/assets/js/blocks/card' );
	register_block_type_from_metadata( __DIR__ . '/assets/js/blocks/breadcrumbs' );
	register_block_type_from_metadata( __DIR__ . '/assets/js/blocks/blog' );
	register_block_type_from_metadata( __DIR__ . '/assets/js/blocks/blog-template', array( 'skip_inner_blocks' => true ) );
	register_block_type_from_metadata( __DIR__ . '/assets/js/blocks/blog-filter' );
	register_block_type_from_metadata( __DIR__ . '/assets/js/blocks/table-of-contents' );
	register_block_type_from_metadata( __DIR__ . '/assets/js/blocks/accordion' );
	register_block_type_from_metadata( __DIR__ . '/assets/js/blocks/team' );
}
\add_action( 'init', __NAMESPACE__ . '\register_blocks_init' );

/**
 * Clip paths
 * 
 * @see https://yoksel.github.io/relative-clip-path/
 */
function clip_paths() {
	?>

	<svg class="clip-path">
		<clipPath id="clip-path-1" clipPathUnits="objectBoundingBox"><path d="M0.049,0 C0.022,0,0,0.03,0,0.066 v0.508 c0,0.03,0.015,0.056,0.035,0.064 l0.941,0.361 c0.012,0.004,0.023,-0.008,0.023,-0.024 V0.066 C1,0.03,0.978,0,0.951,0 H0.049"></path></clipPath>
	</svg>

	<script>
		document.addEventListener( 'splideReady', function( e ) {
			e.detail.defaults = {
				arrowPath: 'M33.7,12.7c5.4,3.4,5.4,11.2,0,14.6L15.5,38.7c-5.7,3.6-13.2-0.5-13.2-7.3V8.6c0-6.8,7.4-10.9,13.2-7.3L33.7,12.7z'
			};
		} );
	</script>

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

/**
 * Register API endpoints
 *
 * @return void
 */
function rest_api_init() {
	\register_rest_route(
		'jf/v1',
		'/blog',
		array(
			'methods'           => \WP_REST_Server::ALLMETHODS,
			'validate_callback' => '__return_true',
			'callback'          => __NAMESPACE__ . '\rest_api_blog_endpoint',

		)
	);
}
\add_action( 'rest_api_init', __NAMESPACE__ . '\rest_api_init' );

/**
 * Blog endpoints
 *
 * @param WP_REST_Request $request Request object.
 * @return string
 */
function rest_api_blog_endpoint( $request ) {
	$body       = json_decode( $request->get_body() );
	$block      = json_decode( $body->block );
	$query_args = $body->query;

	$block->context      = json_decode( json_encode( $block->context ), true );
	$block->parsed_block = json_decode( json_encode( $block->parsed_block ), true );

	$page_key = isset( $block->context['queryId'] ) ? 'query-' . $block->context['queryId'] . '-page' : 'query-page';
	$page     = empty( $_GET[ $page_key ] ) ? 1 : (int) $_GET[ $page_key ];

	$query = new \WP_Query( build_query_vars_from_query_block( $block, $page ) );

	if ( ! $query->have_posts() ) {
		return '<p>' . esc_html__( 'No results found.', 'jesusfilm-2023' ) . '</p>';
	}

	$found_posts   = $query->found_posts;
	$max_num_pages = $query->max_num_pages;

	if ( isset( $query_args->pages ) && $query_args->pages > 0 ) {
		$max_num_pages = (int) $query_args->pages;
	}

	header( "X-Wp-Total: $found_posts" );
	header( "X-Wp-Totalpages: $max_num_pages" );

	$classnames = '';
	if ( isset( $block->context['displayLayout'] ) && isset( $block->context['query'] ) ) {
		if ( isset( $block->context['displayLayout']['type'] ) && 'flex' === $block->context['displayLayout']['type'] ) {
			$classnames = "is-flex-container columns-{$block->context['displayLayout']['columns']}";
		}
	}
	if ( isset( $attributes['style']['elements']['link']['color']['text'] ) ) {
		$classnames .= ' has-link-color';
	}

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

	$content = apply_filters( 'render_block', $content, $block->parsed_block, $block ); // phpcs:ignore
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

	/*
	* Use this function to restore the context of the template tags
	* from a secondary query loop back to the main query loop.
	* Since we use two custom loops, it's safest to always restore.
	*/
	wp_reset_postdata();

	return rest_ensure_response( $content );
}

/**
 * Render card featured image
 *
 * @param string   $block_content Block content.
 * @param array    $block Block attributes.
 * @param WP_Block $instance Block instance.
 * @return string
 */
function card_renderer( $block_content, $block, $instance ) {
	if ( 'cloudcatch/cards-card' === $block['blockName'] ) {

		if ( ! ( $block['attrs']['useFeaturedImage'] ?? false ) ) {
			return $block_content;
		}

		if ( ! isset( $instance->context['postId'] ) ) {
			return $block_content;
		}

		$post_ID        = $instance->context['postId'];
		$featured_image = get_the_post_thumbnail_url( $post_ID, 'full' );

		$w = new \WP_HTML_Tag_Processor( $block_content );
		$w->next_tag(
			array(
				'class_name' => 'wp-block-card__media',
			)
		);

		$w->next_tag();

		if ( 'IMG' === $w->get_tag() ) {
			if ( $featured_image ) {
				$w->set_attribute( 'src', $featured_image );
			} else {
				$w->set_attribute( 'style', 'display: none;' );
			}       
		}

		return $w;
	}

	return $block_content;
}
\add_filter( 'render_block', __NAMESPACE__ . '\card_renderer', 10, 3 );

/**
 * Redirect to URL if query parameter is provided.
 *
 * @return void
 */
function branded_checkout_redirect_callback() {
	?>

	<script>
		function brandedCheckoutRedirect() {
			const queryString = window.location.search;
			const urlParams = new URLSearchParams(queryString);
			const maybeRedirect = urlParams.get('thankYouRedirect');
			if (maybeRedirect && maybeRedirect.length > 0) {
				window.location = maybeRedirect;
			}
		}
		window.onOrderCompleted = function () { brandedCheckoutRedirect(); };
	</script>

	<?php
}
\add_action( 'wp_footer', __NAMESPACE__ . '\branded_checkout_redirect_callback' );

/**
 * Provides deeper context to blog template + filter
 *
 * @param array         $context Default context.
 * @param array         $parsed_block Block being rendered, filtered by render_block_data.
 * @param WP_Block|null $parent_block If this is a nested block, a reference to the parent block.
 * @return array
 */
function blog_block_context( $context, $parsed_block, $parent_block ) {

	if ( isset( $parsed_block['blockName'], $parent_block->context ) && in_array( $parsed_block['blockName'], array( 'jf/blog-template', 'jf/blog-filter' ) ) ) {
		$use_global_query = ( isset( $context['query']['inherit'] ) && $context['query']['inherit'] );
		$page             = max( 1, get_query_var( 'paged' ) );

		$context['query']['perPage']        = $context['query']['perPage'] ?: get_option( 'posts_per_page', 10 );
		$context['query']['originalOffset'] = $context['query']['offset'];
		$context['query']['offset']         = ( $context['query']['perPage'] * ( $page - 1 ) ) + $context['query']['offset'];

		if ( $use_global_query ) {
			$context['query']['postType'] = get_query_var( 'post_type' ) ?? 'post';

			if ( is_category() ) {
				$context['query']['taxQuery'] = array(
					'category' => array( get_query_var( 'cat' ) ),
				);
			} elseif ( is_tag() ) {
				$context['query']['taxQuery'] = array(
					'post_tag' => array( get_query_var( 'tag_id' ) ),
				);
			} elseif ( is_tax() ) {
				$term = get_queried_object();

				$context['query']['taxQuery'] = array(
					$term->taxonomy => array( $term->term_id ),
				);
			} elseif ( is_search() ) {
				$context['query']['search'] = get_query_var( 's' );
			} elseif ( is_author() ) {
				$context['query']['author'] = get_query_var( 'author' );
			}
		}
	}

	return $context;
}
\add_filter( 'render_block_context', __NAMESPACE__ . '\blog_block_context', 10, 3 );

/**
 * Display the start date + end date of mission trip
 *
 * @param string   $block_content Default block content.
 * @param array    $attributes Block attributes.
 * @param WP_Block $block Instance of the block.
 * @param int      $post_id Post ID.
 * @return string
 */
function meta_field_mission_trip_date( $block_content, $attributes, $block, $post_id ) {
	$field_name = $attributes['fieldName'] ?? '';
	$post_type  = get_post_type( $post_id );

	if ( 'date_start' === $field_name && 'mission-trip' === $post_type ) {
		$date_start = get_post_meta( $post_id, 'date_start', true );
		$date_end   = get_post_meta( $post_id, 'date_end', true );

		$block_content = gmdate( 'F j, Y', strtotime( $date_start ) ) . ' - ' . gmdate( 'F j, Y', strtotime( $date_end ) );
	}

	return $block_content;
}
\add_filter( 'meta_field_block_get_block_content', __NAMESPACE__ . '\meta_field_mission_trip_date', 10, 4 );

// Create a function to build the full name from two meta fields.
function meta_field_event_date( $post_id ) {
	$start_date = get_post_meta( $post_id, 'start_date', true );

	if ( empty( $start_date ) ) {
		return '';
	}
  
	return sprintf( '<div><span>%s</span><span>%s</span></div>', esc_html( gmdate( 'M', strtotime( $start_date ) ) ), esc_html( gmdate( 'd', strtotime( $start_date ) ) ) );
}

function meta_field_event_time( $post_id ) {
	$start_time = get_post_meta( $post_id, 'start_time', true );
	$end_time   = get_post_meta( $post_id, 'end_time', true );

	if ( empty( $start_time ) ) {
		return '';
	}

	$time = implode( ' - ', array_filter( array( gmdate( 'g:i A', strtotime( $start_time ) ), gmdate( 'g:i A', strtotime( $end_time ) ) ) ) );
  
	return $time;
}
  
	// Register a custom rest field for the full name.
\add_action(
	'rest_api_init',
	function () {
		register_rest_field(
			array( 'event' ),
			'event_date',
			array(
				'get_callback' => function ( $post_array ) {
					return meta_field_event_date( $post_array['id'] );
				},
				'schema'       => array(
					'type' => 'string',
				),
			)
		);

		register_rest_field(
			array( 'event' ),
			'event_time',
			array(
				'get_callback' => function ( $post_array ) {
					return meta_field_event_date( $post_array['id'] );
				},
				'schema'       => array(
					'type' => 'string',
				),
			)
		);
	}
);

// Render the block on the front end.
\add_filter(
	'meta_field_block_get_block_content',
	function ( $block_content, $attributes, $block, $post_id ) {
		$field_name = $attributes['fieldName'] ?? '';
  
		if ( 'event_date' === $field_name ) {
			$block_content = meta_field_event_date( $post_id );
		}

		if ( 'event_time' === $field_name ) {
			$block_content = meta_field_event_time( $post_id );
		}
  
		return $block_content;
	},
	10,
	4
);

\add_filter(
	'render_block',
	function ( $block_content, $block, $instance ) {
		if ( 'core/button' === $block['blockName'] ) {
			global $post;

			$w = new \WP_HTML_Tag_Processor( $block_content );
			$w->next_tag( 'a' );

			$href = $w->get_attribute( 'href' );

			if ( is_a( $post, 'WP_Post' ) ) {
				if ( false !== strpos( $href, '{{link}}' ) ) {
					$w->set_attribute( 'href', get_permalink( $post ) );

					return $w;
				} elseif ( false !== strpos( $href, '{{rsvp}}' ) ) {
					$rsvp = get_post_meta( $post->ID, 'rsvp', true );

					if ( ! empty( $rsvp ) ) {
						$w->set_attribute( 'href', esc_url( $rsvp ) );

						return $w;
					} else {
						return '';
					}           
				}
			}
		}

		return $block_content;
	},
	10,
	3 
);
