import { registerBlockType } from '@wordpress/blocks';

import * as moreLink from './more-link';
import * as cards from './cards';
import * as cardsCard from './cards-card';
import * as card from './card';
import * as breadcrumbs from './breadcrumbs';
import * as blog from './blog';
import * as blogTemplate from './blog-template';
import * as blogFilter from './blog-filter';
import * as tableOfContents from './table-of-contents';
import * as accordion from './accordion';
import * as team from './team';

const blocks = [
	moreLink,
	cards,
	cardsCard,
	card,
	breadcrumbs,
	blog,
	blogTemplate,
	blogFilter,
	tableOfContents,
	accordion,
	team,
];

const registerBlock = (block) => {
	if (!block) {
		return;
	}
	const { metadata, settings, name } = block;
	registerBlockType({ name, ...metadata }, settings);
};

blocks.forEach(registerBlock);
