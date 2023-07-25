import { Fragment } from '@wordpress/element';
import { ToggleControl, PanelBody } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';

import './blocks';

wp.domReady(() => {
	wp.blocks.registerBlockStyle('core/button', {
		name: 'small',
		label: 'Small',
	});

	wp.blocks.registerBlockStyle('core/button', {
		name: 'outline',
		label: 'Outline',
	});

	wp.blocks.registerBlockStyle('core/columns', {
		name: 'separator',
		label: 'Separator',
	});

	wp.blocks.registerBlockStyle('core/image', {
		name: 'clip-path',
		label: 'Clip Path',
	});

	wp.blocks.registerBlockStyle('core/post-featured-image', {
		name: 'clip-path',
		label: 'Clip Path',
	});

	wp.blocks.registerBlockStyle('cloudcatch/cards-card', {
		name: 'brand-red',
		label: 'Brand Red',
	});

	wp.blocks.registerBlockStyle('core/group', {
		name: 'brand-red',
		label: 'Brand Red',
	});

	wp.blocks.registerBlockStyle('core/pullquote', {
		name: 'brand-logo',
		label: 'Brand Logo',
	});

	/**
	 * Reverse columns mobile.
	 */
	wp.hooks.addFilter(
		'blocks.registerBlockType',
		'jesusfilm/columns-custom-attribute',
		function (settings, name) {
			if (typeof settings.attributes !== 'undefined') {
				if (name === 'core/columns') {
					settings.attributes = Object.assign(settings.attributes, {
						reverseColumnsMobile: {
							type: 'boolean',
						},
					});
				}
			}
			return settings;
		}
	);

	const columnsControls = wp.compose.createHigherOrderComponent(
		(BlockEdit) => {
			return (props) => {
				const { attributes, setAttributes, isSelected } = props;

				return (
					<Fragment>
						<BlockEdit {...props} />
						{isSelected && props.name === 'core/columns' && (
							<InspectorControls>
								<PanelBody>
									<ToggleControl
										label={wp.i18n.__(
											'Reverse Columns on Mobile'
										)}
										checked={
											!!attributes.reverseColumnsMobile
										}
										onChange={() =>
											setAttributes({
												reverseColumnsMobile:
													!attributes.reverseColumnsMobile,
											})
										}
									/>
								</PanelBody>
							</InspectorControls>
						)}
					</Fragment>
				);
			};
		},
		'columnsControls'
	);

	wp.hooks.addFilter(
		'editor.BlockEdit',
		'jesusfilm/columns-reverse-mobile-control',
		columnsControls
	);

	wp.hooks.addFilter(
		'blocks.getSaveContent.extraProps',
		'jesusfilm/columns-apply-class',
		function (extraProps, blockType, attributes) {
			const { reverseColumnsMobile } = attributes;

			if (
				typeof reverseColumnsMobile !== 'undefined' &&
				reverseColumnsMobile
			) {
				extraProps.className =
					extraProps.className + ' reverse-columns-mobile';
			}
			return extraProps;
		}
	);
});
