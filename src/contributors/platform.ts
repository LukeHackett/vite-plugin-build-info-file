import type { Contributor, ContributorConfig } from '../types';

const PlatformInfoContributor: Contributor<ContributorConfig> = () => {
  return Promise.resolve({
    arch: process.arch,
    platform: process.platform,
  });
};

export { PlatformInfoContributor };
