import type { Plugin } from 'vite';

import type { BuildInfoFilePluginConfig } from './types';

const defaultBuildInfoFilePluginConfig: BuildInfoFilePluginConfig = {
  contributors: {
    git: { commitId: 'SHORT', enabled: true },
    node: { enabled: false },
    package: { enabled: true },
    platform: { enabled: false },
  },
  filename: 'info.json',
};

function buildInfoFile(config: BuildInfoFilePluginConfig = defaultBuildInfoFilePluginConfig): Plugin {
  return {
    name: 'build-info-file',
    // eslint-disable-next-line sort-keys
    async buildEnd() {
      console.warn("'build-info-file' has not been implemented. Provided config:", config);
    },
  };
}

export { buildInfoFile };
