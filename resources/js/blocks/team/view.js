window.addEventListener('DOMContentLoaded', () => {
	const jfTeams = document.getElementsByClassName('wp-block-jf-team');

	function dialogClickHandler(e) {
		if (e.target.tagName !== 'DIALOG')
			//This prevents issues with forms
			return;

		const rect = e.target.getBoundingClientRect();

		const clickedInDialog =
			rect.top <= e.clientY &&
			e.clientY <= rect.top + rect.height &&
			rect.left <= e.clientX &&
			e.clientX <= rect.left + rect.width;

		if (clickedInDialog === false) e.target.close();
	}

	for (let i = 0; i < jfTeams.length; i++) {
		const openButton = jfTeams[i].querySelector(
			'.wp-block-jf-team__button.open'
		);
		const closeButton = jfTeams[i].querySelector(
			'.wp-block-jf-team__button.close'
		);
		const dialog = jfTeams[i].querySelector('dialog');

		dialog.addEventListener('close', () =>
			document.removeEventListener('click', dialogClickHandler)
		);

		openButton.addEventListener('click', (e) => {
			dialog.showModal();

			setTimeout(() => {
				document.addEventListener('click', dialogClickHandler);
			}, 250);
		});

		closeButton.addEventListener('click', (e) => {
			dialog.close();
		});
	}
});
