'use strict';

module.exports = {
    extends: [
        '@wordpress/stylelint-config',
        'stylelint-config-recommended-scss',
        '@wordpress/stylelint-config/scss',
    ],
    plugins: 'stylelint-order',
    ignoreFiles: ['style.css', '**/*.js', '**/*.php', 'LICENSE'],
    rules: {
        'no-empty-source': null,
		'block-no-empty': null,
        'function-url-quotes': 'always',
		'no-descending-specificity': null,
        'selector-class-pattern': null,
		'length-zero-no-unit': null
    },
};
