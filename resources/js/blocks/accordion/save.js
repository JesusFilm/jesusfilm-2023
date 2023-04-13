import classnames from 'classnames';

import { RichText, useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { title, subtitle } = attributes;

	return (
		<details { ...useBlockProps.save() }>
			<summary>
				<RichText.Content tagName="span" value={ title } />
				<RichText.Content tagName="small" value={ subtitle } />
			</summary>
			<div { ...useInnerBlocksProps.save() } />
		</details>
	);
}
