import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { viteSingleFile } from 'vite-plugin-singlefile'
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
  plugins: [svelte(), yamlPlugin(), viteSingleFile()],
})
