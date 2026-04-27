import adapter from '@sveltejs/adapter-netlify';
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