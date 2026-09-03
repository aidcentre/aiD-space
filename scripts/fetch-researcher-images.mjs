/**
 * Fetch, greyscale and crop researcher headshots into static/images/researchers/.
 *
 * Run manually, never at build time:
 *   node scripts/fetch-researcher-images.mjs            # fetch missing only
 *   node scripts/fetch-researcher-images.mjs --force    # re-fetch everyone
 *   node scripts/fetch-researcher-images.mjs --only olav-moyner
 *
 * `slug` values must match the `image` paths in src/lib/data/researchers.ts.
 * Entries with page: '' are skipped (no public photo). The script prints a
 * report; it does NOT edit researchers.ts — blank out `image` there by hand for
 * anyone who comes back empty.
 *
 * Needs `sharp` (devDependency) for the greyscale + square crop. Without it the
 * script still runs, writing source bytes unchanged, and the card's CSS
 * `grayscale` + `object-cover` keep them presentable.
 */

import { mkdir, writeFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'static', 'images', 'researchers');
const TARGET_PX = 256;
const UA = 'Mozilla/5.0 (compatible; aid-centre-image-fetch/1.0; +https://aid-centre.no)';

const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const ONLY = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;

let sharp = null;
try {
	sharp = (await import('sharp')).default;
} catch {
	console.warn('⚠  sharp not installed — writing source bytes without greyscale/crop\n');
}

/** slug → public profile page. Keep in sync with src/lib/data/researchers.ts. */
const SOURCES = [
	{ slug: 'ahmed-mohammed', page: 'https://www.sintef.no/alle-ansatte/ansatt/ahmed.mohammed/' },
	{ slug: 'akhil-s-anand', page: 'https://www.ntnu.no/ansatte/akhil.s.anand' },
	{ slug: 'antonios-danelakis', page: 'https://www.ntnu.edu/employees/antonida' },
	{ slug: 'christian-klockner', page: 'https://www.ntnu.no/ansatte/christian.klockner' },
	{
		slug: 'christian-andresen',
		page: 'https://www.sintef.no/alle-ansatte/ansatt/christian.andresen/'
	},
	{
		slug: 'esten-ingar-grotli',
		page: 'https://www.sintef.no/alle-ansatte/ansatt/esteningar.grotli/'
	},
	{ slug: 'helge-langseth', page: 'https://www.ntnu.no/ansatte/helge.langseth' },
	{ slug: 'henrik-andersson', page: 'https://www.ntnu.no/ansatte/henrik.andersson' },
	{ slug: 'ivan-depina', page: 'https://www.ntnu.edu/employees/ivan.depina' },
	{ slug: 'kamilla-johra', page: 'https://www.sintef.no/alle-ansatte/ansatt/kamilla.andersen/' },
	{ slug: 'jonathan-whitlock', page: 'https://www.ntnu.no/ansatte/jonathan.whitlock' },
	{
		slug: 'jo-wessel-strandhagen',
		page: 'https://www.sintef.no/alle-ansatte/ansatt/jo.strandhagen/'
	},
	{ slug: 'knut-andreas-lie', page: 'https://www.sintef.no/alle-ansatte/ansatt/knut-andreas.lie/' },
	{ slug: 'kristian-fossum', page: '' },
	{ slug: 'magnus-stalhane', page: 'https://www.ntnu.edu/employees/magnus.staalhane' },
	{
		slug: 'maria-vatshaug-ottermo',
		page: 'https://www.sintef.no/alle-ansatte/ansatt/maria.v.ottermo/'
	},
	{ slug: 'mark-haring', page: 'https://www.sintef.no/alle-ansatte/ansatt/mark.haring/' },
	{ slug: 'mary-ann-lundteigen', page: 'https://www.ntnu.no/ansatte/mary.a.lundteigen' },
	{ slug: 'olav-moyner', page: 'https://www.sintef.no/alle-ansatte/ansatt/olav.moyner/' },
	{ slug: 'patrick-mikalef', page: 'https://www.ntnu.no/ansatte/patrick.mikalef' },
	{ slug: 'per-oivind-braarud', page: 'https://ife.no/en/employee/per-oivind-braarud-2/' },
	{ slug: 'phu-nguyen', page: 'https://www.sintef.no/alle-ansatte/ansatt/phu.nguyen/' },
	{ slug: 'sabita-maharjan', page: 'https://www.mn.uio.no/ifi/english/people/aca/sabita/' },
	{ slug: 'sebastien-gros', page: 'https://www.ntnu.no/ansatte/sebastien.gros' },
	{
		slug: 'signe-riemer-sorensen',
		page: 'https://www.sintef.no/alle-ansatte/ansatt/signe.riemer-sorensen/'
	},
	{
		slug: 'simon-halvdansson',
		page: 'https://www.sintef.no/alle-ansatte/ansatt/simon.halvdansson/'
	},
	{ slug: 'stefan-werner', page: 'https://www.ntnu.edu/employees/stefan.werner' },
	{ slug: 'steffen-bakker', page: 'https://www.ntnu.no/ansatte/steffen.bakker' },
	{ slug: 'sven-vegard-buer', page: 'https://www.sintef.no/alle-ansatte/ansatt/sven-vegard.buer/' },
	{ slug: 'solve-eidnes', page: 'https://www.sintef.no/alle-ansatte/ansatt/solve.eidnes/' },
	{ slug: 'thor-myklebust', page: 'https://www.sintef.no/alle-ansatte/ansatt/thor.myklebust/' },
	{ slug: 'trond-kvamsdal', page: 'https://www.ntnu.no/ansatte/trond.kvamsdal' }
];

