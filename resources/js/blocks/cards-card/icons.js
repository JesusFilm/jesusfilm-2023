/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const pullTop = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M6 4v6h12V4H6zm2.5 9v1.5h7V13h-7zm0 7h7v-1.5h-7V20z" />
	</SVG>
);

const pullBg = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M6,6v12h12V6H6z M15.5,14.5h-7V13h7V14.5z M15.5,11h-7V9.5h7V11z" />
	</SVG>
);

export { pullTop, pullBg };
