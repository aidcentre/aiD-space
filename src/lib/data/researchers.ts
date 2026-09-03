/**
 * Metadata for the AID research roster, keyed to the exact name strings the
 * expertise-search backend returns in `most_relevant_researchers`.
 *
 * The backend has only names — no photo, affiliation or link — so that data
 * lives here. Photos are fetched once from each person's SINTEF / NTNU / NORCE
 * profile page by `scripts/fetch-researcher-images.mjs` and committed under
 * `static/images/researchers/`.
 *
 * This is a separate list from `management.ts` on purpose: that one drives the
 * contact page, uses full legal names, and only overlaps this roster by three
 * people.
 */

export type Researcher = {
	/** EXACT string as it arrives from the backend (the join key). */
	rosterName: string;
	/** Human-facing name: real diacritics, normal spacing. */
	displayName: string;
	/** Employer shown in the card subtitle. '' when unknown. */
	institution: string;
	/** Optional role, prepended to the institution in the subtitle. */
	title?: string;
	/** Public profile page. '' when none was found. */
	profileUrl: string;
	/** Path under static/. '' → the card falls back to the placeholder. */
	image: string;
};

/**
 * Collapse a name to a comparison key that survives the roster's
 * inconsistencies: underscores vs spaces, ASCII-folded vs real diacritics
 * (`Sorensen` vs `Sørensen`), concatenated given names, stray markdown.
 *
 * NFD decomposes å→a, ö→o, é→e; ø/æ/ß don't decompose and need explicit rules.
 */
