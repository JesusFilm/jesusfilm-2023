import {
	createBlock,
	getBlockType,
	getBlockVariations,
} from '@wordpress/blocks';

const DEFAULT_EMBED_BLOCK = 'core/embed';
const WP_EMBED_TYPE = 'wp-embed';


export function dimRatioToClass(ratio) {
	return ratio === 0 || !ratio === undefined || null == ratio
		? null
		: 'has-background-dim-' + 10 * Math.round(ratio / 10);
}

export const matchesPatterns = ( url, patterns = [] ) =>
	patterns.some( ( pattern ) => url.match( pattern ) );

export const findMoreSuitableBlock = ( url ) =>
	getBlockVariations( DEFAULT_EMBED_BLOCK )?.find( ( { patterns } ) =>
		matchesPatterns( url, patterns )
	);

export function createUpgradedEmbedBlock( props, attributesFromPreview = {} ) {
	const { preview, attributes = {} } = props;
	const { url, providerNameSlug, type, ...restAttributes } = attributes;

	if ( ! url || ! getBlockType( DEFAULT_EMBED_BLOCK ) ) return;

	const matchedBlock = findMoreSuitableBlock( url );

	// WordPress blocks can work on multiple sites, and so don't have patterns,
	// so if we're in a WordPress block, assume the user has chosen it for a WordPress URL.
	const isCurrentBlockWP =
		providerNameSlug === 'wordpress' || type === WP_EMBED_TYPE;
	// If current block is not WordPress and a more suitable block found
	// that is different from the current one, create the new matched block.
	const shouldCreateNewBlock =
		! isCurrentBlockWP &&
		matchedBlock &&
		( matchedBlock.attributes.providerNameSlug !== providerNameSlug ||
			! providerNameSlug );
	if ( shouldCreateNewBlock ) {
		return createBlock( DEFAULT_EMBED_BLOCK, {
			url,
			...restAttributes,
			...matchedBlock.attributes,
		} );
	}

	const wpVariation = getBlockVariations( DEFAULT_EMBED_BLOCK )?.find(
		( { name } ) => name === 'wordpress'
	);

	// We can't match the URL for WordPress embeds, we have to check the HTML instead.
	if (
		! wpVariation ||
		! preview ||
		! isFromWordPress( preview.html ) ||
		isCurrentBlockWP
	) {
		return;
	}

	// This is not the WordPress embed block so transform it into one.
	return createBlock( DEFAULT_EMBED_BLOCK, {
		url,
		...wpVariation.attributes,
		// By now we have the preview, but when the new block first renders, it
		// won't have had all the attributes set, and so won't get the correct
		// type and it won't render correctly. So, we pass through the current attributes
		// here so that the initial render works when we switch to the WordPress
		// block. This only affects the WordPress block because it can't be
		// rendered in the usual Sandbox (it has a sandbox of its own) and it
		// relies on the preview to set the correct render type.
		...attributesFromPreview,
	} );
};