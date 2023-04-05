import { __ } from '@wordpress/i18n';
import {
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import classNames from 'classnames';

import { ChevronIcon } from './icon';

const ALLOWED_BLOCKS = ['cloudcatch/expandable-menu-item'];

const DEFAULT_BLOCK = {
	name: 'cloudcatch/expandable-menu-item',
};

const LAYOUT = {
	type: 'default',
	alignments: [],
};

export default function Edit({ attributes, setAttributes }) {
	const { layout: { orientation = 'horizontal' } = {}, title } = attributes;

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: classNames('wp-block-expandable-menu__items'),
		},
		{
			allowedBlocks: ALLOWED_BLOCKS,
			__experimentalDefaultBlock: DEFAULT_BLOCK,
			__experimentalDirectInsert: true,
			orientation,
			template: [
				['cloudcatch/expandable-menu-item'],
				['cloudcatch/expandable-menu-item'],
				['cloudcatch/expandable-menu-item'],
			],
			templateLock: false,
			__experimentalLayout: LAYOUT,
		}
	);

	return (
		<>
			<nav
				{...useBlockProps({
					className: 'wp-block-expandable-menu',
					role: 'navigation',
				})}
			>
				<div className="wp-block-expandable-menu__title">
					<RichText
						identifier="title"
						tagName="span"
						value={title}
						onChange={(value) => setAttributes({ title: value })}
						aria-label={__('Title text')}
						placeholder={__('Title')}
					/>
					<ChevronIcon />
				</div>

				<ul {...innerBlocksProps} />
			</nav>
		</>
	);
}
