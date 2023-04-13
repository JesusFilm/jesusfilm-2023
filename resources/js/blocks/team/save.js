import classnames from 'classnames';
import { __ } from '@wordpress/i18n';
import {
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { id, url, name, title } = attributes;

	return (
		<div {...useBlockProps.save()}>
			<div className="wp-block-jf-team__media">
				{url && <img src={url} alt={name} />}
				<button
					aria-label={__('Open dialog')}
					className="wp-block-jf-team__button open"
				></button>
			</div>

			<div className="wp-block-jf-team__info">
				<h3>{name}</h3>
				<p>{title}</p>
			</div>
			<dialog className="wp-block-jf-team__dialog">
				<div className="wp-block-jf-team__dialog-media">
					{url && <img src={url} alt={name} />}
				</div>
				<div className="wp-block-jf-team__dialog-content">
					<h2>
						{name}: {title}
					</h2>
					<div {...useInnerBlocksProps.save()} />
				</div>
				<button
					aria-label={__('Close dialog')}
					className="wp-block-jf-team__button close"
				></button>
			</dialog>
		</div>
	);
}
