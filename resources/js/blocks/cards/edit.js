import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	BlockVerticalAlignmentToolbar,
	InspectorControls,
	useInnerBlocksProps,
	useBlockProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';

import GapStyles from './gap-styles';

import classnames from 'classnames';

const ALLOWED_BLOCKS = ['cloudcatch/cards-card'];

export default function Edit({ clientId, attributes, setAttributes }) {
	const { columns, verticalAlignment } = attributes;
	const blockGap = attributes.style?.spacing?.blockGap;

	const updateAlignment = (value) => {
		// Update own alignment.
		setAttributes({ verticalAlignment: value });
	};

	const classes = classnames('wp-block-cards', `columns-${columns}`, {
		[`is-vertically-aligned-${verticalAlignment}`]: verticalAlignment,
	});

	const blockProps = useBlockProps({
		className: classes,
		style: {
			'--columns': columns,
			'--gap': blockGap ? blockGap : '20px',
		},
	});

	const cardTemplate = [
		'cloudcatch/cards-card',
		{
			mediaType: 'image',
			mediaUrl:
				'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5MDAiIGhlaWdodD0iNjU5LjIiIHhtbDpzcGFjZT0icHJlc2VydmUiIHZpZXdCb3g9IjAgMCA5MDAgNjU5LjIiPjxwYXRoIGQ9Ik0xMy4zIDBoODczLjRDODk0IDAgOTAwIDUuOSA5MDAgMTMuM1Y2NDZjMCA3LjMtNS45IDEzLjMtMTMuMyAxMy4zSDEzLjNDNiA2NTkuMyAwIDY1My40IDAgNjQ2VjEzLjNDMCA1LjkgNS45IDAgMTMuMyAweiIgc3R5bGU9ImZpbGw6IzgzODM4MyIvPjwvc3ZnPg==',
		},
		[
			[
				'core/heading',
				{ content: 'Lorem ipsum dolor sit amet', level: 3 },
			],
			[
				'core/paragraph',
				{
					content:
						'Sed nisi libero, fermentum ut quam vitae, porttitor dignissim diam. Aliquam porttitor arcu id est cursus vulputate.',
				},
			],
			['core/buttons'],
		],
	];

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		template: [cardTemplate, cardTemplate, cardTemplate],
		templateInsertUpdatesSelection: true,
		templateLock: false,
	});

	return (
		<>
			<BlockControls>
				<BlockVerticalAlignmentToolbar
					onChange={updateAlignment}
					value={verticalAlignment}
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={__('Column settings')}>
					<RangeControl
						label={__('Columns')}
						value={columns}
						onChange={(value) => setAttributes({ columns: value })}
						min={1}
						max={6}
					/>
				</PanelBody>
			</InspectorControls>
			<GapStyles
				blockGap={attributes.style?.spacing?.blockGap}
				clientId={clientId}
			/>
			<div {...innerBlocksProps} />
		</>
	);
}
