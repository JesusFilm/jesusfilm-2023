import { React, useEffect, useState } from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { getQueryArgs, buildQueryString } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';

function Blog(props) {
	const [data, setData] = useState(props.initData || '');

	useEffect(() => {
		apiFetch({
			path: '/jf/v1/blog' + `?block=${props.block}`,
		})
			.then((posts) => {
				setData(posts);
			})
			.catch(() => {
				// Do nothing
			});
	}, []);

	return (
		<ul
			className="wp-block-jf-blog-template__posts"
			dangerouslySetInnerHTML={{ __html: data }}
		/>
	);
}

// const elms = document.getElementsByClassName('wp-block-jf-blog-template');

// window.addEventListener('DOMContentLoaded', () => {
// 	for (let i = 0; i < elms.length; i++) {
// 		const root = ReactDOMClient.createRoot(elms[i]);

// 		root.render(
// 			<Blog
// 				initData={elms[i].firstChild.innerHTML}
// 				block={elms[i].getAttribute('data-block')}
// 			/>
// 		);
// 		elms[i].removeAttribute('data-block');
// 	}
// });
