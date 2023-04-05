export function dimRatioToClass(ratio) {
	return ratio === 0 || !ratio === undefined || null == ratio
		? null
		: 'has-background-dim-' + 10 * Math.round(ratio / 10);
}
