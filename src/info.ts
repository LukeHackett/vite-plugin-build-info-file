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
