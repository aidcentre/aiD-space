/// <reference lib="webworker" />
/**
 * Loads a sprite sheet and colour-matches its stills off the main thread
 * (~75 ms of decoding and sorting that would otherwise stall the hover).
 */
import { matchStills, readSheet } from './morphData';

self.onmessage = async (event: MessageEvent<{ id: number; url: string }>) => {
	const { id, url } = event.data;
	try {
		const stills = matchStills(await readSheet(url));
		self.postMessage(
			{ id, stills },
			{ transfer: stills.map((still) => still.buffer) }
		);
	} catch (error) {
		self.postMessage({ id, error: String(error) });
	}
};
