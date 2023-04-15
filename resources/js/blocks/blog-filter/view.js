import { React, useEffect, useState } from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { getQueryArgs, buildQueryString } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';

function BlogFilter(props) {
	const [data, setData] = useState(props.initData || '');
	const [blockProps, setBlockProps] = useState(props.block);

	const block = JSON.parse(decodeURIComponent(props.block));

	const queryId = block.context.queryId;

	// useEffect(() => {
	// 	apiFetch({
	// 		path: '/jf/v1/blog' + `?block=${blockProps}`,
	// 	})
	// 		.then((posts) => {
	// 			setData(posts);
	// 		})
	// 		.catch(() => {
	// 			// Do nothing
	// 		});
	// }, []);

	// useEffect(() => {
	// 	console.log(123);
	// }, [blockProps]);

	// window[`jfQueryProxy${queryId}`] = new Proxy(window[`jfQuery${queryId}`], {
	// 	set(target, key, value) {
	// 		target[key] = value;

	// 		setBlockProps(encodeURIComponent(JSON.stringify(target)));

	// 		return true;
	// 	},
	// });

	return (
		<ul
			className="wp-block-jf-blog-template__posts"
			dangerouslySetInnerHTML={{ __html: data }}
		/>
	);
}

const elms = document.getElementsByClassName('wp-block-jf-blog-filter');

window.addEventListener('DOMContentLoaded', () => {
	for (let i = 0; i < elms.length; i++) {
		const root = ReactDOMClient.createRoot(elms[i]);

		root.render(
			<BlogFilter
				initData={elms[i].firstChild.innerHTML}
				block={elms[i].getAttribute('data-block')}
			/>
		);
		// elms[i].removeAttribute('data-query');
	}
});
