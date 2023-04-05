import { __ } from '@wordpress/i18n';

function ChevronIcon() {
    return (
        <button aria-label={__('Toggle menu')}>
            <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.3574 1.64648L12.8008 1.06055C12.6543 0.914062 12.4199 0.914062 12.3027 1.06055L7 6.36328L1.66797 1.06055C1.55078 0.914062 1.31641 0.914062 1.16992 1.06055L0.613281 1.64648C0.466797 1.76367 0.466797 1.99805 0.613281 2.14453L6.73633 8.26758C6.88281 8.41406 7.08789 8.41406 7.23438 8.26758L13.3574 2.14453C13.5039 1.99805 13.5039 1.76367 13.3574 1.64648Z" fill="currentColor" />
            </svg>
        </button>
    );
}

export { ChevronIcon };