const exists = (p) =>
	access(p).then(
		() => true,
		() => false
	);

function extractImageUrl(pageUrl, html) {
	const host = new URL(pageUrl).host;
	let raw;

	if (host.includes('sintef.no')) {
		raw = html.match(/class="personalia__image"[^>]*\bsrc="([^"]+)"/i)?.[1];
	} else if (host.includes('ntnu.no') || host.includes('ntnu.edu')) {
		// The headshot always comes from this service; the surrounding markup
		// nests <div class="image-container"> between the label and the <img>.
		raw = html.match(
			/https:\/\/backends\.it\.ntnu\.no\/user-profile-service\/rest\/files\/[A-Za-z0-9-]+/i
		)?.[0];
	} else if (host.includes('norceresearch.no')) {
		raw = html.match(
			/class="[^"]*(?:person|profile)[^"]*image[^"]*"[^>]*>\s*<img[^>]*\bsrc="([^"]+)"/i
		)?.[1];
	}

	// Person pages on all these sites also set og:image / twitter:image.
	raw ||= html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1];
	raw ||= html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)?.[1];
	if (!raw) return null;

	const url = new URL(raw.replace(/&amp;/g, '&'), pageUrl);

	// SINTEF crops server-side — ask for a larger square than the 180px default.
	if (url.host.includes('sintef.no')) {
		url.searchParams.set('width', '512');
		url.searchParams.set('height', '512');
		url.searchParams.set('mode', 'crop');
		url.searchParams.set('scale', 'both');
	}
	return url.href;
}

async function processOne(entry) {
	const outPath = join(OUT_DIR, `${entry.slug}.jpg`);
	if (!entry.page) return { slug: entry.slug, status: 'skipped (no page)' };
	if (!FORCE && (await exists(outPath))) return { slug: entry.slug, status: 'cached' };

	const pageRes = await fetch(entry.page, { headers: { 'user-agent': UA }, redirect: 'follow' });
	if (!pageRes.ok) return { slug: entry.slug, status: `page HTTP ${pageRes.status}` };
	const html = await pageRes.text();

	const imgUrl = extractImageUrl(pageRes.url, html);
	if (!imgUrl) return { slug: entry.slug, status: 'no image found on page' };

	const imgRes = await fetch(imgUrl, { headers: { 'user-agent': UA, referer: entry.page } });
	if (!imgRes.ok) return { slug: entry.slug, status: `image HTTP ${imgRes.status}` };
	const ct = imgRes.headers.get('content-type') ?? '';
	if (!ct.startsWith('image/')) return { slug: entry.slug, status: `not an image (${ct})` };
	const buf = Buffer.from(await imgRes.arrayBuffer());

	let out = buf;
	if (sharp) {
		const img = sharp(buf).rotate(); // honour EXIF orientation
		const meta = await img.metadata();
		if ((meta.width ?? 0) < 120 || (meta.height ?? 0) < 120) {
			return { slug: entry.slug, status: `too small ${meta.width}x${meta.height} (likely a logo)` };
		}
		out = await img
			.grayscale()
			.resize(TARGET_PX, TARGET_PX, { fit: 'cover', position: 'attention' })
			.jpeg({ quality: 82, mozjpeg: true })
			.toBuffer();
	}

	await writeFile(outPath, out);
	return { slug: entry.slug, status: sharp ? 'ok' : 'ok (raw)', kb: Math.round(out.length / 1024) };
}

await mkdir(OUT_DIR, { recursive: true });
const targets = ONLY ? SOURCES.filter((s) => s.slug === ONLY) : SOURCES;

const results = [];
for (const entry of targets) {
	try {
		results.push(await processOne(entry));
	} catch (err) {
		results.push({ slug: entry.slug, status: `ERROR ${err.message}` });
	}
	await new Promise((r) => setTimeout(r, 400)); // be polite
}

console.table(results);
const ok = results.filter((r) => r.status.startsWith('ok') || r.status === 'cached');
const attention = results.filter(
	(r) => !r.status.startsWith('ok') && r.status !== 'cached' && r.status !== 'skipped (no page)'
);
console.log(`\n${ok.length}/${results.length} have photos.`);
if (attention.length) {
	console.log('Needs attention:', attention.map((m) => `${m.slug} (${m.status})`).join(', '));
}
