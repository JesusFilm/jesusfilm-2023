import ServerSideRender from '@wordpress/server-side-render';
import { useBlockProps } from '@wordpress/block-editor';

export default function Edit(props) {
	const blockProps = useBlockProps();
	return (
		<div {...blockProps}>
			<ServerSideRender
				block="jf/breadcrumbs"
				attributes={props.attributes}
			/>
		</div>
	);
}
