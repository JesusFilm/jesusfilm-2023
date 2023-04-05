import classNames from 'classnames';
import get from 'lodash/get';
import has from 'lodash/has';
import pick from 'lodash/pick';
import map from 'lodash/map';
import filter from 'lodash/filter';

// import useDimensionHandler from './use-dimension-handler';

import { __ } from '@wordpress/i18n';
import { getBlobByURL, isBlobURL, revokeBlobURL } from '@wordpress/blob';
import {
	BlockControls,
	InnerBlocks,
	useBlockProps,
	AlignmentControl,
	InspectorControls,
	MediaPlaceholder,
	store,
	MediaReplaceFlow,
	__experimentalImageSizeControl as ImageSizeControl,
} from '@wordpress/block-editor';
import { PanelBody, ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useEffect, createRef, useRef, useState } from '@wordpress/element';

export const pickRelevantMediaFiles = (image, size) => {
	const imageProps = pick(image, ['alt', 'id', 'link', 'caption']);
	imageProps.url =
		get(image, ['sizes', size, 'url']) ||
		get(image, ['media_details', 'sizes', size, 'source_url']) ||
		image.url;
	return imageProps;
};

/**
 * Is the URL a temporary blob URL? A blob URL is one that is used temporarily
 * while the image is being uploaded and will not have an id yet allocated.
 *
 * @param {number=} id  The id of the image.
 * @param {string=} url The url of the image.
 *
 * @return {boolean} Is the URL a Blob URL
 */
const isTemporaryImage = (id, url) => !id && isBlobURL(url);

/**
 * Is the url for the image hosted externally. An externally hosted image has no
 * id and is not a blob url.
 *
 * @param {number=} id  The id of the image.
 * @param {string=} url The url of the image.
 *
 * @return {boolean} Is the url an externally hosted url?
 */
export const isExternalImage = (id, url) => url && !id && !isBlobURL(url);

/**
 * Checks if WP generated default image size. Size generation is skipped
 * when the image is smaller than the said size.
 *
 * @param {Object} image
 * @param {string} defaultSize
 *
 * @return {boolean} Whether or not it has default image size.
 */
function hasDefaultSize(image, defaultSize) {
	return (
		has(image, ['sizes', defaultSize, 'url']) ||
		has(image, ['media_details', 'sizes', defaultSize, 'source_url'])
	);
}

/**
 * Checks if a media attachment object has been "destroyed",
 * that is, removed from the media library. The core Media Library
 * adds a `destroyed` property to a deleted attachment object in the media collection.
 *
 * @param {number} id The attachment id.
 *
 * @return {boolean} Whether the image has been destroyed.
 */
export function isMediaDestroyed(id) {
	const attachment = wp?.media?.attachment(id) || {};
	return attachment.destroyed;
}

