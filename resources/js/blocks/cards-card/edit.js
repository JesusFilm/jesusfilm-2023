/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	BlockControls,
	BlockVerticalAlignmentToolbar,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
	MediaReplaceFlow,
} from '@wordpress/block-editor';
import {
	ToolbarDropdownMenu,
	PanelBody,
	Button,
	ButtonGroup,
	ToolbarGroup,
	ToolbarButton,
	RangeControl,
} from '@wordpress/components';
import { isBlobURL, getBlobTypeByURL } from '@wordpress/blob';
import { useSelect, useDispatch } from '@wordpress/data';
import { pullLeft, pullRight } from '@wordpress/icons';
import { useEntityProp, store as coreStore } from '@wordpress/core-data';

import { useRef, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { SVG, Path } from '@wordpress/primitives';

import MediaContainer from './media-container';
import { pullTop, pullBg } from './icons';
import { dimRatioToClass, createUpgradedEmbedBlock } from './shared';

const LINK_DESTINATION_MEDIA = 'media';
const LINK_DESTINATION_ATTACHMENT = 'attachment';
const ALLOWED_MEDIA_TYPES = ['image', 'video'];

const placeholderIllustration = (
	<SVG
		className="components-placeholder__illustration"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 60 60"
		preserveAspectRatio="none"
	>
		<Path vectorEffect="non-scaling-stroke" d="M60 60 0 0" />
	</SVG>
);

const placeholderChip = (
	<div className="wp-block-post-featured-image__placeholder">
		{placeholderIllustration}
	</div>
);

function attributesFromMedia({ attributes, setAttributes }) {
	return (media) => {
		if (!media || !media.url) {
			setAttributes({
				mediaAlt: undefined,
				mediaId: undefined,
				mediaType: undefined,
				mediaUrl: undefined,
				mediaLink: undefined,
				dimRatio: 0,
				useFeaturedImage: false,
			});
			return;
		}

		if (isBlobURL(media.url)) {
			media.type = getBlobTypeByURL(media.url);
		}

		let mediaType;
		let src;
		// For media selections originated from a file upload.
		if (media.media_type) {
			if (media.media_type === 'image') {
				mediaType = 'image';
			} else {
				// only images and videos are accepted so if the media_type is not an image we can assume it is a video.
				// video contain the media type of 'file' in the object returned from the rest api.
				mediaType = 'video';
			}
		} else {
			// For media selections originated from existing files in the media library.
			mediaType = media.type;
		}

		if (mediaType === 'image') {
			// Try the "large" size URL, falling back to the "full" size URL below.
			src =
				media.sizes?.large?.url ||
				// eslint-disable-next-line camelcase
				media.media_details?.sizes?.large?.source_url;
		}

		setAttributes({
			mediaAlt: media.alt,
			mediaId: media.id,
			mediaType,
			dimRatio: 0,
			mediaUrl: src || media.url,
			mediaLink: media.link || undefined,
		});
	};
}

export default function Edit({
	attributes,
	setAttributes,
	clientId,
	isSelected,
	context: { postId, postType, queryId },
}) {
	const {
		verticalAlignment,
		useFeaturedImage,
		mediaId,
		mediaUrl,
		mediaAlt,
		mediaPosition,
		mediaType,
		mediaWidth,
		dimRatio,
		width,
	} = attributes;

	const isDescendentOfQueryLoop = Number.isFinite(queryId);

	const rootClientId = useSelect(
		(select) => {
			const { getBlockRootClientId } = select(blockEditorStore);

			const rootId = getBlockRootClientId(clientId);

			return rootId;
		},
		[clientId]
	);

	const [featuredImage, setFeaturedImage] = useEntityProp(
		'postType',
		postType,
		'featured_media',
		postId
	);

	const media = useSelect(
		(select) =>
			featuredImage &&
			select(coreStore).getMedia(featuredImage, { context: 'view' }),
		[featuredImage]
	);

	const { updateBlockAttributes } = useDispatch(blockEditorStore);

	const refMediaContainer = useRef();

	const onSelectMedia = attributesFromMedia({ attributes, setAttributes });

	const onSelectURL = (newUrl) => {
		if (newUrl !== mediaUrl) {
			setAttributes({
				mediaUrl: newUrl,
				mediaType: 'image',
				mediaId: undefined,
				useFeaturedImage: false,
			});
		}
	};

	const onRemoveMedia = () => {
		setAttributes({
			mediaAlt: undefined,
			mediaId: undefined,
			mediaType: undefined,
			mediaUrl: undefined,
			mediaLink: undefined,
			dimRatio: 0,
			useFeaturedImage: false,
		});
	};

	const toggleUseFeaturedImage = () => {
		setAttributes({
			mediaId: !useFeaturedImage ? media?.id : undefined,
			mediaUrl: !useFeaturedImage ? media?.source_url : undefined,
			useFeaturedImage: !useFeaturedImage,
			mediaType: 'image',
		});
	};

	const updateAlignment = (value) => {
		// Update own alignment.
		setAttributes({ verticalAlignment: value });
		// Reset parent Columns block.
		updateBlockAttributes(rootClientId, {
			verticalAlignment: null,
		});
	};

	const classes = classnames('wp-block-card', dimRatioToClass(dimRatio), {
		[`is-vertically-aligned-${verticalAlignment}`]: verticalAlignment,
		[`is-media-${mediaPosition}-aligned`]:
			mediaUrl && mediaPosition !== 'bg',
		[`is-media-background`]: mediaUrl && mediaPosition === 'bg',
		[`is-no-media`]: !mediaUrl,
		[`is-media-width-${mediaWidth}`]:
			(mediaPosition === 'left' || mediaPosition === 'right') && mediaUrl,
	});

	const style = {};

	const backgroundImage =
		mediaPosition === 'bg' && mediaUrl ? `url(${mediaUrl})` : undefined;

	style.gridColumnEnd = width ? 'span ' + width : undefined;
	style.backgroundImage = backgroundImage;

	const blockProps = useBlockProps({
		className: classes,
		style,
	});

	const innerBlocksProps = useInnerBlocksProps({
		className: classnames('wp-block-card__content'),
	});

	return (
		<>
			<BlockControls>
				<BlockVerticalAlignmentToolbar
					onChange={updateAlignment}
					value={verticalAlignment}
				/>
				<ToolbarGroup>
					<ToolbarDropdownMenu
						icon={
							mediaPosition === 'right'
								? pullRight
								: mediaPosition === 'left'
								? pullLeft
								: mediaPosition === 'bg'
								? pullBg
								: pullTop
						}
						label={__('Media position')}
						controls={[
							{
								title: __('Show media on top'),
								icon: pullTop,
								onClick: () =>
									setAttributes({ mediaPosition: 'top' }),
							},
							{
								title: __('Show media on left'),
								icon: pullLeft,
								onClick: () =>
									setAttributes({ mediaPosition: 'left' }),
							},
							{
								title: __('Show media on right'),
								icon: pullRight,
								onClick: () =>
									setAttributes({ mediaPosition: 'right' }),
							},
							{
								title: __('Show media in background'),
								icon: pullBg,
								onClick: () =>
									setAttributes({ mediaPosition: 'bg' }),
							},
						]}
					/>
				</ToolbarGroup>
				<ToolbarGroup>
					{mediaUrl && (
						<>
							<ToolbarButton onClick={onRemoveMedia}>
								{__('Remove Media')}
							</ToolbarButton>
						</>
					)}
				</ToolbarGroup>
				<ToolbarGroup>
					<MediaReplaceFlow
						id={mediaId}
						mediaURL={mediaUrl}
						allowedTypes={ALLOWED_MEDIA_TYPES}
						accept="image/*,video/*"
						onSelect={onSelectMedia}
						onToggleFeaturedImage={toggleUseFeaturedImage}
						onSelectURL={onSelectURL}
						useFeaturedImage={useFeaturedImage}
						name={!mediaUrl ? __('Add Media') : __('Replace')}
					/>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={__('Width Settings')}>
					<ButtonGroup aria-label={__('Width')}>
						{[3, 4, 6, 8, 9, 12].map((widthValue) => {
							return (
								<Button
									key={widthValue}
									isSmall
									variant={
										widthValue === width
											? 'primary'
											: undefined
									}
									onClick={() =>
										setAttributes({
											width: widthValue,
										})
									}
								>
									{widthValue}
								</Button>
							);
						})}
					</ButtonGroup>
				</PanelBody>
				{(mediaPosition === 'left' || mediaPosition === 'right') &&
					mediaUrl && (
						<PanelBody title={__('Media Settings')}>
							<ButtonGroup aria-label={__('Media width')}>
								{[25, 50, 75].map((widthValue) => {
									return (
										<Button
											key={widthValue}
											isSmall
											variant={
												widthValue === mediaWidth
													? 'primary'
													: undefined
											}
											onClick={() =>
												setAttributes({
													mediaWidth: widthValue,
												})
											}
										>
											{widthValue}%
										</Button>
									);
								})}
							</ButtonGroup>

							{mediaUrl && (
								<RangeControl
									label={__('Image overlay opacity')}
									value={dimRatio}
									onChange={(newDimRation) =>
										setAttributes({
											dimRatio: newDimRation,
										})
									}
									min={0}
									max={100}
									step={10}
								/>
							)}
						</PanelBody>
					)}
			</InspectorControls>
			<div {...blockProps}>
				{(useFeaturedImage || mediaUrl) && (
					<MediaContainer
						className="wp-block-card__media"
						onSelectMedia={onSelectMedia}
						ref={refMediaContainer}
						{...{
							isSelected,
							mediaAlt,
							mediaId,
							mediaType,
							mediaUrl,
							mediaWidth,
							dimRatio,
							useFeaturedImage,
							featuredImage,
							media,
						}}
					/>
				)}

				<div {...innerBlocksProps} />
			</div>
		</>
	);
}
