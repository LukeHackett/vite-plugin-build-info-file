export type Json = boolean | number | string | null | undefined | { [key: string]: Json } | Array<Json>;

export type ContributorConfig = {
  enabled: boolean;
};

export type GitContributorConfig = ContributorConfig & {
  commitId: 'SHORT' | 'LONG';
};

export type Contributor<T> = (config: T) => Promise<Json>;

export type BuildInfoFilePluginConfig = {
  contributors?:
    | {
        git?: GitContributorConfig;
        node?: ContributorConfig;
        package?: ContributorConfig;
        platform?: ContributorConfig;
      }
    | { [key: string]: Contributor<ContributorConfig> };
  filename?: string;
  info?: Json;
};
