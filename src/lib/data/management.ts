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
		affiliationUrl: 'https://www.ntnu.no',
		image: '/images/management/sebastien-nicolas-gros.jpg'
	},
	{
		name: 'Signe Riemer-Sørensen',
		title: 'Research Director',
		role: 'Co-director',
		affiliation: 'SINTEF',
		affiliationUrl: 'https://www.sintef.no',
		image: '/images/management/signe-riemer-sorensen.jpg'
	},
	{
		name: 'Verner Hølleland',
		title: 'Project Manager',
		role: '',
		affiliation: 'NTNU',
		affiliationUrl: 'https://www.ntnu.no',
		image: '/images/management/verner-holleland.jpg'
	},
	{
		name: 'Stefan Werner',
		title: 'Professor',
		role: '',
		affiliation: 'NTNU',
		affiliationUrl: 'https://www.ntnu.no',
		image: '/images/management/stefan-werner.jpg'
	},
	{
		name: 'Odd Are Svensen',
		title: 'Research Director',
		role: '',
		affiliation: 'SINTEF',
		affiliationUrl: 'https://www.sintef.no',
		image: '/images/management/odd-are-svensen.jpg'
	},
	{
		name: 'Anders Sleire',
		title: 'Manager NORCE Analytics',
		role: '',
		affiliation: 'Norce',
		affiliationUrl: 'https://www.norceresearch.no',
		image: ''
	},
	{
		name: 'Iben Alexander Eikrem Nesset',
		title: 'Forskningskoordinator',
		role: '',
		affiliation: 'SINTEF',
		affiliationUrl: 'https://www.sintef.no',
		image: '/images/management/iben-alexander-eikrem-nesset.jpg'
	}
];
