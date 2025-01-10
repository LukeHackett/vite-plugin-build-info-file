import { merge } from 'ts-deepmerge';
import type { Plugin, PluginOption, ViteDevServer } from 'vite';

import { createInfo } from './info.ts';
import type { BuildInfoFilePluginConfig, Json } from './types.ts';

const DEFAULT_PLUGIN_CONFIG: BuildInfoFilePluginConfig = {
  contributors: {
    git: { commitId: 'SHORT', enabled: true },
    node: { enabled: true },
    package: { enabled: true },
    platform: { enabled: true },
  },
  filename: 'info.json',
};

export function serveInfoFilePlugin(options: BuildInfoFilePluginConfig = DEFAULT_PLUGIN_CONFIG): Plugin {
  const config = merge(DEFAULT_PLUGIN_CONFIG, options);

  return {
    apply: 'serve',
    name: 'build-info-file',
    // eslint-disable-next-line sort-keys
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/info.json', async (_request, response) => {
        const infoFile: Json = await createInfo(config);
        const data = JSON.stringify(infoFile, undefined, 2);
        response
          .writeHead(200, {
            'Content-Length': Buffer.byteLength(data),
            'Content-Type': 'application/json',
          })
          .end(data);
      });
    },
  };
}

export function buildInfoFilePlugin(options: BuildInfoFilePluginConfig = DEFAULT_PLUGIN_CONFIG): Plugin {
  const config = merge(DEFAULT_PLUGIN_CONFIG, options);

  return {
    apply: 'build',
    name: 'build-info-file',
    // eslint-disable-next-line sort-keys
    async buildEnd(error?: Error) {
      if (!error) {
        const infoFile: Json = await createInfo(config);
        this.emitFile({
          fileName: config.filename,
          name: config.filename,
          source: JSON.stringify(infoFile, undefined, 2),
          type: 'asset',
        });
      }
    },
  };
}

export function buildInfoFile(options: BuildInfoFilePluginConfig = DEFAULT_PLUGIN_CONFIG): PluginOption {
  return [serveInfoFilePlugin(options), buildInfoFilePlugin(options)];
}
