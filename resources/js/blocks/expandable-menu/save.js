import { InnerBlocks, RichText, useInnerBlocksProps, useBlockProps } from '@wordpress/block-editor';

import classNames from 'classnames';
import { ChevronIcon } from './icon';

export default function save({ attributes }) {
	const { title } = attributes;

	return (
		<nav {...useBlockProps.save({ className: classNames('wp-block-expandable-menu'), role: 'navigation' })}>
			<div className="wp-block-expandable-menu__title">
				<span><RichText.Content value={title} /></span>
				<ChevronIcon />
			</div>
			<ul
				{...useInnerBlocksProps.save({
					className: 'wp-block-expandable-menu__items',
				})}
			/>
		</nav>
	);
}