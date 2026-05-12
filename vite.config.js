import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import yaml from 'js-yaml'

const yamlPlugin = () => ({
  name: 'yaml',
  transform(src, id) {
    if (!id.endsWith('.yaml') && !id.endsWith('.yml')) return;
    return {
      code: `export default ${JSON.stringify(yaml.load(src))}`,
      map: null,
    };
  },
});

export default defineConfig({
  base: './',
  plugins: [svelte(), yamlPlugin()],
})
