import { React, useEffect } from 'react';
import * as ReactDOMClient from 'react-dom/client';
import apiFetch from '@wordpress/api-fetch';

function Blog(props) {
	const { query } = props;

	useEffect(() => {
		console.log(JSON.parse(query));

		apiFetch({ path: '/wp/v2/posts' }).then((posts) => {
			console.log(posts);
		});
	}, []);

	return <div>123</div>;
}

const elms = document.getElementsByClassName('wp-block-jf-blog-template');

window.addEventListener('DOMContentLoaded', () => {
	for (let i = 0; i < elms.length; i++) {
		const root = ReactDOMClient.createRoot(elms[i]);

		root.render(<Blog query={elms[i].getAttribute('data-query')} />);
		// elms[i].removeAttribute('data-query');
	}
});
