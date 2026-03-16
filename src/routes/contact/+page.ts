import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	return {
		meta: {
			title: 'Contact',
			description:
				'Information on how to contact the aiD centre by phone number or email address, and see its core, standard, and networking partners.'
		}
	};
};
