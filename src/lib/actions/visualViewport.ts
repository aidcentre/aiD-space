/**
 * Publish the visual viewport as CSS custom properties on <html>.
 *
 * On mobile the layout viewport does not move when the soft keyboard opens, so
 * anything pinned to the bottom of the screen — the search bar, most obviously
 * — ends up underneath the keyboard. `window.visualViewport` does track it, so
 * mirror it into CSS and position against these instead of `100vh`:
 *
 *   --vv-offset-top      how far the visual viewport has scrolled down
 *   --vv-height          its current height
 *   --vv-keyboard-inset  how much of the layout viewport the keyboard covers
 *
 * Ported from the prototype's useVisualViewportCssVars hook.
 */

import { browser } from '$app/environment';

export function trackVisualViewport(): () => void {
	if (!browser) return () => {};

	const root = document.documentElement;
	const viewport = window.visualViewport;

	const update = () => {
		const height = viewport?.height ?? window.innerHeight;
		const offsetTop = viewport?.offsetTop ?? 0;
		const keyboardInset = Math.max(0, window.innerHeight - height - offsetTop);

		root.style.setProperty('--vv-height', `${height}px`);
		root.style.setProperty('--vv-offset-top', `${offsetTop}px`);
		root.style.setProperty('--vv-keyboard-inset', `${keyboardInset}px`);
	};

	update();

	viewport?.addEventListener('resize', update);
	viewport?.addEventListener('scroll', update);
	window.addEventListener('resize', update);

	return () => {
		viewport?.removeEventListener('resize', update);
		viewport?.removeEventListener('scroll', update);
		window.removeEventListener('resize', update);
	};
}
