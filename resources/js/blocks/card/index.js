import edit from './edit';
import save from './save';
import transforms from './transforms';
import metadata from './block.json';

const { name } = metadata;

export { metadata, name };

export const settings = {
	edit,
	save,
	transforms,
};
