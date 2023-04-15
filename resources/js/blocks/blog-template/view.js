import { React, useEffect, useState } from 'react';
import * as ReactDOMClient from 'react-dom/client';
import ReactPaginate from 'react-paginate';
import { getQueryArgs, buildQueryString, addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';

function Blog(props) {
	const [data, setData] = useState(props.initData || '');
	const [blockProps, setBlockProps] = useState(
		JSON.parse(decodeURIComponent(props.block))
	);
	const [totalPages, setTotalPages] = useState(0);
	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(0);

	const queryId = blockProps?.context?.queryId;
	const perPage = parseInt(blockProps?.context?.query?.perPage || 10);

	const update = (block) => {
		block = JSON.stringify(block);

		console.log(block);

		apiFetch({
			path: '/jf/v1/blog',
			method: 'POST',
			data: { block },
			parse: false,
		})
			.then((res) => {
				setTotal(res.headers.get('X-WP-Total'));
				setTotalPages(res.headers.get('X-WP-TotalPages'));
				return res.json();
			})
			.then((posts) => {
				setData(posts);
			})
			.catch(() => {
				// Do nothing
			});
	};

	useEffect(() => {
		update(blockProps);
	}, []);

	useEffect(() => {
		update(blockProps);
	}, [blockProps]);

	if (null != window[`jfQuery${queryId}`]) {
		window[`jfQueryProxy${queryId}`] = new Proxy(
			window[`jfQuery${queryId}`],
			{
				set(target, key, value) {
					target[key] = value;

					setBlockProps({
						...blockProps,
						context: {
							...blockProps.context,
							query: target,
						},
					});

					return Reflect.set(...arguments);
				},
			}
		);
	}

	const handlePageClick = (event) => {
		const newOffset = (event.selected * perPage) % total;
		window[`jfQueryProxy${queryId}`].offset = newOffset;
	};

	return (
		<>
			<ul
				className="wp-block-jf-blog-template__posts"
				dangerouslySetInnerHTML={{ __html: data }}
			/>
			<ReactPaginate
				breakLabel="..."
				nextLabel="Next"
				onPageChange={handlePageClick}
				pageRangeDisplayed={3}
				pageCount={totalPages}
				previousLabel="Previous"
				renderOnZeroPageCount={null}
				className="wp-block-jf-blog-template__pagination"
			/>
		</>
	);
}

const elms = document.getElementsByClassName('wp-block-jf-blog-template');

window.addEventListener('DOMContentLoaded', () => {
	for (let i = 0; i < elms.length; i++) {
		const root = ReactDOMClient.createRoot(elms[i]);

		root.render(
			<Blog
				initData={elms[i].firstChild.innerHTML}
				block={elms[i].getAttribute('data-block')}
			/>
		);
		// elms[i].removeAttribute('data-block');
	}
});
