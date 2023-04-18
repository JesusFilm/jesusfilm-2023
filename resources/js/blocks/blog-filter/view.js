import {
	createRoot,
	useState,
	createRef,
	forwardRef,
} from '@wordpress/element';
import Select from 'react-select';
import classNames from 'classnames';

const BlogFilter = forwardRef((props, ref) => {
	const [data, setData] = useState(props.initData);
	const { type, atts } = props;

	const [value, setValue] = useState(null);

	const selectFilter = (val) => {
		let valValue = val.value;

		const queryId = ref?.current
			?.closest('[data-query-id]')
			?.getAttribute('data-query-id');

		if (queryId) {
			if (value === val) {
				setValue(null);
				valValue = '';
			} else {
				setValue(val);
			}

			if ('taxonomy' === type) {
				if ('' === valValue) {
					window[`jfQueryProxy${queryId}`].taxQuery = {};
				} else {
					window[`jfQueryProxy${queryId}`].taxQuery = {
						[atts.filterTaxonomy]: [valValue],
					};
				}
			} else if ('author' === type) {
				window[`jfQueryProxy${queryId}`].author = valValue;
			}
		}
	};

	return (
		<>
			<ul className="wp-block-jf-blog-filter__list" ref={ref}>
				{data.map((term) => (
					<li
						key={term.value}
						data-key={term.value}
						className={classNames({
							selected: term.value === value?.value,
						})}
					>
						<button onClick={(e) => selectFilter(term)}>
							{type === 'author' && (
								<img
									src={term.extras.avatar}
									alt={term.label}
									aria-hidden="true"
								/>
							)}
							{term.label}
						</button>
					</li>
				))}
			</ul>
			<Select
				className="wp-block-jf-blog-filter__select"
				classNamePrefix="wp-block-jf-blog-filter__select"
				value={value}
				options={data}
				formatOptionLabel={
					'author' !== type
						? null
						: (author) => (
								<>
									<img
										src={author.extras.avatar}
										alt={author.label}
									/>
									{author.label}
								</>
						  )
				}
				onChange={(val, type) => selectFilter(val)}
			/>
		</>
	);
});

const elms = document.getElementsByClassName('wp-block-jf-blog-filter');

window.addEventListener('DOMContentLoaded', () => {
	for (let i = 0; i < elms.length; i++) {
		const root = createRoot(elms[i]);
		const ref = createRef();

		root.render(
			<BlogFilter
				ref={ref}
				atts={JSON.parse(elms[i].getAttribute('data-attrs'))}
				initData={JSON.parse(elms[i].getAttribute('data-data'))}
				type={elms[i].getAttribute('data-type')}
			/>
		);
	}
});
