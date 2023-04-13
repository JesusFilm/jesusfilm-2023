<?php
/**
 * Template Part: Mission Trip
 *
 * @package JesusFilm/JesusFilm-2023
 */

$regions = \wp_get_post_terms( \get_the_ID(), 'region' );

if ( ! $regions || \is_wp_error( $regions ) ) {
	$regions = array();
} else {
	$regions = \wp_list_pluck( $regions, 'name' );
}
?>

<article <?php \post_class( 'card' ); ?> id="post-<?php \the_ID(); ?>">
	<div class="card-top">
		<a href="<?php \the_permalink(); ?>" title="<?php echo \esc_attr( \get_the_title() ); ?>">
			<?php \the_post_thumbnail( 'large' ); ?>
		</a>
	</div>
	<div class="card-bottom">
		<div class="card-copy">
			<div class="card-meta">
				<span><?php echo \esc_html( implode( ', ', $regions ) ); ?></span>
			</div>
			<?php \the_title( '<h4><a href="' . \esc_url( \get_permalink() ) . '" title="' . \esc_attr( \get_the_title() ) . '">', '</a></h4>' ); ?>
			<div class="subheading">
				<?php
					$start_date = \DateTime::createFromFormat( 'Ymd', \get_post_meta( \get_the_ID(), 'date_start', true ) );
					$end_date   = \DateTime::createFromFormat( 'Ymd', \get_post_meta( \get_the_ID(), 'date_end', true ) );
				
				if ( $start_date && $end_date ) {
					printf( '%s - %s', \esc_html( $start_date->format( 'F j, Y' ) ), \esc_html( $end_date->format( 'F j, Y' ) ) );
				} elseif ( $start_date && ! $end_date ) {
					printf( '%s %s', \esc_html__( 'Starting', 'jesusfilm-2023' ), \esc_html( $start_date->format( 'F j, Y' ) ) );
				} elseif ( ! $start_date && $end_date ) {
					printf( '%s %s', \esc_html__( 'Thru', 'jesusfilm-2023' ), \esc_html( $end_date->format( 'F j, Y' ) ) );
				}
				?>
			</div>
		</div>
	</div>
	<div class="card-footer">
		<?php
			$mission_trip_meta = \get_post_meta( \get_the_ID() );

			$details = '<dl class="mission-trip-specs">';
		
		foreach ( $mission_trip_meta as $key => $meta ) {
			switch ( $key ) {
				case 'strategies':
					$strategies = wp_get_post_terms( \get_the_ID(), 'strategy', array( 'hide_empty' => false ) );

					if ( $strategies && ! \is_wp_error( $strategies ) ) {
						$strategies = array_map(
							function( $strategy ) {

								return sprintf( '<a href="%s">%s</a>', get_term_link( $strategy->term_id, 'strategy' ), esc_html( $strategy->name ) );

							},
							$strategies 
						);

						$details .= sprintf( "<dt data-meta=\"%s\">%s</dt>\n<dd>%s</dd>\n", \esc_attr( $key ), esc_html__( 'Strategies', 'jesusfilm-2023' ), "<ul>\n" . implode( ', ', $strategies ) . "\n</ul>" );
					}
					break;
				case 'cost':
					$details .= sprintf( "<dt data-meta=\"%s\">%s</dt>\n<dd>%s</dd>\n", \esc_attr( $key ), esc_html__( 'Cost', 'jesusfilm-2023' ), esc_html( current( $meta ) ) );
					break;
				case 'status':
					$details .= sprintf( "<dt data-meta=\"%1\$s\">%2\$s</dt>\n<dd data-status=\"%3\$s\">%3\$s</dd>\n", \esc_attr( $key ), esc_html__( 'Status', 'jesusfilm-2023' ), esc_html( ucfirst( current( $meta ) ) ) );
					break;
			}
		}
		
			$details .= '</dl>' . "\n";

			echo $details;
		?>
	</div>
</article>
