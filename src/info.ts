import { GitInfoContributor, NodeInfoContributor, NpmPackageInfoContributor, PlatformInfoContributor } from './contributors';
import { BuildInfoFilePluginConfig, Contributor, Json } from './types';

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

  return info;
};
