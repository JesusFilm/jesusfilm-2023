/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';

const transforms = {
	from: [
		{
			type: 'block',
			blocks: ['core/columns'],
			isMatch: (attributes, block) => {
				return block.innerBlocks[0]?.innerBlocks[0]?.name === 'jf/card';
			},
			transform: ({ columns }, innerBlocks) =>
				createBlock(
					'cloudcatch/cards',
					{
						columns,
					},
					innerBlocks.map((column) => {
						return createBlock(
							'cloudcatch/cards-card',
							{
								mediaUrl:
									column.innerBlocks[0]?.attributes?.url,
								mediaType: 'image',
							},
							column.innerBlocks[0]?.innerBlocks
						);
					})
				),
		},
	],
};

export default transforms;
