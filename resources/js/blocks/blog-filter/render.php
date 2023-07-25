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

global $wp_query, $wpdb;

$query_args       = $block->context['query'] ?? array();
$use_global_query = ( isset( $block->context['query']['inherit'] ) && $block->context['query']['inherit'] );

$post_ids = array();

// if ( $use_global_query ) {
// $query = build_query_vars_from_query_block( $wp_query->query_vars, 1 );
// } else {
// $query = build_query_vars_from_query_block( $block, 1 );
// }

$query = build_query_vars_from_query_block( $block, 1 );

$query['posts_per_page'] = -1;

$posts = get_posts( $query );

$post_ids = wp_list_pluck( $posts, 'ID' );

$data = array();

$type = null;


switch ( $attributes['filterType'] ?? null ) {
	case 'taxonomy':
		$type = 'taxonomy';
		$data = wp_get_object_terms(
			$post_ids,
			$attributes['filterTaxonomy'],
			array(
				'orderby' => 'name',
				'order'   => 'DESC',
			) 
		);

		if ( is_wp_error( $data ) || empty( $data ) ) {
			return array();
		}

		$data = array_map(
			function( $term ) {
				return array(
					'label'  => $term->name,
					'value'  => $term->term_id,
					'extras' => array(),
				);
			},
			$data 
		);

		break;
	case 'user':
	case 'author':
		$type            = 'author';
		$post_ids_string = implode( "', '", $post_ids );

		if ( empty( $post_ids_string ) ) {
			return array();
		}

		$users = $wpdb->get_col(
			"
			SELECT users.ID 
			FROM {$wpdb->users} users
			INNER JOIN {$wpdb->posts} posts 
				ON users.ID = posts.post_author
			INNER JOIN {$wpdb->usermeta} usermeta
				ON posts.post_author = usermeta.user_id
				AND usermeta.meta_key = 'featured'
				AND usermeta.meta_value = '1'
			WHERE posts.ID IN ('$post_ids_string')
			GROUP BY users.ID
		" 
		);

		$data = get_users(
			array(
				'include' => $users,
				'fields'  => array(
					'ID',
					'display_name',
				),
			) 
		);

		$data = array_map(
			function( $user ) {
				$user->post_count = count_user_posts( $user->ID, $query['post_type'] ?? 'post', true );

				return $user;
			},
			$data 
		);

		usort( $data, fn( $b, $a) => $a->post_count <=> $b->post_count );

		$data = array_slice( $data, 0, 10 );

		$data = array_map(
			function( $user ) {
				return array(
					'label'  => $user->display_name,
					'value'  => $user->ID,
					'extras' => array(
						'avatar' => get_avatar_url( $user->ID, 148 ),
					),
				);
			},
			$data 
		);

		break;
	default:
		// Do something.
}

?>

<div 
<?php 
echo get_block_wrapper_attributes(
	array(
		'data-attrs' => json_encode( $attributes ),
		'data-data'  => json_encode( $data ),
		'data-type'  => $type,
	) 
); 
?>
>
	</div>
