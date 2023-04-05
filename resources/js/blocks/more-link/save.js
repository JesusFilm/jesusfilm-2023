import classNames from 'classnames';

import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { text, textAlign, linkTarget, url, className } = attributes;

	if (!text) {
		return null;
	}

	const wrapperClasses = classNames(className, {
		[`has-text-align-${textAlign}`]: textAlign,
	});

	return (
		<div {...useBlockProps.save({ className: wrapperClasses })}>
			<RichText.Content
				tagName="a"
				value={text}
				target={linkTarget}
				href={url}
			/>
		</div>
	);
}
