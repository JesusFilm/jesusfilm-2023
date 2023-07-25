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

$post_type = ! empty( $block->context['query']['postType'] ) ? $block->context['query']['postType'] : 'post';

?>
<script class="wp-block-blog-template-script">
var jfQuery<?php echo (int) $block->context['queryId']; ?> = JSON.parse('<?php echo json_encode( $block->context['query'] ); ?>');
</script>
<div 
<?php 
echo get_block_wrapper_attributes(
	array(
		'class'      => 'columns-' . absint( $attributes['columns'] ?? 1 ),
		'data-block' => json_encode( $block ),
	) 
); 
?>
>
	<ul class="wp-block-jf-blog-template__posts"></ul>
</div>

<?php
