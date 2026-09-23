import type { PageServerLoad } from './$types';
import { contactPageQuery } from '$lib/sanity/queries';
import { withLogoBounds } from '$lib/sanity/logoBounds.server';
import type { ContactDocument } from '$lib/sanity/types';

export const load: PageServerLoad = async ({ locals }) => {
	const { sanity } = locals;
	const { data: contact } = await sanity.loadQuery<ContactDocument | null>(contactPageQuery, {});

	if (contact?.contentBlocks) {
		contact.contentBlocks = await Promise.all(
			contact.contentBlocks.map(async (block) =>
				block._type === 'partners' && block.partners
					? { ...block, partners: await withLogoBounds(block.partners) }
					: block
			)
		);
	}

	return { contact };
};
