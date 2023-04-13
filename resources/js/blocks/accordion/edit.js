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
	useInnerBlocksProps,
	RichText,
	MediaPlaceholder,
	store,
	MediaReplaceFlow,
	__experimentalImageSizeControl as ImageSizeControl,
} from '@wordpress/block-editor';
import { PanelBody, ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useEffect, createRef, useRef, useState } from '@wordpress/element';


export default function edit({attributes, setAttributes}) {
	const { title, subtitle } = attributes;

	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Accordion Settings')}>

				</PanelBody>
			</InspectorControls>
			<details {...blockProps}>
				<summary>
					<RichText
						identifier="title"
						tagName="span"
						value={ title }
						onChange={ (value) => setAttributes({title: value}) }
						onRemove={ () => onReplace( [] ) }
						aria-label={ __( 'Title text' ) }
						placeholder={ __( 'Title' ) }
					/>
					<RichText
						identifier="subtitle"
						tagName="small"
						value={ subtitle }
						onChange={ (value) => setAttributes({subtitle: value}) }
						onRemove={ () => onReplace( [] ) }
						aria-label={ __( 'Subtitle text' ) }
						placeholder={ __( 'Subtitle' ) }
					/>
				</summary>
				<div { ...useInnerBlocksProps() } />
			</details>
		</>
	);
}
