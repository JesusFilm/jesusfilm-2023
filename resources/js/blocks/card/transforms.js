/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';

const transforms = {
	to: [
		{
			type: 'block',
			blocks: ['cloudcatch/cards'],
			transform: ({ url }, innerBlocks) =>
				createBlock(
					'cloudcatch/cards',
					{
						columns: 1,
					},
					[
						createBlock(
							'cloudcatch/cards-card',
							{
								mediaUrl: url,
								mediaType: 'image',
							},
							innerBlocks
						),
					]
				),
		},
	],
};

export default transforms;
