/**
 * WordPress dependencies
 */
import { Spinner } from '@wordpress/components';
import { BlockIcon, MediaPlaceholder } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { forwardRef } from '@wordpress/element';
import { isBlobURL } from '@wordpress/blob';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies
 */
import icon from './media-container-icon';
import classnames from 'classnames';

/**
 * Constants
 */
const ALLOWED_MEDIA_TYPES = ['image', 'video'];
const noop = () => {};

function PlaceholderContainer({ className, mediaUrl, onSelectMedia }) {
	const { createErrorNotice } = useDispatch(noticesStore);

	const onUploadError = (message) => {
		createErrorNotice(message, { type: 'snackbar' });
	};

	return (
		<MediaPlaceholder
			icon={<BlockIcon icon={icon} />}
			labels={{
				title: __('Media area'),
			}}
			className={className}
			onSelect={onSelectMedia}
			accept="image/*,video/*"
			allowedTypes={ALLOWED_MEDIA_TYPES}
			onError={onUploadError}
			disableMediaButtons={mediaUrl}
		/>
	);
}

function MediaContainer(props) {
	const {
		mediaAlt,
		mediaId,
		mediaType,
		mediaUrl,
		useFeaturedImage,
		featuredImage,
		media,
	} = props;

	const isTemporaryMedia = !mediaId && isBlobURL(mediaUrl);

	const classes = classnames('wp-block-card__media');

	if (useFeaturedImage) {
		if (!featuredImage) {
			return (
				<figure className={classes}>
					<PlaceholderContainer {...props} />
				</figure>
			);
		} else if (!media) {
			return (
				<figure className={classes}>
					<PlaceholderContainer {...props} />
				</figure>
			);
		}
		return <img src={media.source_url} alt={media.alt} />;
	}

	if (mediaUrl) {
		const mediaTypeRenderers = {
			image: () => <img src={mediaUrl} alt={mediaAlt} />,
			video: () => <video src={mediaUrl} autoPlay muted loop />,
		};

		return (
			<figure className={classes}>
				{(mediaTypeRenderers[mediaType] || noop)()}
				{isTemporaryMedia && <Spinner />}
				<PlaceholderContainer {...props} />
			</figure>
		);
	}

	return (
		<figure className={classes}>
			<PlaceholderContainer {...props} />
		</figure>
	);
}

export default forwardRef(MediaContainer);
