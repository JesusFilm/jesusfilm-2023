/**
 * WordPress dependencies
 */
import { __experimentalGetGapCSSValue as getGapCSSValue } from '@wordpress/block-editor';

export default function gapStyles(blockGap) {
	const fallbackValue = `var( --wp--style--block-gap, 20px )`;

	let gapValue = fallbackValue;
	let column = fallbackValue;
	let row;

	if (!!blockGap) {
		row =
			typeof blockGap === 'string'
				? getGapCSSValue(blockGap)
				: getGapCSSValue(blockGap?.top) || fallbackValue;
		column =
			typeof blockGap === 'string'
				? getGapCSSValue(blockGap)
				: getGapCSSValue(blockGap?.left) || fallbackValue;
		gapValue = row === column ? row : `${row} ${column}`;
	}

	return gapValue;
}