export default function edit({
	attributes,
	setAttributes,
	className,
	insertBlocksAfter,
	onReplace,
	isSelected,
	context,
	clientId,
}) {
	const { id, mediaAlt, url, mediaLink, noMedia, width, height, align } =
		attributes;
	const sizeSlug = attributes.sizeSlug || 'full';
	const [temporaryURL, setTemporaryURL] = useState();
	const { imageDefaultSize, mediaUpload } = useSelect((select) => {
		const { getSettings } = select(store);
		return pick(getSettings(), ['imageDefaultSize', 'mediaUpload']);
	}, []);

	const ref = useRef();

	// const {
	// 	currentHeight,
	// 	currentWidth,
	// 	updateDimension,
	// 	updateDimensions,
	// } = useDimensionHandler( height, width, imageHeight, imageWidth, onChange );

	useEffect(() => {
		if (!id && isBlobURL(url)) {
			const file = getBlobByURL(url);

			if (file) {
				mediaUpload({
					filesList: [file],
					onFileChange: ([{ id: id, url }]) => {
						setAttributes({ id, src: url });
					},
					onError: (e) => {
						setAttributes({ src: undefined, id: undefined });
					},
					allowedTypes: ['image'],
				});
			}
		}
	}, []);

	const editMediaButtonRef = createRef();

	function onSelectURL(newSrc) {
		if (newSrc !== url) {
			setAttributes({ src: newSrc, id: undefined, noMedia: false });
		}
	}

	function onUploadError(message) {
		console.error(message);
	}

	function onSelectImage(media) {
		if (!media || !media.url) {
			// in this case there was an error and we should continue in the editing state
			// previous attributes should be removed because they may be temporary blob urls
			setAttributes({ url: undefined, id: undefined });
			return;
		}

		if (isBlobURL(media.url)) {
			setTemporaryURL(media.url);
			return;
		}

		setTemporaryURL();

		let additionalAttributes;
		// Reset the dimension attributes if changing to a different image.
		if (!media.id || media.id !== id) {
			additionalAttributes = {
				width: undefined,
				height: undefined,
				// Fallback to size "full" if there's no default image size.
				// It means the image is smaller, and the block will use a full-size URL.
				sizeSlug: hasDefaultSize(media, imageDefaultSize)
					? imageDefaultSize
					: 'full',
			};
		} else {
			// Keep the same url when selecting the same file, so "Image Size"
			// option is not changed.
			additionalAttributes = { url };
		}

		// sets the block's attribute and updates the edit component from the
		// selected media, then switches off the editing UI
		setAttributes({
			url: media.url,
			id: media.id,
			noMedia: false,
			...additionalAttributes,
		});
	}

	function onSelectURL(newURL) {
		if (newURL !== url) {
			setAttributes({
				url: newURL,
				id: undefined,
				width: undefined,
				height: undefined,
				sizeSlug: imageDefaultSize,
			});
		}
	}

	function onCloseModal() {
		if (isMediaDestroyed(attributes?.id)) {
			setAttributes({
				url: undefined,
				id: undefined,
			});
		}
	}

	function onImageError(isReplaced = false) {
		// If the image block was not replaced with an embed,
		// clear the attributes and trigger the placeholder.
		if (!isReplaced) {
			setAttributes({
				url: undefined,
				id: undefined,
			});
		}
	}

	function onRemoveImage() {
		setAttributes({ url: undefined, id: undefined, noMedia: true });
	}

	const image = useSelect(
		(select) => (id && isSelected ? select(coreStore).getMedia(id) : null),
		[isSelected, id]
	);

	const imageSizes = useSelect((select) => {
		const settings = select(store).getSettings();
		return settings?.imageSizes;
	}, []);

	function getImageSourceUrlBySizeSlug(_image, slug) {
		// eslint-disable-next-line camelcase
		return _image?.media_details?.sizes?.[slug]?.source_url;
	}

	const imageSizeOptions = map(
		filter(imageSizes, ({ slug }) =>
			getImageSourceUrlBySizeSlug(image, slug)
		),
		({ name, slug }) => ({ value: slug, label: name })
	);

	const updateImage = (newMediaSizeSlug) => {
		const newUrl = getImageSourceUrlBySizeSlug(image, newMediaSizeSlug);

		if (!newUrl) {
			return null;
		}

		setAttributes({
			url: newUrl,
			sizeSlug: newMediaSizeSlug,
		});
	};

	let isTemp = isTemporaryImage(id, url);

	// Upload a temporary image on mount.
	useEffect(() => {
		if (!isTemp) {
			return;
		}

		const file = getBlobByURL(url);

		if (file) {
			mediaUpload({
				filesList: [file],
				onFileChange: ([img]) => {
					onSelectImage(img);
				},
				allowedTypes: ['image'],
				onError: (message) => {
					isTemp = false;
					setAttributes({
						src: undefined,
						id: undefined,
						url: undefined,
					});
				},
			});
		}
	}, []);

	// If an image is temporary, revoke the Blob url when it is uploaded (and is
	// no longer temporary).
	useEffect(() => {
		if (isTemp) {
			setTemporaryURL(url);
			return;
		}
		revokeBlobURL(temporaryURL);
	}, [isTemp, url]);

	const isExternal = isExternalImage(id, url);
	const src = isExternal ? url : undefined;

	const controls = (
		<>
			<BlockControls group="block">
				<AlignmentControl
					value={align}
					onChange={(nextAlign) => {
						setAttributes({ align: nextAlign });
					}}
				/>
				<ToolbarGroup>
					{!noMedia && (
						<ToolbarButton onClick={onRemoveImage}>
							{__('Remove Image')}
						</ToolbarButton>
					)}
					<MediaReplaceFlow
						id={id}
						mediaURL={url}
						allowedTypes={['image']}
						accept="image/*"
						onSelect={onSelectImage}
						name={!url ? __('Add Image') : __('Replace')}
					/>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={__('Card settings')}>
					<ImageSizeControl
						onChangeImage={updateImage}
						slug={sizeSlug}
						width={width}
						height={height}
						// imageWidth={ naturalWidth }
						// imageHeight={ naturalHeight }
						imageSizeOptions={imageSizeOptions}
						isResizable={true}
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);

	const classes = classNames(className, 'wp-block-card', {
		[`size-${sizeSlug}`]: sizeSlug,
		[`has-text-align-${align}`]: align,
	});

	const blockProps = useBlockProps({
		ref,
		className: classes,
	});

	return (
		<>
			{controls}
			<div {...blockProps}>
				{url && !noMedia && (
					<div className="wp-block-jf-card-media">
						<img src={url} />
					</div>
				)}
				{!noMedia && (!url || true) && (
					<div className="wp-block-jf-card-media">
						<MediaPlaceholder
							labels={{
								title: __('Card'),
								instructions: __(
									'Drag and drop media onto this block, upload, or select existing media from your library.'
								),
							}}
							onSelect={onSelectImage}
							onSelectURL={onSelectURL}
							accept="image/*"
							allowedTypes={['image']}
							value={{ id, url }}
							onError={onUploadError}
							disableMediaButtons={url}
						/>
					</div>
				)}
				<div className="wp-block-jf-card-bottom">
					<InnerBlocks />
				</div>
			</div>
		</>
	);
}
