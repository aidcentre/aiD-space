/**
 * GROQ query fragments and full queries aligned with `studio/schemaTypes`.
 * Singleton document ids match `studio/structure/index.ts` (home, contact, settings).
 */

/** Image fields with resolved asset URL (single source for projections). */
const image = /* groq */ `
	...,
	asset->{
		_id,
		_type,
		url,
		metadata {
			dimensions { width, height, aspectRatio },
			lqip
		}
	}
`;

const employeeDoc = /* groq */ `
	_id,
	name,
	role,
	"image": image {
		${image}
	},
	affiliationGroup {
		label,
		url
	}
`;

const partnerDoc = /* groq */ `
	_id,
	name,
	"logo": logo {
		${image}
	}
`;

const partnerBucketDoc = /* groq */ `
	_id,
	name,
	"logo": logo {
		${image}
	}
`;

const openingDoc = /* groq */ `
	_id,
	title,
	department,
	type,
	location,
	deadline,
	externalUrl
`;

const seo = /* groq */ `
	seoTitle,
	seoDescription,
	seoKeywords,
	"seoImage": seoImage {
		${image}
	}
`;

/** Page `contentBlocks`: singlecard, milestones, keynumbers, list, invertedList */
const pageContentBlocks = /* groq */ `
	contentBlocks[] {
		_key,
		_type,
		_type == "singlecard" => {
			title,
			text,
			"image": image {
				${image}
			}
		},
		_type == "milestones" => {
			title,
			text,
			milestones
		},
		_type == "keynumbers" => {
			title,
			text,
			keynumbers[] {
				_key,
				number,
				text
			}
		},
		_type == "list" => {
			title,
			headline,
			list[] {
				_key,
				title,
				text
			}
		},
		_type == "invertedList" => {
			headline,
			list[] {
				_key,
				title,
				text
			}
		}
	}
`;

/**
 * Contact `contentBlocks`: employees, partners.
 *
 * References are filtered (`defined(@->_id)`) so unpublished or deleted
 * documents don't surface as `null` entries in the array.
 */
const contactContentBlocks = /* groq */ `
	contentBlocks[] {
		_key,
		_type,
		_type == "employees" => {
			title,
			"employees": employees[defined(@->_id)]->{
				${employeeDoc}
			}
		},
		_type == "partners" => {
			title,
			"partners": partners[defined(@->_id)]->{
				_type,
				${partnerDoc}
			}
		}
	}
`;

const navigationRef = /* groq */ `
	navigation[defined(@->_id)]->{
		_id,
		_type,
		_type == "home" => {
			"title": "Home",
			"url": "/"
		},
		_type == "contact" => {
			"title": coalesce(title, "Contact"),
			"url": "/contact"
		},
		_type == "page" => {
			title,
			"url": "/" + slug.current
		},
		_type == "careers" => {
			"title": "Careers",
			"url": "/careers"
		},
		_type == "events" => {
			"title": "Events",
			"url": "/events"
		}
	}
`;

/** Singleton: `_id == "home"` */
export const homeQuery = /* groq */ `
	*[_id == "home"][0]{
		_id,
		description,
		externalUrl,
		${seo}
	}
`;

/** Singleton: `_id == "settings"` */
export const settingsQuery = /* groq */ `
	*[_id == "settings"][0]{
		_id,
		description,
		contactInformation {
			email,
			phone
		},
		externalUrl {
			label,
			url
		},
		"favicon": favicon {
			${image}
		},
		${navigationRef},
		${seo}
	}
`;

/** Singleton: `_id == "contact"` */
export const contactPageQuery = /* groq */ `
	*[_id == "contact"][0]{
		_id,
		title,
		description,
		partnership {
			title,
			label,
			url
		},
		affiliation {
			title,
			projectBy[] {
				_key,
				label,
				"logo": logo {
					${image}
				}
			}
		},
		${contactContentBlocks},
		${seo}
	}
`;

