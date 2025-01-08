export type Json = boolean | number | string | null | undefined | { [key: string]: Json } | Array<Json>;

export type ContributorConfig = {
  enabled: boolean;
};

export type GitContributorConfig = ContributorConfig & {
  commitId?: 'SHORT' | 'LONG';
};

export type Contributor<T> = (config: T) => Promise<Json>;

export type BuildInfoFilePluginConfig = {
  /**
   * Configuration for each contributor. By default all contributors are enabled.
   */
  contributors?:
    | {
        git?: GitContributorConfig;
        node?: ContributorConfig;
        package?: ContributorConfig;
        platform?: ContributorConfig;
      }
    | { [key: string]: Contributor<ContributorConfig> };

  /**
   * The name of the file to be generated, defaults to 'info.json'.
   */
  filename?: string;

  /**
   * Key/Value pairs to be injected into the file info.json file.
   */
  info?: Json;
};