export function normalizeName(input: string): string {
	return input
		.replace(/\*\*/g, '')
		.normalize('NFD')
		.replace(/\p{Mn}/gu, '') // strip combining diacritics: å→a, ö→o, é→e
		.replace(/[øØ]/g, 'o')
		.replace(/[æÆ]/g, 'ae')
		.replace(/ß/g, 'ss')
		.toLowerCase()
		.replace(/[_.\-]+/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

export const researchers_data: Researcher[] = [
	{
		rosterName: 'Ahmed_Mohammed',
		displayName: 'Ahmed Mohammed',
		institution: 'SINTEF',
		title: 'Senior Researcher',
		profileUrl: 'https://www.sintef.no/alle-ansatte/ansatt/ahmed.mohammed/',
		image: '/images/researchers/ahmed-mohammed.jpg'
	},
	{
		rosterName: 'Akhil S Anand',
		displayName: 'Akhil S. Anand',
		institution: 'NTNU',
		title: 'Researcher',
		profileUrl: 'https://www.ntnu.no/ansatte/akhil.s.anand',
		image: '/images/researchers/akhil-s-anand.jpg'
	},
	{
		rosterName: 'Antonios_Danelakis',
		displayName: 'Antonios Danelakis',
		institution: 'NTNU',
		title: 'Researcher',
		profileUrl: 'https://www.ntnu.edu/employees/antonida',
		image: '/images/researchers/antonios-danelakis.jpg'
	},
	{
		rosterName: 'Christian Klöckner',
		displayName: 'Christian A. Klöckner',
		institution: 'NTNU',
		title: 'Professor',
		profileUrl: 'https://www.ntnu.no/ansatte/christian.klockner',
		image: '/images/researchers/christian-klockner.jpg'
	},
	{
		rosterName: 'Christian_Andresen',
		displayName: 'Christian André Andresen',
		institution: 'SINTEF',
		title: 'Senior Researcher',
		profileUrl: 'https://www.sintef.no/alle-ansatte/ansatt/christian.andresen/',
		image: '/images/researchers/christian-andresen.jpg'
	},
	{
		rosterName: 'EstenIngar_Grøtli',
		displayName: 'Esten Ingar Grøtli',
		institution: 'SINTEF',
		title: 'Senior Researcher',
		profileUrl: 'https://www.sintef.no/alle-ansatte/ansatt/esteningar.grotli/',
		image: '/images/researchers/esten-ingar-grotli.jpg'
	},
	{
		rosterName: 'Helge_Langseth',
		displayName: 'Helge Langseth',
		institution: 'NTNU',
		title: 'Professor',
		profileUrl: 'https://www.ntnu.no/ansatte/helge.langseth',
		image: '/images/researchers/helge-langseth.jpg'
	},
	{
		rosterName: 'Henrik_Andersson',
		displayName: 'Henrik Andersson',
		institution: 'NTNU',
		title: 'Professor',
		profileUrl: 'https://www.ntnu.no/ansatte/henrik.andersson',
		image: '/images/researchers/henrik-andersson.jpg'
	},
	{
		rosterName: 'Ivan_Depina',
		displayName: 'Ivan Depina',
		institution: 'NTNU',
		title: 'Associate Professor',
		profileUrl: 'https://www.ntnu.edu/employees/ivan.depina',
		image: '/images/researchers/ivan-depina.jpg'
	},
	{
		// Roster data looks corrupted (no resolvable person). Renders a clean
		// placeholder card; the real fix belongs in the backend's
		// researcher_information.pkl + re-ingest.
		rosterName: 'Johra_Kamilla',
		displayName: 'Johra Kamilla',
		institution: '',
		profileUrl: '',
		image: ''
	},
	{
		rosterName: 'Jonathan_Whitlock',
		displayName: 'Jonathan Whitlock',
		institution: 'NTNU',
		title: 'Professor',
		profileUrl: 'https://www.ntnu.no/ansatte/jonathan.whitlock',
		image: '/images/researchers/jonathan-whitlock.jpg'
	},
	{
		// Roster folder is 'Jo_Strandhagen'; resolved to the production-logistics
		// professor Jan Ola Strandhagen. Verify against the AID member list.
		rosterName: 'Jo_Strandhagen',
		displayName: 'Jan Ola Strandhagen',
		institution: 'NTNU',
		title: 'Professor',
		profileUrl: 'https://www.ntnu.edu/employees/ola.strandhagen',
		image: '/images/researchers/jan-ola-strandhagen.jpg'
	},
	{
		rosterName: 'Knut-Andreas Lie',
		displayName: 'Knut-Andreas Lie',
		institution: 'SINTEF',
		title: 'Chief Researcher',
		profileUrl: 'https://www.sintef.no/alle-ansatte/ansatt/knut-andreas.lie/',
		image: '/images/researchers/knut-andreas-lie.jpg'
	},
	{
		// NORCE profile shows a default avatar — no photo to fetch.
		rosterName: 'Kristian_Fossum',
		displayName: 'Kristian Fossum',
		institution: 'NORCE',
		title: 'Senior Researcher',
		profileUrl: 'https://www.norceresearch.no/en/persons/kristian-fossum/669',
		image: ''
	},
	{
		rosterName: 'Magnus_Stålhane',
		displayName: 'Magnus Stålhane',
		institution: 'NTNU',
		title: 'Professor',
		profileUrl: 'https://www.ntnu.edu/employees/magnus.staalhane',
		image: '/images/researchers/magnus-stalhane.jpg'
	},
	{
		rosterName: 'Maria_V_Ottermo',
		displayName: 'Maria Vatshaug Ottermo',
		institution: 'SINTEF',
		title: 'Research Manager',
		profileUrl: 'https://www.sintef.no/alle-ansatte/ansatt/maria.v.ottermo/',
		image: '/images/researchers/maria-vatshaug-ottermo.jpg'
	},
	{
		rosterName: 'Mark_Haring',
		displayName: 'Mark Haring',
		institution: 'SINTEF',
		title: 'Researcher',
		profileUrl: 'https://www.sintef.no/alle-ansatte/ansatt/mark.haring/',
		image: '/images/researchers/mark-haring.jpg'
	},
	{
		rosterName: 'Mary Ann Lundteigen',
		displayName: 'Mary Ann Lundteigen',
		institution: 'NTNU',
		title: 'Professor',
		profileUrl: 'https://www.ntnu.no/ansatte/mary.a.lundteigen',
		image: '/images/researchers/mary-ann-lundteigen.jpg'
	},
	{
		rosterName: 'Olav Møyner',
		displayName: 'Olav Møyner',
		institution: 'SINTEF',
		title: 'Senior Researcher',
		profileUrl: 'https://www.sintef.no/alle-ansatte/ansatt/olav.moyner/',
		image: '/images/researchers/olav-moyner.jpg'
	},
	{
		rosterName: 'Patrick_Mikalef',
		displayName: 'Patrick Mikalef',
		institution: 'NTNU',
		title: 'Professor',
		profileUrl: 'https://www.ntnu.no/ansatte/patrick.mikalef',
		image: '/images/researchers/patrick-mikalef.jpg'
	},
	{
		rosterName: 'Per_Oivind_Braarud',
		displayName: 'Per Øivind Braarud',
		institution: 'IFE',
		title: 'Principal Scientist',
		profileUrl: 'https://ife.no/en/employee/per-oivind-braarud-2/',
		image: '/images/researchers/per-oivind-braarud.jpg'
	},
	{
		rosterName: 'Phu_Nguyen',
		displayName: 'Phu Nguyen',
		institution: 'SINTEF',
		title: 'Senior Researcher',
		profileUrl: 'https://www.sintef.no/alle-ansatte/ansatt/phu.nguyen/',
		image: '/images/researchers/phu-nguyen.jpg'
	},
	{
		rosterName: 'Sabita Maharjan',
		displayName: 'Sabita Maharjan',
		institution: 'University of Oslo',
		title: 'Professor',
		profileUrl: 'https://www.mn.uio.no/ifi/english/people/aca/sabita/',
		image: '/images/researchers/sabita-maharjan.jpg'
	},
	{
		rosterName: 'Sebastien Gros',
		displayName: 'Sébastien Gros',
		institution: 'NTNU',
		title: 'Professor',
		profileUrl: 'https://www.ntnu.no/ansatte/sebastien.gros',
		image: '/images/researchers/sebastien-gros.jpg'
	},
	{
		rosterName: 'Signe_Riemer-Sorensen',
		displayName: 'Signe Riemer-Sørensen',
		institution: 'SINTEF',
		title: 'Research Manager',
		profileUrl: 'https://www.sintef.no/alle-ansatte/ansatt/signe.riemer-sorensen/',
		image: '/images/researchers/signe-riemer-sorensen.jpg'
	},
	{
		rosterName: 'Simon_Halvdansson',
		displayName: 'Simon Halvdansson',
		institution: 'SINTEF',
		title: 'Researcher',
		profileUrl: 'https://www.sintef.no/alle-ansatte/ansatt/simon.halvdansson/',
		image: '/images/researchers/simon-halvdansson.jpg'
	},
	{
		rosterName: 'Stefan Werner',
		displayName: 'Stefan Werner',
		institution: 'NTNU',
		title: 'Professor',
		profileUrl: 'https://www.ntnu.edu/employees/stefan.werner',
		image: '/images/researchers/stefan-werner.jpg'
	},
	{
		rosterName: 'Steffen_Bakker',
		displayName: 'Steffen J. Bakker',
		institution: 'NTNU',
		title: 'Associate Professor',
		profileUrl: 'https://www.ntnu.no/ansatte/steffen.bakker',
		image: '/images/researchers/steffen-bakker.jpg'
	},
	{
		rosterName: 'Sven-Vegard_Buer',
		displayName: 'Sven-Vegard Buer',
		institution: 'SINTEF',
		title: 'Senior Researcher',
		profileUrl: 'https://www.sintef.no/alle-ansatte/ansatt/sven-vegard.buer/',
		image: '/images/researchers/sven-vegard-buer.jpg'
	},
	{
		rosterName: 'Sølve_Eidnes',
		displayName: 'Sølve Eidnes',
		institution: 'SINTEF',
		title: 'Senior Researcher',
		profileUrl: 'https://www.sintef.no/alle-ansatte/ansatt/solve.eidnes/',
		image: '/images/researchers/solve-eidnes.jpg'
	},
	{
		rosterName: 'Thor Myklebust',
		displayName: 'Thor Myklebust',
		institution: 'SINTEF',
		title: 'Senior Researcher',
		profileUrl: 'https://www.sintef.no/alle-ansatte/ansatt/thor.myklebust/',
		image: '/images/researchers/thor-myklebust.jpg'
	},
	{
		rosterName: 'Trond_Kvamsdal',
		displayName: 'Trond Kvamsdal',
		institution: 'NTNU',
		title: 'Professor',
		profileUrl: 'https://www.ntnu.no/ansatte/trond.kvamsdal',
		image: '/images/researchers/trond-kvamsdal.jpg'
	}
];

const byKey = new Map(researchers_data.map((r) => [normalizeName(r.rosterName), r]));

/** Look up roster metadata by the backend's raw name string. */
export function findResearcher(rosterName: string): Researcher | undefined {
	return byKey.get(normalizeName(rosterName));
}

/** Display name for a roster string, falling back to a de-underscored form. */
export function displayNameFor(rosterName: string): string {
	return (
		findResearcher(rosterName)?.displayName ??
		rosterName.replace(/_/g, ' ').replace(/\s+/g, ' ').trim()
	);
}
