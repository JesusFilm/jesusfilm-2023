import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
	InspectorControls,
} from '@wordpress/blockEditor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as coreStore, useEntityRecords } from '@wordpress/core-data';

function RenderTermsList(props) {
	const { taxonomy } = props;

	const query = {
		per_page: -1,
		hide_empty: true,
	};
	const { records: terms, isResolving } = useEntityRecords(
		'taxonomy',
		taxonomy,
		query
	);

	if (!terms?.length) {
		return <></>;
	}

	return (
		<ul>
			{terms.map((item) => {
				return (
					<li key={item.slug}>
						<a>{item.name}</a>
					</li>
				);
			})}
		</ul>
	);
}

export default function Edit({
	context: {
		query: {
			perPage,
			offset = 0,
			postType,
			order,
			orderBy,
			author,
			search,
			exclude,
			sticky,
			inherit,
			taxQuery,
			parents,
			pages,
		} = {},
	},
	attributes,
	setAttributes,
}) {
	const { filterType, filterTaxonomy } = attributes;

	const { taxonomies } = useSelect((select) => {
		const { getTaxonomies } = select(coreStore);

		const _taxonomies = getTaxonomies({
			type: postType,
			per_page: -1,
			context: 'view',
		});

		return {
			taxonomies: _taxonomies,
		};
	});

	return (
		<div {...useBlockProps()}>
			<InspectorControls>
				<PanelBody title={__('Filter Settings')}>
					<SelectControl
						label={__('Filter Type')}
						value={filterType}
						options={[
							{ label: 'Taxonomy', value: 'taxonomy' },
							{ label: 'User', value: 'user' },
						]}
						onChange={(value) =>
							setAttributes({
								filterType: value,
								filterTaxonomy: undefined,
							})
						}
					/>
					{filterType === 'taxonomy' && null != taxonomies && (
						<SelectControl
							label={__('Taxonomy')}
							value={filterTaxonomy}
							options={[
								{
									label: __('Select'),
									value: '',
								},
								...taxonomies.map((taxonomy) => {
									return {
										label: taxonomy.name,
										value: taxonomy.slug,
									};
								}),
							]}
							onChange={(value) =>
								setAttributes({ filterTaxonomy: value })
							}
						/>
					)}
				</PanelBody>
			</InspectorControls>
			{filterType === 'taxonomy' && filterTaxonomy != null && (
				<RenderTermsList taxonomy={filterTaxonomy} />
			)}
		</div>
	);
}
