import { Commit, getLastCommit, GetLastCommitCallback } from 'git-last-commit';
import { describe, expect, it, vi } from 'vitest';

import type { GitContributorConfig, Json } from '../types.ts';
import { GitInfoContributor } from './git.ts';

vi.mock('git-last-commit');

describe('GitInfoContributor', () => {
  it('returns the last commit details using the SHORT format', async () => {
    // Given
    const config: GitContributorConfig = {
      commitId: 'SHORT',
      enabled: true,
    };

    vi.mocked(getLastCommit).mockImplementation((callback: GetLastCommitCallback) => {
      const commit: Commit = {
        author: {
          email: 'steven.smith@example.com',
          name: 'steven smith',
        },
        authoredOn: '1725806917',
        body: 'test commit',
        branch: 'main',
        committedOn: '1725806917',
        committer: {
          email: 'steven.smith@example.com',
          name: 'steven smith',
        },
        hash: '2a4dff17e123acf34acdc',
        sanitizedSubject: 'test commit',
        shortHash: '2a4dff1c',
        subject: 'test commit',
        tags: ['v1.0.0'],
      };
      callback(undefined!, commit);
    });

    // When
    const response: Promise<Json> = GitInfoContributor(config);

    // Then
    await expect(response).resolves.toStrictEqual({
      branch: 'main',
      commit: {
        id: '2a4dff1c',
        tags: ['v1.0.0'],
        time: '1725806917',
      },
    });
  });

  it('returns the last commit details using the LONG format', async () => {
    // Given
    const config: GitContributorConfig = {
      commitId: 'LONG',
      enabled: true,
    };

    vi.mocked(getLastCommit).mockImplementation((callback: GetLastCommitCallback) => {
      const commit: Commit = {
        author: {
          email: 'steven.smith@example.com',
          name: 'steven smith',
        },
        authoredOn: '1725806917',
        body: 'test commit',
        branch: 'main',
        committedOn: '1725806917',
        committer: {
          email: 'steven.smith@example.com',
          name: 'steven smith',
        },
        hash: '2a4dff17e123acf34acdc',
        sanitizedSubject: 'test commit',
        shortHash: '2a4dff1c',
        subject: 'test commit',
        tags: ['v1.0.0'],
      };
      callback(undefined!, commit);
    });

    // When
    const response: Promise<Json> = GitInfoContributor(config);

    // Then
    await expect(response).resolves.toStrictEqual({
      branch: 'main',
      commit: {
        id: '2a4dff17e123acf34acdc',
        tags: ['v1.0.0'],
        time: '1725806917',
      },
    });
  });

  it('raises an error when the "get-last-commit" module raises an error', async () => {
    // Given
    const config: GitContributorConfig = {
      commitId: 'SHORT',
      enabled: true,
    };

    vi.mocked(getLastCommit).mockImplementation((callback: GetLastCommitCallback) => {
      const error: Error = new Error('error trying to access last git commit');
      callback(error, undefined!);
    });

    // When
    const response: Promise<Json> = GitInfoContributor(config);

    // Then
    await expect(response).rejects.toThrowError('error trying to access last git commit');
  });
});
