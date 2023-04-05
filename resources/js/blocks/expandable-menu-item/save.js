import { useBlockProps } from '@wordpress/block-editor';

import classNames from 'classnames';

export default function save(props) {
	const { attributes } = props;

	const { label, opensInNewTab, url, rel } = attributes;

	return (
		<li
			{...useBlockProps.save({
				className: classNames('wp-block-expandable-menu-item'),
			})}
		>
			<a
				href={url}
				rel={rel}
				aria-expanded="false"
				target={opensInNewTab ? '_blank' : '_self'}
			>
				{label}
			</a>
		</li>
	);
}
