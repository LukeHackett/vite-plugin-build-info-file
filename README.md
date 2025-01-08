<!-- Project Introduction -->
<div align="center">
  <a href="https://github.com/LukeHackett/vite-plugin-build-info-file">
    <img src="./.github/docs/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">vite-plugin-build-info-file</h3>

  <p align="center">
    A <a href="https://vite.dev">vite</a> plugin that generates build information and outputs it as a json file.
  </p>
  <p align="center">
    <a href="https://www.npmjs.com/package/vite-plugin-build-info-file">
      <img src="https://img.shields.io/npm/dt/vite-plugin-build-info-file?style=flat-square" alt="NPM" />
    </a>
    <img src="https://img.shields.io/github/stars/LukeHackett/vite-plugin-build-info-file?label=GitHub%20Stars&style=flat-square" alt="GitHub Repository Stars" />
    <a href="https://github.com/LukeHackett/vite-plugin-build-info-file/blob/main/LICENSE">
      <img src="https://img.shields.io/github/license/LukeHackett/vite-plugin-build-info-file?style=flat-square" alt="License" />
    </a>
    <img src="https://img.shields.io/github/last-commit/LukeHackett/vite-plugin-build-info-file?style=flat-square" alt="Last Commit" />
    <img src="https://img.shields.io/github/actions/workflow/status/LukeHackett/vite-plugin-build-info-file/build.yml?branch=main&style=flat-square" alt="Build Status" />
    <a href="https://github.com/LukeHackett/vite-plugin-build-info-file/issues">
      <img src="https://img.shields.io/github/issues/LukeHackett/vite-plugin-build-info-file?style=flat-square" alt="Issues" />
    </a>
  </p>
</div>

<!-- Core Features -->
## Features

- Generates a json file within the build folder for serving alongside the application.
- Supports `git`, `node`, `package.json` and `platform` contributors out of the box.
- Supports custom contributors for integrating with custom data sources.

<!-- Getting Started -->
## Installation

You can add it as a dev dependency via your package manager of choice, e.g. NPM, Yarn, PNPM.

```bash
npm install --save-dev vite-plugin-build-info-file
```

<!-- Usage -->
## Usage

```ts
// vite.config.js
import { defineConfig } from "vite";
import buildInfoFile from "vite-plugin-build-info-file";

export default defineConfig({
  plugins: [
    buildInfoFile({
      /* (optional) pass your config */
    })
  ]
})
```

The default configuration will result in an `info.json` file (see example below) being emitted within the `dist` folder of your project

```json
{
  "git": {
    "branch": "main",
    "commit": {
      "id": "647b8d6",
      "tags": [],
      "time": "1736356630"
    }
  },
  "node": {
    "version": "v20.18.1"
  },
  "package": {
    "name": "my-app",
    "version": "1.0.0"
  },
  "platform": {
    "arch": "arm64",
    "platform": "darwin"
  }
}
```

### Configuration

The following configuration options can be passed the `buildInfoFile` plugin function.

```ts
export type BuildInfoFilePluginConfig = {
  /**
   * The name of the file to be generated, defaults to 'info.json'.
   */
  filename?: string;

  /**
   * Key/Value pairs to be injected into the file info.json file.
   */
  info?: Json;

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
};
```

#### Custom Contributors

Besides the pre-defined contributors, it is possible to create custom contributors.

Each contributor should implement the `Contributor` type, which is a function that returns a `Promise<Json>` value.

An example implementation is shown below:

```ts
// vite.config.js
import { defineConfig } from "vite";
import buildInfoFile from "vite-plugin-build-info-file";

const helloWorldContributor: Contributor<ContributorConfig> = (config: ContributorConfig): Promise<Json> => {
  return Promise.resolve({ message: 'Hello World!' });
}

export default defineConfig({
  plugins: [
    buildInfoFile({
      contributors: {
        myContributor: helloWorldContributor
      }
    })
  ]
})
```

This will generate the following `info.json` file:

```json
{
  "myContributor": {
    "message": "Hello World"
  }
  // other contributors have been omitted
}
```

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

Please review the [Contributing Guidelines](./CONTRIBUTING.md) if you would like to make a contribution to this project.

## Issues

If you encounter any other bugs or need some other features feel free to open an [issue](https://github.com/LukeHackett/vite-plugin-build-info-file/issues).

## License

Distributed under the MIT License. See [LICENSE.md](./LICENSE) for more information.
