import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
	BlockControls,
	InspectorControls,
} from '@wordpress/blockEditor';
import { PanelBody, ToggleControl, SelectControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { useInstanceId } from '@wordpress/compose';

import { usePostTypes } from './utils';
import TaxonomyControls from './inspector-controls/taxonomy-controls';
import BlogToolbar from './block-controls/blog-toolbar';

export default function Edit({ attributes, setAttributes }) {
	const { queryId, query } = attributes;
	const {
		order,
		orderBy,
		author: authorIds,
		postType,
		sticky,
		inherit,
		taxQuery,
	} = query;

	const { postTypesTaxonomiesMap, postTypesSelectOptions } = usePostTypes();

	const instanceId = useInstanceId(Edit);

	const { __unstableMarkNextChangeAsNotPersistent } =
		useDispatch(blockEditorStore);

	useEffect(() => {
		if (!Number.isFinite(queryId)) {
			__unstableMarkNextChangeAsNotPersistent();
			setAttributes({ queryId: instanceId });
		}
	}, [queryId, instanceId]);

	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'wp-block-post' },
		{
			template: ['core/post-template'],
			__unstableDisableLayoutClassNames: true,
		}
	);

	const updateQuery = (newQuery) =>
		setAttributes({ query: { ...query, ...newQuery } });

	const onPostTypeChange = (newValue) => {
		const updatedQuery = { postType: newValue };
		// We need to dynamically update the `taxQuery` property,
		// by removing any not supported taxonomy from the query.
		const supportedTaxonomies = postTypesTaxonomiesMap[newValue];
		const updatedTaxQuery = Object.entries(taxQuery || {}).reduce(
			(accumulator, [taxonomySlug, terms]) => {
				if (supportedTaxonomies.includes(taxonomySlug)) {
					accumulator[taxonomySlug] = terms;
				}
				return accumulator;
			},
			{}
		);
		updatedQuery.taxQuery = !!Object.keys(updatedTaxQuery).length
			? updatedTaxQuery
			: undefined;

		if (newValue !== 'post') {
			updatedQuery.sticky = '';
		}
		updateQuery(updatedQuery);
	};

	return (
		<div {...useBlockProps()}>
			<BlockControls>
				<BlogToolbar attributes={attributes} setQuery={updateQuery} />
			</BlockControls>
			<InspectorControls>
				<PanelBody title={__('Blog Query Settings')}>
					<ToggleControl
						label={__('Inherit query from template')}
						help={__(
							'Toggle to use the global query context that is set with the current template, such as an archive or search. Disable to customize the settings independently.'
						)}
						checked={!!inherit}
						onChange={(value) => updateQuery({ inherit: !!value })}
					/>
					{!inherit && (
						<SelectControl
							options={postTypesSelectOptions}
							value={postType}
							label={__('Post type')}
							onChange={onPostTypeChange}
							help={__(
								'WordPress contains different types of content and they are divided into collections called "Post types". By default there are a few different ones such as blog posts and pages, but plugins could add more.'
							)}
						/>
					)}
				</PanelBody>
				{!inherit && (
					<PanelBody title={__('Filters')}>
						<TaxonomyControls
							onChange={updateQuery}
							query={query}
						/>
					</PanelBody>
				)}
			</InspectorControls>
			<div {...innerBlocksProps} />
		</div>
	);
}
