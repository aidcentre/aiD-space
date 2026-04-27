export type ManagementMember = {
	name: string;
	title: string;
	role: string;
	affiliation: string;
	affiliationUrl: string;
	image: string;
};

export const management_data: ManagementMember[] = [
	{
		name: 'Sebastien Nicolas Gros',
		title: 'Professor',
		role: 'Director',
		affiliation: 'NTNU',
		affiliationUrl: 'https://www.ntnu.no/ansatte/sebastien.gros',
		image: '/images/management/sebastien-nicolas-gros.jpg'
	},
	{
		name: 'Signe Riemer-Sørensen',
		title: 'Research Director',
		role: 'Co-director',
		affiliation: 'SINTEF',
		affiliationUrl: 'https://www.sintef.no/alle-ansatte/ansatt/signe.riemer-sorensen/',
		image: '/images/management/signe-riemer-sorensen.jpg'
	},
	{
		name: 'Verner Hølleland',
		title: 'Project Manager',
		role: '',
		affiliation: 'NTNU',
		affiliationUrl: 'https://www.ntnu.no/ansatte/verner.holleland',
		image: '/images/management/verner-holleland.jpg'
	},
	{
		name: 'Stefan Werner',
		title: 'Professor',
		role: '',
		affiliation: 'NTNU',
		affiliationUrl: 'https://www.ntnu.edu/employees/stefan.werner',
		image: '/images/management/stefan-werner.jpg'
	},
	{
		name: 'Odd Are Svensen',
		title: 'Research Director',
		role: '',
		affiliation: 'SINTEF',
		affiliationUrl: 'https://www.sintef.no/alle-ansatte/ansatt/odd.are.svensen/',
		image: '/images/management/odd-are-svensen.jpg'
	},
	{
		name: 'Anders Sleire',
		title: 'Manager NORCE Analytics',
		role: '',
		affiliation: 'Norce',
		affiliationUrl: 'https://www.norceresearch.no/personer/anders-sleire/38858218',
		image: ''
	},
	{
		name: 'Iben Alexander Eikrem Nesset',
		title: 'Forskningskoordinator',
		role: '',
		affiliation: 'SINTEF',
		affiliationUrl: 'https://www.sintef.no/alle-ansatte/ansatt/iben.nesset/',
		image: '/images/management/iben-alexander-eikrem-nesset.jpg'
	}
];
