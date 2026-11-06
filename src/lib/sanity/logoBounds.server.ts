import { PNG } from 'pngjs';

import type { ContentBounds, Partner, SanityImage } from './types';

/** Longest side of the raster that gets scanned — plenty of precision, still a tiny download. */
const SCAN_SIZE = 512;

/** How far from white (0–255) a pixel must look on the white tile to count as ink. */
const INK_THRESHOLD = 24;

// Asset ids are content hashes, so a measurement never goes stale: keep it for the life of the
// process. Failed measurements are evicted so the next request tries again.
const cache = new Map<string, Promise<ContentBounds | null>>();

/**
 * Find the box around an image's visible ink, ignoring transparent or white padding baked into
 * the file. Sanity rasterises the image (SVGs included) to a small PNG, which is scanned for
 * pixels that would stand out against a white background. An editor's crop, if set, limits the
 * scan to the cropped area.
 */
export function getContentBounds(image: SanityImage | undefined): Promise<ContentBounds | null> {
	const { asset, crop } = image ?? {};
	if (!asset?.url) return Promise.resolve(null);

	const key = `${asset._id ?? asset.url}${crop ? `:${crop.top},${crop.right},${crop.bottom},${crop.left}` : ''}`;

	let bounds = cache.get(key);
	if (!bounds) {
		bounds = measure(asset.url, crop).catch((error) => {
			cache.delete(key);
			console.warn(`Could not measure image bounds for ${asset.url}:`, error);
			return null;
		});
		cache.set(key, bounds);
	}
	return bounds;
}

/** Attach `logoBounds` to each partner so logo tiles can crop away padding inside the file. */
export function withLogoBounds<T extends Partner>(partners: T[]): Promise<T[]> {
	return Promise.all(
		partners.map(async (partner) => ({ ...partner, logoBounds: await getContentBounds(partner.logo) }))
	);
}

async function measure(url: string, crop: SanityImage['crop']): Promise<ContentBounds | null> {
	const res = await fetch(`${url}?fm=png&w=${SCAN_SIZE}&h=${SCAN_SIZE}&fit=max`, {
		signal: AbortSignal.timeout(5000)
	});
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	const { width, height, data } = PNG.sync.read(Buffer.from(await res.arrayBuffer()));

	const x0 = Math.floor((crop?.left ?? 0) * width);
	const y0 = Math.floor((crop?.top ?? 0) * height);
	const x1 = Math.ceil((1 - (crop?.right ?? 0)) * width);
	const y1 = Math.ceil((1 - (crop?.bottom ?? 0)) * height);

	// Ink extent, with right/bottom exclusive.
	let left = x1;
	let top = y1;
	let right = x0;
	let bottom = y0;
	for (let y = y0; y < y1; y++) {
		for (let x = x0; x < x1; x++) {
			const i = (y * width + x) * 4;
			// Composited onto white, the most a pixel can differ from white is in its darkest channel.
			const distanceFromWhite = ((255 - Math.min(data[i], data[i + 1], data[i + 2])) * data[i + 3]) / 255;
			if (distanceFromWhite > INK_THRESHOLD) {
				left = Math.min(left, x);
				right = Math.max(right, x + 1);
				top = Math.min(top, y);
				bottom = y + 1;
			}
		}
	}
	if (right <= left) return null;

	// One pixel of slack so faint anti-aliased edges aren't clipped.
	left = Math.max(x0, left - 1);
	top = Math.max(y0, top - 1);
	right = Math.min(x1, right + 1);
	bottom = Math.min(y1, bottom + 1);

	return {
		x: left / width,
		y: top / height,
		w: (right - left) / width,
		h: (bottom - top) / height
	};
}
