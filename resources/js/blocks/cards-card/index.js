import Edit from './edit';
import save from './save';
import metadata from './block.json';

import { Path, SVG } from '@wordpress/components';

const { name } = metadata;

export { metadata, name };

const icon = (
	<SVG viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<Path d="M16.2 18.5H7.8c-1.1 0-2-.9-2-2v-9c0-1.1.9-2 2-2h8.5c1.1 0 2 .9 2 2v9c-.1 1.1-1 2-2.1 2zM7.8 7c-.3 0-.5.2-.5.5v9c0 .3.2.5.5.5h8.5c.3 0 .5-.2.5-.5v-9c0-.3-.2-.5-.5-.5H7.8z" />
		<Path d="M8.2 14.4h7.6v1.5H8.2zM8.2 8.1h7.6v4.5H8.2z" />
	</SVG>
);

export const settings = {
	edit: Edit,
	save,
	icon,
};
