import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
	InspectorControls,
} from '@wordpress/blockEditor';
import { getQueryArgs, buildQueryString } from '@wordpress/url';
import { PanelBody, TextControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { useInstanceId } from '@wordpress/compose';

export default function Edit({ clientId, attributes, setAttributes }) {
	const { queryId, query } = attributes;
	const [queryString, setQueryString] = useState('');

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

	const setQueryParams = (val) => {
		if ('?' !== val.charAt(0)) {
			val = '?' + val;
		}

		const queryArgs = getQueryArgs(val);
		const updatedQuery = query;

		for (const property in queryArgs) {
			if (undefined !== query[property]) {
				updatedQuery[property] = queryArgs[property];
			}
		}

		setAttributes({ query: { ...query, ...updatedQuery } });
		setQueryString(val);
	};

	const getQueryParams = () => {
		if (null != queryString) {
			return queryString;
		}

		console.log(buildQueryString(query));

		return buildQueryString(query);
	};

	useEffect(() => {
		console.log(query);
	}, [query]);

	return (
		<div {...useBlockProps()}>
			<InspectorControls>
				<PanelBody title={__('Blog Query Settings')}>
					<TextControl
						label={__('Query string')}
						value={getQueryParams()}
						onChange={(val) => setQueryParams(val)}
						help={__('e.g. ?postType=post&orderBy=date')}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...innerBlocksProps} />
		</div>
	);
}
