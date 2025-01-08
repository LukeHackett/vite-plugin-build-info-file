import { describe, expect, it, vi } from 'vitest';

import type { ContributorConfig, Json } from '../types.ts';
import { NpmPackageInfoContributor } from './package.ts';

describe('NpmPackageInfoContributor', () => {
  it('returns details about the project package.json', async () => {
    // Given
    vi.stubEnv('npm_package_name', 'my-package');
    vi.stubEnv('npm_package_version', '1.0.0-unit-test');
    const config: ContributorConfig = {
      enabled: true,
    };

    // When
    const response: Promise<Json> = NpmPackageInfoContributor(config);

    // Then
    await expect(response).resolves.toStrictEqual({
      name: 'my-package',
      version: '1.0.0-unit-test',
    });
  });
});
