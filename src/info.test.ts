import { describe, expect, it, vi } from 'vitest';

import { GitInfoContributor } from './contributors/git.ts';
import { NodeInfoContributor } from './contributors/node.ts';
import { NpmPackageInfoContributor } from './contributors/package.ts';
import { PlatformInfoContributor } from './contributors/platform.ts';
import { createInfo } from './info.ts';
import type { BuildInfoFilePluginConfig } from './types.ts';

vi.mock('./contributors/git.ts');
vi.mock('./contributors/node.ts');
vi.mock('./contributors/package.ts');
vi.mock('./contributors/platform.ts');

describe('#createInfo', () => {
  it('should return an empty info when no contributors are provided', async () => {
    // Given
    const emptyPluginConfig: BuildInfoFilePluginConfig = {};

    // When
    const response = createInfo(emptyPluginConfig);

    // Then
    await expect(response).resolves.toStrictEqual({});
  });

  it('should return info with all default contributors enabled', async () => {
    // Given
    const pluginConfig: BuildInfoFilePluginConfig = {
      contributors: {
        git: { commitId: 'SHORT', enabled: true },
        node: { enabled: true },
        package: { enabled: true },
        platform: { enabled: true },
      },
      filename: 'info.json',
    };

    // Mocks
    vi.mocked(GitInfoContributor).mockResolvedValue({ commit: 'e3b0c44298fc1' });
    vi.mocked(NodeInfoContributor).mockResolvedValue({ version: 'v20' });
    vi.mocked(NpmPackageInfoContributor).mockResolvedValue({ name: 'my-package' });
    vi.mocked(PlatformInfoContributor).mockResolvedValue({ name: 'linux' });

    // When
    const response = createInfo(pluginConfig);

    // Then
    await expect(response).resolves.toStrictEqual({
      git: { commit: 'e3b0c44298fc1' },
      node: { version: 'v20' },
      package: { name: 'my-package' },
      platform: { name: 'linux' },
    });
    expect(await GitInfoContributor).toBeCalledWith(pluginConfig.contributors?.git);
    expect(await NpmPackageInfoContributor).toBeCalledWith(pluginConfig.contributors?.package);
    expect(await NodeInfoContributor).toBeCalled();
    expect(await PlatformInfoContributor).toBeCalled();
  });

  it('should return info with some default contributors enabled', async () => {
    // Given
    const pluginConfig: BuildInfoFilePluginConfig = {
      contributors: {
        git: { commitId: 'SHORT', enabled: true },
        node: { enabled: false },
        package: { enabled: true },
        platform: { enabled: false },
      },
      filename: 'info.json',
    };

    // Mocks
    vi.mocked(GitInfoContributor).mockResolvedValue({ commit: 'e3b0c44298fc1' });
    vi.mocked(NpmPackageInfoContributor).mockResolvedValue({ name: 'my-package' });

    // When
    const response = createInfo(pluginConfig);

    // Then
    await expect(response).resolves.toStrictEqual({
      git: { commit: 'e3b0c44298fc1' },
      package: { name: 'my-package' },
    });
    expect(await GitInfoContributor).toBeCalledWith(pluginConfig.contributors?.git);
    expect(await NpmPackageInfoContributor).toBeCalledWith(pluginConfig.contributors?.package);
    expect(await NodeInfoContributor).not.toBeCalled();
    expect(await PlatformInfoContributor).not.toBeCalled();
  });

  it('should return info with all default contributors disabled', async () => {
    // Given
    const customContributor = vi.fn();
    const pluginConfig: BuildInfoFilePluginConfig = {
      contributors: {
        git: { commitId: 'SHORT', enabled: false },
        myCustomContributor: customContributor,
        node: { enabled: false },
        package: { enabled: false },
        platform: { enabled: false },
      },
      filename: 'info.json',
    };

    // Mocks
    vi.mocked(customContributor).mockResolvedValue({ bar: 'baz' });

    // When
    const response = createInfo(pluginConfig);

    // Then
    await expect(response).resolves.toStrictEqual({
      myCustomContributor: { bar: 'baz' },
    });
    expect(await customContributor).toBeCalledWith(pluginConfig);
    expect(await GitInfoContributor).not.toBeCalled();
    expect(await NpmPackageInfoContributor).not.toBeCalled();
    expect(await NodeInfoContributor).not.toBeCalled();
    expect(await PlatformInfoContributor).not.toBeCalled();
  });

  it('should merge the provided static info when provided', async () => {
    // Given
    const pluginConfig: BuildInfoFilePluginConfig = {
      info: { foo: 'bar', version: 1 },
    };

    // When
    const response = createInfo(pluginConfig);

    // Then
    await expect(response).resolves.toStrictEqual({
      info: { foo: 'bar', version: 1 },
    });
  });

  it('should prioritise the provided static info over a custom contributor called "info"', async () => {
    // Given
    const pluginConfig: BuildInfoFilePluginConfig = {
      contributors: {
        info: vi.fn().mockResolvedValue(() => {
          return { message: 'generated message' };
        }),
      },
      info: { message: 'static message' },
    };

    // When
    const response = createInfo(pluginConfig);

    // Then
    await expect(response).resolves.toStrictEqual({
      info: { message: 'static message' },
    });
  });
});
