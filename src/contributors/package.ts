import type { Contributor, ContributorConfig } from '../types.ts';

const NpmPackageInfoContributor: Contributor<ContributorConfig> = () => {
  return Promise.resolve({
    name: process.env['npm_package_name'],
    version: process.env['npm_package_version'],
  });
};

export { NpmPackageInfoContributor };
