import Edit from './edit';
import save from './save';
import metadata from './block.json';
import transforms from './transforms';

import { Path, SVG } from '@wordpress/components';

const { name } = metadata;

export { metadata, name };

const icon = (
	<SVG viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<Path d="M13 18.5H4.5c-1.1 0-2-.9-2-2v-9c0-1.1.9-2 2-2H13c1.1 0 2 .9 2 2v9c-.1 1.1-1 2-2 2zM4.5 7c-.3 0-.5.2-.5.5v9c0 .3.2.5.5.5H13c.3 0 .5-.2.5-.5v-9c-.1-.3-.3-.5-.5-.5H4.5z" />
		<Path d="M4.9 14.4h7.6v1.5H4.9zM4.9 8.1h7.6v4.5H4.9zM21.5 11.3h-1.6V9.7h-1.5v1.6h-1.6v1.5h1.6v1.5h1.5v-1.5h1.6z" />
	</SVG>
);

export const settings = {
	edit: Edit,
	save,
	transforms,
	icon,
};
