import { describe, expect, it, vi } from 'vitest';

import { ContributorConfig, Json } from '../types';
import { NodeInfoContributor } from './node';

describe('NodeInfoContributor', () => {
  it('returns details about the node process', async () => {
    // Given
    vi.stubGlobal('process', { version: '1.0.0' });
    const config: ContributorConfig = {
      enabled: true,
    };

    // When
    const response: Promise<Json> = NodeInfoContributor(config);

    // Then
    await expect(response).resolves.toStrictEqual({
      version: '1.0.0',
    });
  });
});
