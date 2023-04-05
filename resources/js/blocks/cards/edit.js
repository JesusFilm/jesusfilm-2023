import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useInnerBlocksProps,
	useBlockProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

import GapStyles from './gap-styles';

import classnames from 'classnames';

const ALLOWED_BLOCKS = ['cloudcatch/cards-card'];

export default function Edit({ clientId, attributes, setAttributes }) {
	const { columns } = attributes;

	const classes = classnames('wp-block-cards', `columns-${columns}`);

	const blockGap = attributes.style?.spacing?.blockGap;

	const blockProps = useBlockProps({
		className: classes,
		style: {
			'--columns': columns,
			'--gap': blockGap ? blockGap : '20px',
		},
	});

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		template: [['cloudcatch/cards-card']],
		templateLock: false,
	});

	return (
		<>
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