/** All generic pages that have a slug set. */
export const allPagesQuery = /* groq */ `
	*[_type == "page" && defined(slug.current)] | order(title asc) {
		_id,
		title,
		"slug": slug.current,
		introduction,
		${pageContentBlocks},
		${seo}
	}
`;

/** Single page by slug (e.g. from a route param). */
export const pageBySlugQuery = /* groq */ `
	*[_type == "page" && slug.current == $slug][0]{
		_id,
		title,
		"slug": slug.current,
		introduction,
		${pageContentBlocks},
		${seo}
	}
`;

/** All employees (management / listings). */
export const allEmployeesQuery = /* groq */ `
	*[_type == "employee"] | order(name asc) {
		${employeeDoc}
	}
`;

/** Standalone partner documents (`partner` type). */
export const allPartnersQuery = /* groq */ `
	*[_type == "partner"] | order(name asc) {
		${partnerDoc}
	}
`;

/** Partner bucket documents: `core`, `standard`, `networking`. */
export const partnerBucketsByTypeQuery = /* groq */ `
	*[_type == $bucketType] | order(name asc) {
		_type,
		${partnerBucketDoc}
	}
`;

export const allCorePartnersQuery = /* groq */ `
	*[_type == "core"] | order(name asc) {
		_type,
		${partnerBucketDoc}
	}
`;

export const allStandardPartnersQuery = /* groq */ `
	*[_type == "standard"] | order(name asc) {
		_type,
		${partnerBucketDoc}
	}
`;

export const allNetworkingPartnersQuery = /* groq */ `
	*[_type == "networking"] | order(name asc) {
		_type,
		${partnerBucketDoc}
	}
`;

/**
 * Singleton: `_id == "careers"`.
 *
 * Openings are resolved via their reference and filtered so unpublished or
 * deleted documents don't surface as `null` entries. They're returned in the
 * author-defined order from the studio.
 */
export const careersPageQuery = /* groq */ `
	*[_id == "careers"][0]{
		_id,
		"openings": openings[defined(@->_id)]->{
			${openingDoc}
		},
		${seo}
	}
`;

/** All opening documents ordered by soonest deadline first. */
export const allOpeningsQuery = /* groq */ `
	*[_type == "opening"] | order(deadline asc) {
		${openingDoc}
	}
`;

const eventDoc = /* groq */ `
	_id,
	title,
	"slug": slug.current,
	excerpt,
	startDate,
	endDate,
	eventType,
	isOnline,
	location {
		venue,
		city,
		country
	},
	"image": image {
		${image}
	},
	registrationUrl,
	featured
`;

/** Singleton: `_id == "events"` (intro + SEO for the /events page). */
export const eventsPageQuery = /* groq */ `
	*[_id == "events"][0]{
		_id,
		introduction,
		${seo}
	}
`;

/** Events whose end (or start, if no end) hasn't passed yet, soonest first. */
export const upcomingEventsQuery = /* groq */ `
	*[_type == "event" && defined(slug.current) && coalesce(endDate, startDate) >= now()]
		| order(startDate asc) {
		${eventDoc}
	}
`;

/** Events that have already ended, most recent first. */
export const pastEventsQuery = /* groq */ `
	*[_type == "event" && defined(slug.current) && coalesce(endDate, startDate) < now()]
		| order(startDate desc) {
		${eventDoc}
	}
`;

/** All events, soonest first. */
export const allEventsQuery = /* groq */ `
	*[_type == "event" && defined(slug.current)]
		| order(startDate asc) {
		${eventDoc}
	}
`;

/** Single event by slug, with full body and resolved speakers/partners. */
export const eventBySlugQuery = /* groq */ `
	*[_type == "event" && slug.current == $slug][0]{
		${eventDoc},
		body,
		"speakers": speakers[_type == "guestSpeaker" || defined(@->_id)]{
			_key,
			_type == "reference" => @->{
				name,
				role,
				"image": image {
					${image}
				}
			},
			_type == "guestSpeaker" => {
				name,
				role,
				"image": image {
					${image}
				}
			}
		},
		"partners": partners[defined(@->_id)]->{
			_type,
			${partnerDoc}
		}
	}
`;
