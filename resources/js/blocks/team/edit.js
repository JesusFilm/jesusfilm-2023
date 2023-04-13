import classnames from 'classnames';
import { get, pick } from 'lodash';

import { __ } from '@wordpress/i18n';
import { isBlobURL } from '@wordpress/blob';
import {
	useBlockProps,
	useInnerBlocksProps,
	MediaPlaceholder,
	InspectorControls,
	BlockControls,
	RichText,
	MediaReplaceFlow,
} from '@wordpress/block-editor';
import { PanelBody, ToolbarGroup } from '@wordpress/components';
import { useState, useRef } from '@wordpress/element';

export const pickRelevantMediaFiles = (image, size) => {
	const imageProps = pick(image, ['id']);
	imageProps.url =
		get(image, ['sizes', size, 'url']) ||
		get(image, ['media_details', 'sizes', size, 'source_url']) ||
		image.url;
	return imageProps;
};

function isMediaDestroyed(id) {
	const attachment = wp?.media?.attachment(id) || {};
	return attachment.destroyed;
}

export default function Edit({
	attributes,
	setAttributes,
	noticeUI,
	noticeOperations,
	onReplace,
}) {
	const { id, url, title, name } = attributes;
	const imageDefaultSize = 'full';
	const dialogRef = useRef(null);
	const openDialogRef = useRef(null);
	const [temporaryURL, setTemporaryURL] = useState();

	function openDialog() {
		dialogRef.current.showModal();
	}

	function closeDialog() {
		dialogRef.current.close();
	}

	// A callback passed to MediaUpload,
	// fired when the media modal closes.
	function onCloseModal() {
		if (isMediaDestroyed(attributes?.id)) {
			setAttributes({
				url: undefined,
				id: undefined,
			});
		}
	}

	function onUploadError(message) {
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice(message);
	}

	function onSelectImage(media) {
		if (!media || !media.url) {
			setAttributes({
				url: undefined,
				id: undefined,
			});

			return;
		}

		if (isBlobURL(media.url)) {
			setTemporaryURL(media.url);
			return;
		}

		setTemporaryURL();

		const mediaAttributes = pickRelevantMediaFiles(media, imageDefaultSize);

		let additionalAttributes;
		// Reset the dimension attributes if changing to a different image.
		if (!media.id || media.id !== id) {
			additionalAttributes = {
				width: undefined,
				height: undefined,
				// Fallback to size "full" if there's no default image size.
				// It means the image is smaller, and the block will use a full-size URL.
				sizeSlug: 'full',
			};
		} else {
			// Keep the same url when selecting the same file, so "Image Size"
			// option is not changed.
			additionalAttributes = { url };
		}

		setAttributes({
			...mediaAttributes,
			...additionalAttributes,
		});
	}

	const blockProps = useBlockProps();

	const mediaPreview = !!url && (
		<img
			alt={__('Edit image')}
			title={__('Edit image')}
			className={'edit-image-preview'}
			src={url}
		/>
	);

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<MediaReplaceFlow
						id={id}
						mediaURL={url}
						allowedTypes={['image']}
						accept="image/*"
						onSelect={onSelectImage}
						name={!url ? __('Add Media') : __('Replace')}
					/>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={__('Team Settings')}>
					<button
						ref={openDialogRef}
						className="button button-secondary"
						onClick={openDialog}
					>
						{__('Open Dialog')}
					</button>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<div className="wp-block-jf-team__media">
					{url && <img src={url} alt={name} />}
					{!url && (
						<MediaPlaceholder
							onSelect={onSelectImage}
							notices={noticeUI}
							onError={onUploadError}
							onClose={onCloseModal}
							accept="image/*"
							allowedTypes={['image']}
							value={{ id, url }}
							mediaPreview={mediaPreview}
							disableMediaButtons={temporaryURL || url}
						/>
					)}
					<button
						aria-label={__('Open dialog')}
						onClick={openDialog}
						className="wp-block-jf-team__button open"
					></button>
				</div>

				<div className="wp-block-jf-team__info">
					<RichText
						identifier="name"
						tagName="h3"
						value={name}
						onChange={(value) => setAttributes({ name: value })}
						onRemove={() => onReplace([])}
						aria-label={__('Name')}
						placeholder={__('John Doe')}
					/>
					<RichText
						identifier="title"
						tagName="p"
						value={title}
						onChange={(value) => setAttributes({ title: value })}
						onRemove={() => onReplace([])}
						aria-label={__('Title')}
						placeholder={__('Chief Executive Officer')}
					/>
				</div>
				<dialog className="wp-block-jf-team__dialog" ref={dialogRef}>
					<div className="wp-block-jf-team__dialog-media">
						{url && <img src={url} alt={name} />}
					</div>
					<div className="wp-block-jf-team__dialog-content">
						<h2>
							{name}: {title}
						</h2>
						<div {...useInnerBlocksProps()} />
					</div>
					<button
						aria-label={__('Close dialog')}
						onClick={closeDialog}
						className="wp-block-jf-team__button close"
					></button>
				</dialog>
			</div>
		</>
	);
}
