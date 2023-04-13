/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';

const transforms = {
	to: [
		{
			type: 'block',
			blocks: ['core/buttons'],
			transform: ({ textAlign, url, text, linkTarget }) =>
				createBlock(
					'core/buttons',
					{
						align: textAlign,
					},
					[
						createBlock('core/button', {
							url,
							linkTarget,
							text,
						}),
					]
				),
		},
	],
};

export default transforms;
