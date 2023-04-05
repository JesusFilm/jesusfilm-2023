/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty as _isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { useInnerBlocksProps, useBlockProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { imageFillStyles } from './media-container';

import { dimRatioToClass } from './shared';

const DEFAULT_MEDIA_SIZE_SLUG = 'full';
const noop = () => {};

export default function save({ attributes }) {
	const {
		mediaAlt,
		mediaPosition,
		mediaType,
		mediaUrl,
		mediaWidth,
		mediaId,
		verticalAlignment,
		linkClass,
		href,
		linkTarget,
		rel,
		dimRatio,
		width,
	} = attributes;
	const mediaSizeSlug = attributes.mediaSizeSlug || DEFAULT_MEDIA_SIZE_SLUG;
	const newRel = _isEmpty(rel) ? undefined : rel;

	const imageClasses = classnames({
		[`wp-image-${mediaId}`]: mediaId && mediaType === 'image',
		[`size-${mediaSizeSlug}`]: mediaId && mediaType === 'image',
	});

	let image = (
		<img src={mediaUrl} alt={mediaAlt} className={imageClasses || null} />
	);

	if (href) {
		image = (
			<a
				className={linkClass}
				href={href}
				target={linkTarget}
				rel={newRel}
			>
				{image}
			</a>
		);
	}

	const mediaTypeRenders = {
		image: () => image,
		video: () => <video src={mediaUrl} autoPlay muted loop />,
	};

	const wrapperClasses = classnames(
		'wp-block-card',
		dimRatioToClass(dimRatio),
		{
			[`is-vertically-aligned-${verticalAlignment}`]: verticalAlignment,
			[`is-media-${mediaPosition}-aligned`]:
				mediaUrl && mediaPosition !== 'bg',
			[`is-media-background`]: mediaUrl && mediaPosition === 'bg',
			[`is-no-media`]: !mediaUrl,
			[`is-media-width-${mediaWidth}`]:
				(mediaPosition === 'left' || mediaPosition === 'right') &&
				mediaUrl,
		}
	);

	const backgroundImage =
		mediaPosition === 'bg' && mediaUrl ? `url(${mediaUrl})` : undefined;

	const style = {};

	style.gridColumnEnd = width ? 'span ' + width : undefined;
	style.backgroundImage = backgroundImage;

	const blockProps = useBlockProps.save({
		className: wrapperClasses,
		style,
	});
	const innerBlocksProps = useInnerBlocksProps.save({
		className: classnames('wp-block-card__content'),
	});

	return (
		<div {...blockProps}>
			<figure className="wp-block-card__media">
				{(mediaTypeRenders[mediaType] || noop)()}
			</figure>
			<div {...innerBlocksProps} />
		</div>
	);
}
