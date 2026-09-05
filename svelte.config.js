import adapter from 'svelte-adapter-azure-swa';
import path from 'path';

// Cache rules ported from _headers, which is Netlify-only — Azure SWA reads
// staticwebapp.config.json instead, which the adapter generates and merges this
// into. Kept in sync with _headers while both hosts are live.
const cacheRoutes = [
	// Researcher headshots are content-stable (filename changes when a photo
	// does), so let the CDN and browsers hold them for a year.
	['/images/researchers/*', 'public, max-age=31536000, immutable'],
	// Article abstracts change only when the corpus is regenerated, and the file
	// name is stable, so revalidate rather than cache forever.
	['/articles/*', 'public, max-age=3600, must-revalidate'],
	['/images/nodes/*', 'public, max-age=31536000, immutable']
].map(([route, cacheControl]) => ({
	route,
	headers: { 'Cache-Control': cacheControl }
}));

export default {
	kit: {
		adapter: adapter({
			customStaticWebAppConfig: {
				routes: cacheRoutes
			}
		}),
		version: {
			name: Date.now().toString()
		},
		alias: {
			'@studio': path.resolve('../studio')
		}
	}
};
