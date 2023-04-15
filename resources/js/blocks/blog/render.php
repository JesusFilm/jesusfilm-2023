<?php
/**
 * Blog renderer.
 * 
 * @global $attributes array The block attributes.
 * @global $content string The block default content.
 * @global $block WP_Block The block instance.
 * 
 * @package JesusFilm/JesusFilm-2023
 */

?>
<script>
var jfQuery<?php echo (int) $block->parsed_block['attrs']['queryId']; ?> = JSON.parse('<?php echo json_encode( $block->parsed_block['attrs']['query'] ); ?>');
</script>
<div <?php echo get_block_wrapper_attributes( array( 'data-query' => json_encode( $attributes['query'] ) ) ); ?>>
	<?php echo $content; ?>
</div>
