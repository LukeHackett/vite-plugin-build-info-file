import type { Plugin } from 'vite';
import { Rollup } from 'vite'; // eslint-disable-line import/named
import { describe, expect, it, vi } from 'vitest';
import { mock } from 'vitest-mock-extended';

import * as Info from './info.ts';
import { buildInfoFile } from './plugin.ts';
import type { BuildInfoFilePluginConfig, Json } from './types.ts';

vi.mock('./info');

describe('#buildInfo', () => {
  it('should call create info with the default config', async () => {
    // Given
    const createInfoSpy = vi.spyOn(Info, 'createInfo').mockResolvedValueOnce({ filename: 'test' } as Json);

    const emptyPluginConfig: BuildInfoFilePluginConfig = {
      filename: 'my-info-file.json',
    };

    const mockPluginContext = mock<Rollup.PluginContext>();
    vi.mocked(mockPluginContext.emitFile).mockImplementationOnce(() => {
      return `/tmp/${emptyPluginConfig.filename}`;
    });

    // When
    const plugin: Plugin = buildInfoFile();
    const buildEndFunction = plugin.buildEnd as (this: Rollup.PluginContext, error?: Error) => void;

    await buildEndFunction.call(mockPluginContext);

    // Then
    expect(createInfoSpy).toHaveBeenCalledWith({
      contributors: {
        git: { commitId: 'SHORT', enabled: true },
        node: { enabled: true },
        package: { enabled: true },
        platform: { enabled: true },
      },
      filename: 'info.json',
    });
  });

  it('should return the name of the plugin', () => {
    // Given
    const emptyPluginConfig: BuildInfoFilePluginConfig = {};

    // When
    const plugin: Plugin = buildInfoFile(emptyPluginConfig);

    // Then
    expect(plugin.name).toStrictEqual('build-info-file');
  });

  it('should emit file when error is undefined', async () => {
    // Given
    const emptyPluginConfig: BuildInfoFilePluginConfig = {
      filename: 'my-info-file.json',
    };

    const mockPluginContext = mock<Rollup.PluginContext>();
    vi.mocked(mockPluginContext.emitFile).mockImplementationOnce(() => {
      return `/tmp/${emptyPluginConfig.filename}`;
    });

    vi.spyOn(Info, 'createInfo').mockResolvedValueOnce({
      environment: 'test',
      name: 'my-app',
      version: '1.0.0',
    } as Json);

    // When
    const plugin: Plugin = buildInfoFile(emptyPluginConfig);
    const buildEndFunction = plugin.buildEnd as (this: Rollup.PluginContext, error?: Error) => void;
    await buildEndFunction.call(mockPluginContext);

    // Then
    expect(mockPluginContext.emitFile).toHaveBeenCalledOnce();
    expect(mockPluginContext.emitFile).toHaveBeenCalledWith({
      fileName: emptyPluginConfig.filename,
      name: emptyPluginConfig.filename,
      source: JSON.stringify(
        {
          environment: 'test',
          name: 'my-app',
          version: '1.0.0',
        },
        undefined,
        2,
      ),
      type: 'asset',
    });
  });

  it('should not emit file when error is defined', async () => {
    // Given
    const emptyPluginConfig: BuildInfoFilePluginConfig = {
      filename: 'my-info-file.json',
    };
    const mockPluginContext = mock<Rollup.PluginContext>();
    const error: Error = new Error('generic error message');

    // When
    const plugin: Plugin = buildInfoFile(emptyPluginConfig);
    const buildEndFunction = plugin.buildEnd as (this: Rollup.PluginContext, error?: Error) => void;
    await buildEndFunction.call(mockPluginContext, error);

    // Then
    expect(mockPluginContext.emitFile).not.toHaveBeenCalled();
  });
});
