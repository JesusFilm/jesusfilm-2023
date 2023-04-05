import { DisclosureMenu } from 'accessible-menu';

(function () {
	const jesusfilmMegamenu = {
		expanded(e) {
			if (document.querySelector('.site-header').contains(e.target)) {
				document.body.classList.add('megamenu-expanded');
			}

			setTimeout(() => {
				document.addEventListener(
					'click',
					jesusfilmMegamenu.checkClickOutside
				);
			}, 250);
		},

		collapsed(e) {
			if (document.querySelector('.site-header').contains(e.target)) {
				document.body.classList.remove('megamenu-expanded');
			}

			document.removeEventListener(
				'click',
				jesusfilmMegamenu.checkClickOutside
			);
		},

		checkClickOutside(e) {
			if (
				!document
					.querySelector('.wp-block-megamenu__items')
					.contains(e.target)
			) {
				window.megamenuBlocks.elements.controller.close();
			}
		},

		events() {
			window.addEventListener('accessibleMenuExpand', this.expanded);
			window.addEventListener('accessibleMenuCollapse', this.collapsed);
			// document.addEventListener('click', this.checkClickOutside);
		},

		init() {
			jesusfilmMegamenu.events();
		},
	};

	const jesusfilmExpandableMenu = {
		ready() {
			const containerElement = document.querySelectorAll(
				'.wp-block-expandable-menu'
			);

			containerElement.forEach((container) => {
				const menuElement = container.querySelector(
					'.wp-block-expandable-menu__items'
				);
				const titleElement = container.querySelector(
					'.wp-block-expandable-menu__title'
				);

				const menu = new DisclosureMenu({
					menuElement,
					containerElement: container,
					controllerElement: titleElement,
					optionalKeySupport: true,
					openClass: 'is-visible',
					closeClass: 'is-hidden',
					hoverType: 'off',
				});

				if (window.innerWidth >= 782) {
					menu.elements.controller.open();
				}
			});
		},

		events() {
			const LEM = jesusfilmExpandableMenu;

			document.addEventListener('DOMContentLoaded', LEM.ready);
		},

		init() {
			jesusfilmExpandableMenu.events();
		},
	};

	const jesusfilmResponsiveEmbeds = {
		init() {
			let proportion, parentWidth;

			// Loop iframe elements.
			document.querySelectorAll('iframe').forEach(function (iframe) {
				// Only continue if the iframe has a width & height defined.
				if (iframe.width && iframe.height) {
					// Calculate the proportion/ratio based on the width & height.
					proportion =
						parseFloat(iframe.width) / parseFloat(iframe.height);
					// Get the parent element's width.
					parentWidth = parseFloat(
						window
							.getComputedStyle(iframe.parentElement, null)
							.width.replace('px', '')
					);
					// Set the max-width & height.
					iframe.style.maxWidth = '100%';
					iframe.style.maxHeight =
						Math.round(parentWidth / proportion).toString() + 'px';
				}
			});
		},
	};

	jesusfilmResponsiveEmbeds.init();

	// Run on resize.
	window.onresize = jesusfilmResponsiveEmbeds.init();

	// jesusfilmSectionNav.init();
	jesusfilmMegamenu.init();
	// jesusfilmExpandableMenu.init();

	document.querySelectorAll('.wp-block-video video').forEach((video) => {
		video.setAttribute('disableRemotePlayback', 'true');
	});

	document.addEventListener('DOMContentLoaded', () => {
		const headerSearchForm = document.querySelector(
			'.site-header .wp-block-search'
		);
		const headerSearchInput = headerSearchForm.querySelector(
			'.site-header .wp-block-search__input'
		);

		const headerSearchToggle = (e) => {
			const expanded =
				'true' === headerSearchForm.getAttribute('aria-expanded') ||
				false;

			headerSearchForm.setAttribute('aria-expanded', !expanded);

			if (!expanded) {
				window.megamenuBlocks.elements.controller.close();
				document.addEventListener('click', headerSearchBlur, true);
			}
		};

		const headerSearchBlur = (e) => {
			if (!headerSearchForm.contains(e.target)) {
				headerSearchForm.setAttribute('aria-expanded', 'false');
				document.removeEventListener('click', headerSearchBlur, true);
			}
		};

		headerSearchInput.addEventListener('focus', headerSearchToggle);
	});
})();
