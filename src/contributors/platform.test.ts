import { describe, expect, it, vi } from 'vitest';

import { ContributorConfig, Json } from '../types';
import { PlatformInfoContributor } from './platform';

describe('PlatformInfoContributor', () => {
  it('returns details about the platform', async () => {
    // Given
    vi.stubGlobal('process', { arch: 'x64', platform: 'linux' });
    const config: ContributorConfig = {
      enabled: true,
    };

    // When
    const response: Promise<Json> = PlatformInfoContributor(config);

    // Then
    await expect(response).resolves.toStrictEqual({
      arch: 'x64',
      platform: 'linux',
    });
  });
});
