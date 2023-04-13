/**
 * WordPress dependencies
 */
import { useInnerBlocksProps, useBlockProps } from '@wordpress/block-editor';

/**
 * External dependencies
 */
import classnames from 'classnames';

export default function save({ attributes }) {
	const { columns, verticalAlignment } = attributes;

	const className = classnames('wp-block-cards', {
		[`columns-${columns}`]: columns !== undefined,
		[`columns-default`]: columns === undefined,
		[`is-vertically-aligned-${verticalAlignment}`]: verticalAlignment,
	});

	const blockProps = useBlockProps.save({ className });
	const innerBlocksProps = useInnerBlocksProps.save(blockProps);

	return <div {...innerBlocksProps} />;
}
