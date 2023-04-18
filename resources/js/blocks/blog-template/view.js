import {
	useEffect,
	useState,
	createRoot,
	createRef,
	useRef,
	forwardRef,
} from '@wordpress/element';
import ReactPaginate from 'react-paginate';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

import classnames from 'classnames';

const Blog = forwardRef((props, ref) => {
	const [data, setData] = useState(props.initData || '');
	const [blockProps, setBlockProps] = useState(
		JSON.parse(decodeURIComponent(props.block))
	);
	const [loading, setLoading] = useState(false);
	const [totalPages, setTotalPages] = useState(0);
	const [total, setTotal] = useState(0);

	const queryId = blockProps?.context?.queryId;
	const query = blockProps?.context?.query;
	const perPage = parseInt(blockProps?.context?.query?.perPage || 10);

	const initialOffset = useRef(
		parseInt(blockProps?.context?.query?.originalOffset)
	);

	const initialPage = useRef(
		(parseInt(blockProps?.context?.query?.offset) -
			Math.round(initialOffset.current)) /
			perPage
	);
	const [page, setPage] = useState(initialPage.current + 1);

	const update = (block) => {
		setLoading(true);
		block = JSON.stringify(block);

		apiFetch({
			path: '/jf/v1/blog',
			method: 'POST',
			data: { block, query },
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
				setData('<p class="error">An error occurred.</p>');
			})
			.finally(() => {
				setLoading(false);

				ref.current.scrollIntoView();
			});
	};

	// useEffect(() => {
	// 	update(blockProps);
	// }, []);

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
				get(target, prop, receiver) {
					return Reflect.get(...arguments);
				},
			}
		);
	}

	const handlePageClick = (event) => {
		const newOffset = initialOffset.current + event.selected * perPage;

		const currentPage =
			Math.round((event.selected * perPage) / perPage) + 1;

		setPage(currentPage);

		window[`jfQueryProxy${queryId}`].offset = newOffset;
		window.history.pushState(
			{ paged: currentPage },
			'',
			addQueryArgs(window.location.href, { paged: currentPage })
		);
	};

	return (
		<>
			<ul
				ref={ref}
				className={classnames('wp-block-jf-blog-template__posts', {
					loading,
				})}
				data-page={page}
				dangerouslySetInnerHTML={{ __html: data }}
			/>
			{totalPages > 1 && (
				<ReactPaginate
					breakLabel={null}
					nextLabel="Next"
					forcePage={initialPage.current}
					onPageChange={handlePageClick}
					pageRangeDisplayed={3}
					marginPagesDisplayed={0}
					pageCount={totalPages}
					previousLabel="Previous"
					renderOnZeroPageCount={null}
					className="wp-block-jf-blog-template__pagination"
				/>
			)}
		</>
	);
});
const elms = document.getElementsByClassName('wp-block-jf-blog-template');

window.addEventListener('DOMContentLoaded', () => {
	for (let i = 0; i < elms.length; i++) {
		const root = createRoot(elms[i]);
		const ref = createRef();

		root.render(
			<Blog
				ref={ref}
				initData={elms[i].firstChild.innerHTML}
				block={elms[i].getAttribute('data-block')}
			/>
		);
		elms[i].removeAttribute('data-block');
	}
});
