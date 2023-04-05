import { __ } from '@wordpress/i18n';
import { __unstableStripHTML as stripHTML } from '@wordpress/dom';
import {
	Popover,
	ToolbarButton,
	Tooltip,
	ToolbarGroup,
} from '@wordpress/components';
import {
	BlockControls,
	useBlockProps,
	RichText,
	__experimentalLinkControl as LinkControl,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useState, useRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { displayShortcut, isKeyboardEvent, ENTER } from '@wordpress/keycodes';
import classnames from 'classnames';
import { link as linkIcon } from '@wordpress/icons';
import { store as coreStore } from '@wordpress/core-data';

import { name } from './block.json';
import { updateAttributes } from './update-attributes';

const useIsInvalidLink = (kind, type, id) => {
	const isPostType =
		kind === 'post-type' || type === 'post' || type === 'page';
	const hasId = Number.isInteger(id);
	const postStatus = useSelect(
		(select) => {
			if (!isPostType) {
				return null;
			}
			const { getEntityRecord } = select(coreStore);
			return getEntityRecord('postType', type, id)?.status;
		},
		[isPostType, type, id]
	);

	const isInvalid =
		isPostType && hasId && postStatus && 'trash' === postStatus;
	const isDraft = 'draft' === postStatus;

	return [isInvalid, isDraft];
};

export default function Edit({
	attributes,
	isSelected,
	setAttributes,
	clientId,
}) {
	const [isLinkOpen, setIsLinkOpen] = useState(false);
	const [popoverAnchor, setPopoverAnchor] = useState(null);
	const ref = useRef();
	const { id, label, type, url, opensInNewTab, kind, rel } = attributes;

	const [isInvalid, isDraft] = useIsInvalidLink(kind, type, id);

	const { isParentOfSelectedBlock, hasChildren } = useSelect(
		(select) => {
			const {
				getBlocks,
				getBlockCount,
				getBlockName,
				getBlockRootClientId,
				hasSelectedInnerBlock,
				getBlockParentsByBlockName,
			} = select(blockEditorStore);

			return {
				innerBlocks: getBlocks(clientId),
				isAtMaxNesting:
					getBlockParentsByBlockName(clientId, [
						name,
						'cloudcatch/expandable-menu-item',
					]).length >= 2,
				isTopLevelLink:
					getBlockName(getBlockRootClientId(clientId)) ===
					'cloudcatch/expandable-menu',
				isParentOfSelectedBlock: hasSelectedInnerBlock(clientId, true),
				hasChildren: !!getBlockCount(clientId),
			};
		},
		[clientId]
	);

	const link = {
		url,
		opensInNewTab,
		rel,
		title: label && stripHTML(label),
	};

	function onKeyDown(event) {
		if (
			isKeyboardEvent.primary(event, 'k') ||
			(!url && event.keyCode === ENTER)
		) {
			setIsLinkOpen(true);
		}
	}

	const blockProps = useBlockProps({
		className: classnames('wp-block-expandable-menu-item', {
			'is-editing': isSelected || isParentOfSelectedBlock,
			'has-link': !!url,
			'has-child': hasChildren,
		}),
		onKeyDown,
	});

	const missingText = __('Add link');
	const tooltipText = __('This item is missing a link');
	const itemLabelPlaceholder = __('Add label…');

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						name="link"
						icon={linkIcon}
						title={__('Link')}
						shortcut={displayShortcut.primary('k')}
						onClick={() => setIsLinkOpen(true)}
					/>
				</ToolbarGroup>
			</BlockControls>
			<li {...blockProps}>
				{/* eslint-disable jsx-a11y/anchor-is-valid */}
				<a>
					{!url ? (
						<div className="wp-block-navigation-link__placeholder-text">
							<Tooltip position="top center" text={tooltipText}>
								<>
									<span>{missingText}</span>
									<span className="wp-block-navigation-link__missing_text-tooltip">
										{tooltipText}
									</span>
								</>
							</Tooltip>
						</div>
					) : (
						<>
							{!isInvalid && !isDraft && (
								<>
									<RichText
										ref={ref}
										identifier="label"
										className="wp-block-navigation-item__label"
										value={label}
										onChange={(labelValue) =>
											setAttributes({
												label: labelValue,
											})
										}
										aria-label={__('Navigation link text')}
										placeholder={itemLabelPlaceholder}
										withoutInteractiveFormatting
										allowedFormats={[
											'core/bold',
											'core/italic',
											'core/image',
											'core/strikethrough',
										]}
										onClick={() => {
											if (!url) {
												setIsLinkOpen(true);
											}
										}}
									/>
								</>
							)}
							{/* {(isInvalid || isDraft) && (
								<div className="wp-block-navigation-link__placeholder-text wp-block-navigation-link__label">
									<KeyboardShortcuts
										shortcuts={{
											enter: () =>
												isSelected &&
												setIsLinkOpen(true),
										}}
									/>
									<Tooltip
										position="top center"
										text={tooltipText}
									>
										<>
											<span
												aria-label={__(
													'Navigation link text'
												)}
											>
												{
													// Some attributes are stored in an escaped form. It's a legacy issue.
													// Ideally they would be stored in a raw, unescaped form.
													// Unescape is used here to "recover" the escaped characters
													// so they display without encoding.
													// See `updateAttributes` for more details.
													`${decodeEntities(
														label
													)} ${placeholderText}`.trim()
												}
											</span>
											<span className="wp-block-navigation-link__missing_text-tooltip">
												{tooltipText}
											</span>
										</>
									</Tooltip>
								</div>
							)} */}
						</>
					)}
					{isLinkOpen && (
						<Popover
							placement="bottom"
							onClose={() => setIsLinkOpen(false)}
							anchor={popoverAnchor}
							shift
						>
							<LinkControl
								hasTextControl
								hasRichPreviews
								className={classnames(
									'wp-block-expandable-menu__item',
									{
										'is-editing': isSelected,
										'has-link': !!url,
										'has-child': hasChildren,
									}
								)}
								value={link}
								showInitialSuggestions={true}
								withCreateSuggestion={false}
								noDirectEntry={!!type}
								noURLSuggestion={!!type}
								onChange={(updatedValue) => {
									updateAttributes(
										updatedValue,
										setAttributes,
										attributes
									);
								}}
								onRemove={() => {
									setAttributes({
										url: undefined,
										label: undefined,
										id: undefined,
										kind: undefined,
										type: undefined,
										opensInNewTab: false,
										rel: undefined,
									});

									// Close the link editing UI.
									setIsLinkOpen(false);
								}}
							/>
						</Popover>
					)}
				</a>
			</li>
		</>
	);
}
