import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	return {
		meta: {
			title: 'About',
			description:
				"An explanation of what the aiD centre is, as well as the aiD centre's research areas, real-world impact, use cases, mission and goals, and sustainability and ethics."
		}
	};
};
