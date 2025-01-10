import type { Plugin, PluginOption, ViteDevServer } from 'vite';
import { Rollup } from 'vite'; // eslint-disable-line import/named
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import * as Info from './info.ts';
import { buildInfoFile, buildInfoFilePlugin, serveInfoFilePlugin } from './plugin.ts';
import type { BuildInfoFilePluginConfig, Json } from './types.ts';

vi.mock('./info');

describe('plugin', () => {
  let pluginConfig: BuildInfoFilePluginConfig;

  beforeEach(() => {
    pluginConfig = {
      filename: 'my-info-file.json',
    };
  });

  describe('#serveInfoFilePlugin', () => {
    it('should return the plugin\'s assigned "apply" phase', () => {
      // When
      const plugin: Plugin = serveInfoFilePlugin(pluginConfig);

      // Then
      expect(plugin.apply).toStrictEqual('serve');
    });

    it('should return the name of the plugin', () => {
      // When
      const plugin: Plugin = serveInfoFilePlugin(pluginConfig);

      // Then
      expect(plugin.name).toStrictEqual('build-info-file');
    });

    it('should register a new route within the vite dev server', async () => {
      // Given
      const mockViteServer = mockDeep<ViteDevServer>();

      // When
      const plugin: Plugin = serveInfoFilePlugin();
      const configureServerFunction = plugin.configureServer as (server: ViteDevServer) => void;

      await configureServerFunction(mockViteServer);

      // Then
      expect(mockViteServer.middlewares.use).toHaveBeenCalledWith('/info.json', expect.any(Function));
    });
  });

  describe('#buildInfoFilePlugin', () => {
    it('should return the plugin\'s assigned "apply" phase', () => {
      // When
      const plugin: Plugin = buildInfoFilePlugin(pluginConfig);

      // Then
      expect(plugin.apply).toStrictEqual('build');
    });

    it('should return the name of the plugin', () => {
      // When
      const plugin: Plugin = buildInfoFilePlugin(pluginConfig);

      // Then
      expect(plugin.name).toStrictEqual('build-info-file');
    });

    it('should call create info with the default config', async () => {
      // Given
      const mockPluginContext = mockDeep<Rollup.PluginContext>();

      const createInfoSpy = vi.spyOn(Info, 'createInfo').mockResolvedValueOnce({ filename: 'test' } as Json);

      // When
      const plugin: Plugin = buildInfoFilePlugin();
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

    it('should emit file when error is undefined', async () => {
      // Given
      const mockPluginContext = mockDeep<Rollup.PluginContext>();

      vi.spyOn(Info, 'createInfo').mockResolvedValueOnce({
        environment: 'test',
        name: 'my-app',
        version: '1.0.0',
      } as Json);

      // When
      const plugin: Plugin = buildInfoFilePlugin(pluginConfig);
      const buildEndFunction = plugin.buildEnd as (this: Rollup.PluginContext, error?: Error) => void;
      await buildEndFunction.call(mockPluginContext);

      // Then
      expect(mockPluginContext.emitFile).toHaveBeenCalledOnce();
      expect(mockPluginContext.emitFile).toHaveBeenCalledWith({
        fileName: pluginConfig.filename,
        name: pluginConfig.filename,
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
      const mockPluginContext = mockDeep<Rollup.PluginContext>();
      const error: Error = new Error('generic error message');

      // When
      const plugin: Plugin = buildInfoFilePlugin(pluginConfig);
      const buildEndFunction = plugin.buildEnd as (this: Rollup.PluginContext, error?: Error) => void;
      await buildEndFunction.call(mockPluginContext, error);

      // Then
      expect(mockPluginContext.emitFile).not.toHaveBeenCalled();
    });
  });

  describe('#buildInfoFilePlugin', () => {
    it('should return two plugins', async () => {
      // When
      const plugin: PluginOption[] = buildInfoFile(pluginConfig) as PluginOption[];

      // Then
      expect(plugin.length).toBe(2);
      expect(plugin.at(0)).toStrictEqual({
        apply: 'serve',
        configureServer: expect.any(Function),
        name: 'build-info-file',
      });
      expect(plugin.at(1)).toStrictEqual({
        apply: 'build',
        buildEnd: expect.any(Function),
        name: 'build-info-file',
      });
    });
  });
});
