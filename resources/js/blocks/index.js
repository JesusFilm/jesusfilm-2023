import { registerBlockType } from '@wordpress/blocks';

import * as moreLink from './more-link';
import * as expandableMenu from './expandable-menu';
import * as expandableMenuItem from './expandable-menu-item';
import * as cards from './cards';
import * as cardsCard from './cards-card';
import * as card from './card';
import * as templatePart from './template-part';
import * as breadcrumbs from './breadcrumbs';
import * as blog from './blog';
import * as blogTemplate from './blog-template';
import * as blogFilter from './blog-filter';

const blocks = [
	moreLink,
	expandableMenu,
	expandableMenuItem,
	cards,
	cardsCard,
	card,
	templatePart,
	breadcrumbs,
	blog,
	blogTemplate,
	blogFilter,
];

const registerBlock = (block) => {
	if (!block) {
		return;
	}
	const { metadata, settings, name } = block;
	registerBlockType({ name, ...metadata }, settings);
};

blocks.forEach(registerBlock);
