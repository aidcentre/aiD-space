import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	resolve: {
		alias: {
			'@studio': path.resolve(process.cwd(), '../studio')
		}
	},
	ssr: {
		noExternal: ['gsap', 'sanity', '@sanity/ui', '@sanity/icons']
	},
	build: {
		chunkSizeWarningLimit: 1000
	},
});
