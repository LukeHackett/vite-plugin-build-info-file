import * as http from 'node:http';

import * as vite from 'vite';

import { GitInfoContributor } from './contributors/git.ts';
import { NodeInfoContributor } from './contributors/node.ts';
import { NpmPackageInfoContributor } from './contributors/package.ts';
import { PlatformInfoContributor } from './contributors/platform.ts';
import type { BuildInfoFilePluginConfig, Contributor, Json } from './types.ts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CONTRIBUTOR_PROVIDERS: Record<string, Contributor<any>> = {
  git: GitInfoContributor,
  node: NodeInfoContributor,
  package: NpmPackageInfoContributor,
  platform: PlatformInfoContributor,
};

export const createInfo = async (config: BuildInfoFilePluginConfig): Promise<Json> => {
  const info: Json = {};
  for (const [contributor, value] of Object.entries(config.contributors || {})) {
    if (value instanceof Function) {
      info[contributor] = await value(config);
    } else if (CONTRIBUTOR_PROVIDERS[contributor] && value.enabled) {
      info[contributor] = await CONTRIBUTOR_PROVIDERS[contributor](value);
    }
  }

  if (config.info) {
    info['info'] = config.info;
  }

  return info;
};

export const serveInfo = (config: BuildInfoFilePluginConfig): vite.Connect.SimpleHandleFunction => {
  return async (_request: vite.Connect.IncomingMessage, response: http.ServerResponse) => {
    const infoFile: Json = await createInfo(config);
    const data = JSON.stringify(infoFile, undefined, 2);
    response
      .writeHead(200, {
        'Content-Length': Buffer.byteLength(data),
        'Content-Type': 'application/json',
      })
      .end(data);
  };
};
