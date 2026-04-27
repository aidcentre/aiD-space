import adapter from '@sveltejs/adapter-vercel';
import path from 'path';

export default {
  kit: {
    adapter: adapter(),
    version: {
      name: Date.now().toString()
    },
    alias: {
      '@studio': path.resolve('../studio')
    }
  },
};