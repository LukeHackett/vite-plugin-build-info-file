import { Commit, getLastCommit } from 'git-last-commit';

import type { Contributor, GitContributorConfig } from '../types.ts';

const GitInfoContributor: Contributor<GitContributorConfig> = (config: GitContributorConfig) => {
  return new Promise((resolve, reject) => {
    getLastCommit((error: Error, commit: Commit) => {
      if (error) {
        reject(error);
      }

      const commitId = config.commitId || 'SHORT';

      resolve({
        branch: commit.branch,
        commit: {
          id: commitId === 'SHORT' ? commit.shortHash : commit.hash,
          tags: commit.tags,
          time: commit.committedOn,
        },
      });
    });
  });
};

export { GitInfoContributor };
