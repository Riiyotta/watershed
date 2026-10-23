// Loads project modules through Vite's SSR loader (handles JSON imports + JSX) without opening a port.
import { pathToFileURL } from 'url';
const root = process.argv[2] ?? process.cwd();
const { createServer } = await import(pathToFileURL(root + '/node_modules/vite/dist/node/index.js').href);
export async function open() {
  const server = await createServer({ root, configFile: root + '/vite.config.js', server: { middlewareMode: true, hmr: false, watch: null }, appType: 'custom', logLevel: 'error', optimizeDeps: { noDiscovery: true, include: [] } });
  return { server, load: (p) => server.ssrLoadModule(p) };
}
