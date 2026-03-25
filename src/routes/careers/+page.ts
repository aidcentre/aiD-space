import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	return {
		meta: {
			title: 'Careers',
			description:
				"Information on careers at the aiD centre, including job openings, application process, and requirements."
		}
	};
};
