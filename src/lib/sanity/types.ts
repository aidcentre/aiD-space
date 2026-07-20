/**
 * TypeScript types mirroring the projections in `$lib/sanity/queries` and the
 * schemas in `studio/schemaTypes`. These are hand-written for now; when
 * `@sanity/typegen` is wired up they should be replaced by generated types.
 */

import type { PortableTextBlock } from '@portabletext/types';

export interface SanityImageAsset {
	_id: string;
	_type: 'sanity.imageAsset';
	url: string;
	metadata?: {
		dimensions?: { width: number; height: number; aspectRatio: number };
		lqip?: string;
	};
}

export interface SanityImage {
	_type?: 'image';
	asset?: SanityImageAsset;
	hotspot?: { x: number; y: number; height: number; width: number };
	crop?: { top: number; bottom: number; left: number; right: number };
	alt?: string;
}

export interface Seo {
	seoTitle?: string;
	seoDescription?: string;
	seoKeywords?: string;
	seoImage?: SanityImage;
}

export interface Employee {
	_id: string;
	name?: string;
	role?: string;
	image?: SanityImage;
	affiliationGroup?: {
		label?: string;
		url?: string;
	};
}

export interface Partner {
	_id: string;
	name?: string;
	logo?: SanityImage;
}

export interface PartnerBucketEntry extends Partner {
	_type: 'core' | 'standard' | 'networking';
}

export interface NavigationItem {
	_id: string;
	_type: 'home' | 'contact' | 'page' | 'careers' | 'events';
	title: string;
	url: string;
}

export interface Settings extends Seo {
	_id: 'settings';
	description?: string;
	contactInformation?: {
		email?: string;
		phone?: string;
	};
	externalUrl?: {
		label?: string;
		url?: string;
	};
	favicon?: SanityImage;
	navigation?: NavigationItem[];
}

export interface Home extends Seo {
	_id: 'home';
	description?: string;
	externalUrl?: string;
}

interface BlockBase {
	_key: string;
}

export interface SingleCardBlock extends BlockBase {
	_type: 'singlecard';
	title?: string;
	text?: string;
	image?: SanityImage;
}

export interface MilestonesBlock extends BlockBase {
	_type: 'milestones';
	title?: string;
	text?: string;
	milestones?: string[];
}

export interface KeyNumberEntry {
	_key: string;
	number?: string;
	text?: string;
}

export interface KeyNumbersBlock extends BlockBase {
	_type: 'keynumbers';
	title?: string;
	text?: PortableTextBlock[];
	keynumbers?: KeyNumberEntry[];
}

export interface ListItem {
	_key: string;
	title?: string;
	text?: string;
}

export interface ListBlock extends BlockBase {
	_type: 'list';
	title?: string;
	headline?: string;
	list?: ListItem[];
}

export interface InvertedListBlock extends BlockBase {
	_type: 'invertedList';
	headline?: string;
	list?: ListItem[];
}

export type PageBlock =
	| SingleCardBlock
	| MilestonesBlock
	| KeyNumbersBlock
	| ListBlock
	| InvertedListBlock;

export interface EmployeesBlockType extends BlockBase {
	_type: 'employees';
	title?: string;
	employees?: Employee[];
}

export interface PartnersBlockType extends BlockBase {
	_type: 'partners';
	title?: string;
	partners?: PartnerBucketEntry[];
}

export type ContactBlock = EmployeesBlockType | PartnersBlockType;

export interface PageDocument extends Seo {
	_id: string;
	title?: string;
	slug?: string;
	introduction?: string;
	contentBlocks?: PageBlock[];
}

export interface ProjectByEntry {
	_key?: string;
	label?: string;
	logo?: SanityImage;
}

export interface Partnership {
	title?: string;
	label?: string;
	url?: string;
}

export interface Affiliation {
	title?: string;
	projectBy?: ProjectByEntry[];
}

export interface ContactDocument extends Seo {
	_id: 'contact';
	title?: string;
	description?: string;
	partnership?: Partnership;
	affiliation?: Affiliation;
	contentBlocks?: ContactBlock[];
}

export type OpeningType = 'temporary' | 'permanent';

export interface Opening {
	_id: string;
	title?: string;
	department?: string;
	type?: OpeningType;
	location?: string;
	/** ISO date string (YYYY-MM-DD) from Sanity's `date` field. */
	deadline?: string;
	externalUrl?: string;
}

export interface CareersDocument extends Seo {
	_id: 'careers';
	openings?: Opening[];
}

export type EventType = 'conference' | 'workshop' | 'webinar' | 'talk' | 'meetup';

/** An employee reference or an inline guest speaker — both flatten to the same shape. */
export interface EventSpeaker {
	_key: string;
	name?: string;
	role?: string;
	image?: SanityImage;
}

export interface AidEvent {
	_id: string;
	title?: string;
	slug?: string;
	excerpt?: string;
	/** ISO datetime strings from Sanity's `datetime` fields. */
	startDate?: string;
	endDate?: string;
	eventType?: EventType;
	isOnline?: boolean;
	location?: {
		venue?: string;
		city?: string;
		country?: string;
	};
	image?: SanityImage;
	body?: PortableTextBlock[];
	registrationUrl?: string;
	speakers?: EventSpeaker[];
	partners?: PartnerBucketEntry[];
	featured?: boolean;
}

export interface EventsDocument extends Seo {
	_id: 'events';
	introduction?: string;
}
