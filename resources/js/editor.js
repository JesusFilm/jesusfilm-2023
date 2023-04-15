import './blocks';

wp.domReady(() => {
	wp.blocks.registerBlockStyle('core/button', {
		name: 'small',
		label: 'Small',
	});

	wp.blocks.registerBlockStyle('core/button', {
		name: 'outline',
		label: 'Outline',
	});

	wp.blocks.registerBlockStyle('core/columns', {
		name: 'separator',
		label: 'Separator',
	});

	wp.blocks.registerBlockStyle('core/image', {
		name: 'clip-path',
		label: 'Clip Path',
	});

	wp.blocks.registerBlockStyle('cloudcatch/cards-card', {
		name: 'brand-red',
		label: 'Brand Red',
	});

	wp.blocks.registerBlockStyle('core/group', {
		name: 'brand-red',
		label: 'Brand Red',
	});

	wp.blocks.registerBlockStyle('core/pullquote', {
		name: 'brand-logo',
		label: 'Brand Logo',
	});
});
