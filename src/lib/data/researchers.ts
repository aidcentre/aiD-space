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
	/**
	 * NVA (Cristin) person identifier, looked up via
	 * https://api.nva.unit.no/cristin/person?name=… and matched on affiliation.
	 * '' when none was found. See `nvaProfileUrl`.
	 */
	nvaId: string;
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
		nvaId: '811849',
		image: '/images/researchers/ahmed-mohammed.jpg'
	},
	{
		rosterName: 'Akhil S Anand',
		displayName: 'Akhil S. Anand',
		institution: 'NTNU',
		title: 'Researcher',
		profileUrl: 'https://www.ntnu.no/ansatte/akhil.s.anand',
		nvaId: '1126196',
		image: '/images/researchers/akhil-s-anand.jpg'
	},
	{
		rosterName: 'Antonios_Danelakis',
		displayName: 'Antonios Danelakis',
		institution: 'NTNU',
		title: 'Researcher',
		profileUrl: 'https://www.ntnu.edu/employees/antonida',
		nvaId: '856922',
		image: '/images/researchers/antonios-danelakis.jpg'
	},
	{
		rosterName: 'Christian Klöckner',
		displayName: 'Christian A. Klöckner',
		institution: 'NTNU',
		title: 'Professor',
		profileUrl: 'https://www.ntnu.no/ansatte/christian.klockner',
		nvaId: '25198',
		image: '/images/researchers/christian-klockner.jpg'
	},
	{
		rosterName: 'Christian_Andresen',
		displayName: 'Christian André Andresen',
		institution: 'SINTEF',
		title: 'Senior Researcher',
		profileUrl: 'https://www.sintef.no/alle-ansatte/ansatt/christian.andresen/',
		nvaId: '36297',
		image: '/images/researchers/christian-andresen.jpg'
	},
	{
		rosterName: 'EstenIngar_Grøtli',
		displayName: 'Esten Ingar Grøtli',
		institution: 'SINTEF',
		title: 'Senior Researcher',
		profileUrl: 'https://www.sintef.no/alle-ansatte/ansatt/esteningar.grotli/',
		nvaId: '34704',
		image: '/images/researchers/esten-ingar-grotli.jpg'
	},
	{
		rosterName: 'Helge_Langseth',
		displayName: 'Helge Langseth',
		institution: 'NTNU',
		title: 'Professor',
		profileUrl: 'https://www.ntnu.no/ansatte/helge.langseth',
		nvaId: '38277',
		image: '/images/researchers/helge-langseth.jpg'
	},
	{
		rosterName: 'Henrik_Andersson',
		displayName: 'Henrik Andersson',
		institution: 'NTNU',
		title: 'Professor',
		profileUrl: 'https://www.ntnu.no/ansatte/henrik.andersson',
		nvaId: '29741',
		image: '/images/researchers/henrik-andersson.jpg'
	},
	{
		rosterName: 'Ivan_Depina',
		displayName: 'Ivan Depina',
		institution: 'NTNU',
		title: 'Associate Professor',
		profileUrl: 'https://www.ntnu.edu/employees/ivan.depina',
		nvaId: '481384',
		image: '/images/researchers/ivan-depina.jpg'
	},
	{
		// Roster folder 'Johra_Kamilla' is "Johra, Kamilla" (surname truncated).
		// Her SINTEF slug still uses her maiden name, Andersen.
		rosterName: 'Johra_Kamilla',
		displayName: 'Kamilla Heimar Johra',
		institution: 'SINTEF',
		title: 'Researcher',
		profileUrl: 'https://www.sintef.no/alle-ansatte/ansatt/kamilla.andersen/',
		nvaId: '1151746',
		image: '/images/researchers/kamilla-johra.jpg'
	},
	{
		rosterName: 'Jonathan_Whitlock',
		displayName: 'Jonathan Whitlock',
		institution: 'NTNU',
		title: 'Professor',
		profileUrl: 'https://www.ntnu.no/ansatte/jonathan.whitlock',
		nvaId: '29635',
		image: '/images/researchers/jonathan-whitlock.jpg'
	},
	{
		// Jo Wessel Strandhagen at SINTEF — not the NTNU professor Jan Ola.
		rosterName: 'Jo_Strandhagen',
		displayName: 'Jo Wessel Strandhagen',
		institution: 'SINTEF',
		title: 'Researcher',
		profileUrl: 'https://www.sintef.no/alle-ansatte/ansatt/jo.strandhagen/',
		nvaId: '704610',
		image: '/images/researchers/jo-wessel-strandhagen.jpg'
	},
	{
		rosterName: 'Knut-Andreas Lie',
		displayName: 'Knut-Andreas Lie',
		institution: 'SINTEF',
		title: 'Chief Researcher',
		profileUrl: 'https://www.sintef.no/alle-ansatte/ansatt/knut-andreas.lie/',
		nvaId: '22402',
		image: '/images/researchers/knut-andreas-lie.jpg'
	},
	{
		// NORCE profile has no photo; this headshot was added by hand, so the
		// fetch script leaves it alone (page: '').
		rosterName: 'Kristian_Fossum',
		displayName: 'Kristian Fossum',
		institution: 'NORCE',
		title: 'Senior Researcher',
		profileUrl: 'https://www.norceresearch.no/en/persons/kristian-fossum/669',
		nvaId: '399572',
		image: '/images/researchers/kristian-fossum.jpg'
	},
	{
		rosterName: 'Magnus_Stålhane',
		displayName: 'Magnus Stålhane',
		institution: 'NTNU',
		title: 'Professor',
		profileUrl: 'https://www.ntnu.edu/employees/magnus.staalhane',
		nvaId: '41606',
		image: '/images/researchers/magnus-stalhane.jpg'
	},
	{
		rosterName: 'Maria_V_Ottermo',
		displayName: 'Maria Vatshaug Ottermo',
		institution: 'SINTEF',
		title: 'Research Manager',
		profileUrl: 'https://www.sintef.no/alle-ansatte/ansatt/maria.v.ottermo/',
		nvaId: '42939',
		image: '/images/researchers/maria-vatshaug-ottermo.jpg'
	},
	{
		rosterName: 'Mark_Haring',
		displayName: 'Mark Haring',
		institution: 'SINTEF',
		title: 'Researcher',
		profileUrl: 'https://www.sintef.no/alle-ansatte/ansatt/mark.haring/',
		nvaId: '412110',
		image: '/images/researchers/mark-haring.jpg'
	},
	{
		rosterName: 'Mary Ann Lundteigen',
		displayName: 'Mary Ann Lundteigen',
		institution: 'NTNU',
		title: 'Professor',
		profileUrl: 'https://www.ntnu.no/ansatte/mary.a.lundteigen',
		nvaId: '36755',
		image: '/images/researchers/mary-ann-lundteigen.jpg'
	},
	{
		rosterName: 'Olav Møyner',
		displayName: 'Olav Møyner',
		institution: 'SINTEF',
		title: 'Senior Researcher',
		profileUrl: 'https://www.sintef.no/alle-ansatte/ansatt/olav.moyner/',
		nvaId: '35132',
		image: '/images/researchers/olav-moyner.jpg'
	},
	{
		rosterName: 'Patrick_Mikalef',
		displayName: 'Patrick Mikalef',
		institution: 'NTNU',
		title: 'Professor',
		profileUrl: 'https://www.ntnu.no/ansatte/patrick.mikalef',
		nvaId: '785385',
		image: '/images/researchers/patrick-mikalef.jpg'
	},
	{
		rosterName: 'Per_Oivind_Braarud',
		displayName: 'Per Øivind Braarud',
		institution: 'IFE',
		title: 'Principal Scientist',
		profileUrl: 'https://ife.no/en/employee/per-oivind-braarud-2/',
		nvaId: '397460',
		image: '/images/researchers/per-oivind-braarud.jpg'
	},
	{
		rosterName: 'Phu_Nguyen',
		displayName: 'Phu Nguyen',
		institution: 'SINTEF',
		title: 'Senior Researcher',
		profileUrl: 'https://www.sintef.no/alle-ansatte/ansatt/phu.nguyen/',
		nvaId: '745713',
		image: '/images/researchers/phu-nguyen.jpg'
	},
	{
		rosterName: 'Sabita Maharjan',
		displayName: 'Sabita Maharjan',
		institution: 'University of Oslo',
		title: 'Professor',
		profileUrl: 'https://www.mn.uio.no/ifi/english/people/aca/sabita/',
		nvaId: '4548',
		image: '/images/researchers/sabita-maharjan.jpg'
	},
	{
		rosterName: 'Sebastien Gros',
		displayName: 'Sébastien Gros',
		institution: 'NTNU',
		title: 'Professor',
		profileUrl: 'https://www.ntnu.no/ansatte/sebastien.gros',
		nvaId: '1088032',
		image: '/images/researchers/sebastien-gros.jpg'
	},
	{
		rosterName: 'Signe_Riemer-Sorensen',
		displayName: 'Signe Riemer-Sørensen',
		institution: 'SINTEF',
		title: 'Research Manager',
		profileUrl: 'https://www.sintef.no/alle-ansatte/ansatt/signe.riemer-sorensen/',
		nvaId: '549637',
		image: '/images/researchers/signe-riemer-sorensen.jpg'
	},
	{
		rosterName: 'Simon_Halvdansson',
		displayName: 'Simon Halvdansson',
		institution: 'SINTEF',
		title: 'Researcher',
		profileUrl: 'https://www.sintef.no/alle-ansatte/ansatt/simon.halvdansson/',
		nvaId: '1316547',
		image: '/images/researchers/simon-halvdansson.jpg'
	},
	{
		rosterName: 'Stefan Werner',
		displayName: 'Stefan Werner',
		institution: 'NTNU',
		title: 'Professor',
		profileUrl: 'https://www.ntnu.edu/employees/stefan.werner',
		nvaId: '810673',
		image: '/images/researchers/stefan-werner.jpg'
	},
	{
		rosterName: 'Steffen_Bakker',
		displayName: 'Steffen J. Bakker',
		institution: 'NTNU',
		title: 'Associate Professor',
		profileUrl: 'https://www.ntnu.no/ansatte/steffen.bakker',
		nvaId: '763731',
		image: '/images/researchers/steffen-bakker.jpg'
	},
	{
		rosterName: 'Sven-Vegard_Buer',
		displayName: 'Sven-Vegard Buer',
		institution: 'SINTEF',
		title: 'Senior Researcher',
		profileUrl: 'https://www.sintef.no/alle-ansatte/ansatt/sven-vegard.buer/',
		nvaId: '726738',
		image: '/images/researchers/sven-vegard-buer.jpg'
	},
	{
		rosterName: 'Sølve_Eidnes',
		displayName: 'Sølve Eidnes',
		institution: 'SINTEF',
		title: 'Senior Researcher',
		profileUrl: 'https://www.sintef.no/alle-ansatte/ansatt/solve.eidnes/',
		nvaId: '803455',
		image: '/images/researchers/solve-eidnes.jpg'
	},
	{
		rosterName: 'Thor Myklebust',
		displayName: 'Thor Myklebust',
		institution: 'SINTEF',
		title: 'Senior Researcher',
		profileUrl: 'https://www.sintef.no/alle-ansatte/ansatt/thor.myklebust/',
		nvaId: '412485',
		image: '/images/researchers/thor-myklebust.jpg'
	},
	{
		rosterName: 'Trond_Kvamsdal',
		displayName: 'Trond Kvamsdal',
		institution: 'NTNU',
		title: 'Professor',
		profileUrl: 'https://www.ntnu.no/ansatte/trond.kvamsdal',
		nvaId: '31011',
		image: '/images/researchers/trond-kvamsdal.jpg'
	}
];

/** Public NVA research-profile page for a researcher, or undefined when unknown. */
export function nvaProfileUrl(researcher: Researcher | undefined): string | undefined {
	return researcher?.nvaId ? `https://nva.sikt.no/research-profile/${researcher.nvaId}` : undefined;
}

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
