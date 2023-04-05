import classNames from 'classnames';
import { link, linkOff } from '@wordpress/icons';

import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	AlignmentControl,
	RichText,
	useBlockProps,
	__experimentalLinkControl as LinkControl,
} from '@wordpress/block-editor';
import { displayShortcut, isKeyboardEvent } from '@wordpress/keycodes';
import { ToolbarButton, Popover } from '@wordpress/components';
import { useEffect, useRef, useState, Platform } from '@wordpress/element';

export default function edit(props) {
	const {
		attributes,
		setAttributes,
		className,
		isSelected,
		onReplace,
		mergeBlocks,
	} = props;

	const { text, url, linkTarget, textAlign, placeholder } = attributes;

	function onToggleOpenInNewTab(value) {
		const newLinkTarget = value ? '_blank' : undefined;

		setAttributes({
			linkTarget: newLinkTarget,
		});
	}

	function setButtonText(newText) {
		// Remove anchor tags from button text content.
		setAttributes({ text: newText.replace(/<\/?a[^>]*>/g, '') });
	}

	function onKeyDown(event) {
		if (isKeyboardEvent.primary(event, 'k')) {
			startEditing(event);
		} else if (isKeyboardEvent.primaryShift(event, 'k')) {
			unlink();
			richTextRef.current?.focus();
		}
	}

	const ref = useRef();
	const richTextRef = useRef();
	const blockProps = useBlockProps({ ref, onKeyDown });

	const [isEditingURL, setIsEditingURL] = useState(false);
	const isURLSet = !!url;
	const opensInNewTab = linkTarget === '_blank';

	function startEditing(event) {
		event.preventDefault();
		setIsEditingURL(true);
	}

	function unlink() {
		setAttributes({
			url: undefined,
			linkTarget: undefined,
			rel: undefined,
		});
		setIsEditingURL(false);
	}

	useEffect(() => {
		if (!isSelected) {
			setIsEditingURL(false);
		}
	}, [isSelected]);

	return (
		<>
			<BlockControls group="block">
				<AlignmentControl
					value={textAlign}
					onChange={(nextAlign) => {
						setAttributes({ textAlign: nextAlign });
					}}
				/>
				{!isURLSet && (
					<ToolbarButton
						name="link"
						icon={link}
						title={__('Link')}
						shortcut={displayShortcut.primary('k')}
						onClick={startEditing}
					/>
				)}
				{isURLSet && (
					<ToolbarButton
						name="link"
						icon={linkOff}
						title={__('Unlink')}
						shortcut={displayShortcut.primaryShift('k')}
						onClick={unlink}
						isActive={true}
					/>
				)}
			</BlockControls>
			{isSelected && (isEditingURL || isURLSet) && (
				<Popover
					position="bottom center"
					onClose={() => {
						setIsEditingURL(false);
						richTextRef.current?.focus();
					}}
					anchorRef={ref?.current}
					focusOnMount={isEditingURL ? 'firstElement' : false}
				>
					<LinkControl
						className="wp-block-navigation-link__inline-link-input"
						value={{ url, opensInNewTab }}
						onChange={({
							url: newURL = '',
							opensInNewTab: newOpensInNewTab,
						}) => {
							setAttributes({ url: newURL });

							if (opensInNewTab !== newOpensInNewTab) {
								onToggleOpenInNewTab(newOpensInNewTab);
							}
						}}
						onRemove={() => {
							unlink();
							richTextRef.current?.focus();
						}}
						forceIsEditingLink={isEditingURL}
					/>
				</Popover>
			)}
			<div
				{...blockProps}
				className={classNames(blockProps.className, {
					[`has-text-align-${textAlign}`]: textAlign,
				})}
			>
				<RichText
					identifier="text"
					value={text}
					onChange={(value) => setButtonText(value)}
					withoutInteractiveFormatting
					tagName="a"
					aria-label={__('Read more text')}
					placeholder={placeholder || __('Read More')}
					textAlign={textAlign}
					{...blockProps}
					className=""
					{...(Platform.isNative && { deleteEnter: true })} // setup RichText on native mobile to delete the "Enter" key as it's handled by the JS/RN side
				/>
			</div>
		</>
	);
}
