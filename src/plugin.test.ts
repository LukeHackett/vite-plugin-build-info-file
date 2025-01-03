import type { Plugin } from 'vite';
import { Rollup } from 'vite'; // eslint-disable-line import/named
import { describe, expect, it, vi } from 'vitest';
import { mock } from 'vitest-mock-extended';

import { buildInfoFile } from './plugin';
import { BuildInfoFilePluginConfig } from './types';

describe('buildInfoFile plugin', () => {
  it('should return the name of the plugin', () => {
    // Given
    const emptyPluginConfig: BuildInfoFilePluginConfig = {};

    // When
    const plugin: Plugin = buildInfoFile(emptyPluginConfig);

    // Then
    expect(plugin.name).toStrictEqual('build-info-file');
  });

  it('should print an unimplemented warning message log', async () => {
    // Given
    const emptyPluginConfig: BuildInfoFilePluginConfig = {};

    // Mocks
    const mockPluginContext = mock<Rollup.PluginContext>();
    const consoleWarnSpy = vi.spyOn(console, 'warn');

    // When
    const plugin: Plugin = buildInfoFile(emptyPluginConfig);
    const buildEndFunction = plugin.buildEnd as (this: Rollup.PluginContext, error?: Error) => void;
    await buildEndFunction.call(mockPluginContext);

    // Then
    expect(consoleWarnSpy).toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalledWith("'build-info-file' has not been implemented. Provided config:", emptyPluginConfig);
  });
});
