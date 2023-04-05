import classnames from 'classnames';

import { RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { url, alt, caption, href, linkClass, noMedia } = attributes;

	const classes = classnames({}, 'wp-block-card');

	const image = <img src={url} alt={alt} />;

	const figure = (
		<>
			{href ? (
				<a className={linkClass} href={href}>
					{image}
				</a>
			) : (
				image
			)}
			{!RichText.isEmpty(caption) && (
				<RichText.Content tagName="figcaption" value={caption} />
			)}
		</>
	);

	return (
		<div {...useBlockProps.save({ className: classes })}>
			{!noMedia && url && (
				<div className="wp-block-jf-card-media">{figure}</div>
			)}
			<div className="wp-block-jf-card-bottom">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
