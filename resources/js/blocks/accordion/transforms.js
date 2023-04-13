/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';

const transforms = {
	from: [
		{
			type: 'block',
			blocks: ['genesis-blocks/gb-accordion'],
			transform: ({ accordionTitle }, innerBlocks) =>
				createBlock(
					'jf/accordion',
					{
						title: accordionTitle,
					},
					innerBlocks
				),
		},
	],
};

export default transforms;
