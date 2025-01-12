import * as http from 'node:http';

import * as vite from 'vite';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import { GitInfoContributor } from './contributors/git.ts';
import { NodeInfoContributor } from './contributors/node.ts';
import { NpmPackageInfoContributor } from './contributors/package.ts';
import { PlatformInfoContributor } from './contributors/platform.ts';
import { createInfo, serveInfo } from './info.ts';
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

describe('#serveInfo', () => {
  let request: vite.Connect.IncomingMessage;
  let response: http.ServerResponse;

  beforeEach(() => {
    request = mockDeep<vite.Connect.IncomingMessage>();
    response = mockDeep<http.ServerResponse>({
      writeHead: vi.fn().mockReturnThis(),
    });
  });

  it('should return an empty info when no contributors are provided', async () => {
    // Given
    const emptyPluginConfig: BuildInfoFilePluginConfig = {};

    // When
    const middlewareFunction: vite.Connect.SimpleHandleFunction = serveInfo(emptyPluginConfig);
    await middlewareFunction(request, response);

    // Then
    expect(response.writeHead).toBeCalledWith(200, {
      'Content-Length': 2,
      'Content-Type': 'application/json',
    });
    expect(response.end).toBeCalledWith('{}');
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
    const middlewareFunction: vite.Connect.SimpleHandleFunction = serveInfo(pluginConfig);
    await middlewareFunction(request, response);

    // Then
    expect(response.writeHead).toBeCalledWith(200, {
      'Content-Length': 172,
      'Content-Type': 'application/json',
    });
    expect(response.end).toBeCalledWith(
      JSON.stringify(
        {
          git: { commit: 'e3b0c44298fc1' },
          node: { version: 'v20' },
          package: { name: 'my-package' },
          platform: { name: 'linux' },
        },
        undefined,
        2,
      ),
    );
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
    const middlewareFunction: vite.Connect.SimpleHandleFunction = serveInfo(pluginConfig);
    await middlewareFunction(request, response);

    // Then
    expect(response.writeHead).toBeCalledWith(200, {
      'Content-Length': 93,
      'Content-Type': 'application/json',
    });
    expect(response.end).toBeCalledWith(
      JSON.stringify(
        {
          git: { commit: 'e3b0c44298fc1' },
          package: { name: 'my-package' },
        },
        undefined,
        2,
      ),
    );
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
    const middlewareFunction: vite.Connect.SimpleHandleFunction = serveInfo(pluginConfig);
    await middlewareFunction(request, response);

    // Then
    expect(response.writeHead).toBeCalledWith(200, {
      'Content-Length': 51,
      'Content-Type': 'application/json',
    });
    expect(response.end).toBeCalledWith(
      JSON.stringify(
        {
          myCustomContributor: { bar: 'baz' },
        },
        undefined,
        2,
      ),
    );
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
    const middlewareFunction: vite.Connect.SimpleHandleFunction = serveInfo(pluginConfig);
    await middlewareFunction(request, response);

    // Then
    expect(response.writeHead).toBeCalledWith(200, {
      'Content-Length': 54,
      'Content-Type': 'application/json',
    });
    expect(response.end).toBeCalledWith(
      JSON.stringify(
        {
          info: { foo: 'bar', version: 1 },
        },
        undefined,
        2,
      ),
    );
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
    const middlewareFunction: vite.Connect.SimpleHandleFunction = serveInfo(pluginConfig);
    await middlewareFunction(request, response);

    // Then
    expect(response.writeHead).toBeCalledWith(200, {
      'Content-Length': 51,
      'Content-Type': 'application/json',
    });
    expect(response.end).toBeCalledWith(
      JSON.stringify(
        {
          info: { message: 'static message' },
        },
        undefined,
        2,
      ),
    );
  });
});
