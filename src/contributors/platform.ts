import type { Contributor, ContributorConfig } from '../types.ts';

const PlatformInfoContributor: Contributor<ContributorConfig> = () => {
  return Promise.resolve({
    arch: process.arch,
    platform: process.platform,
  });
};

export { PlatformInfoContributor };
