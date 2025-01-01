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
  plugins: [buildInfoFile()],
});
```

### Configuration

```ts
// WIP
```

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

Please review the [Contributing Guidelines](./CONTRIBUTING.md) if you would like to make a contribution to this project.

## Issues

If you encounter any other bugs or need some other features feel free to open an [issue](https://github.com/LukeHackett/vite-plugin-build-info-file/issues).

## License

Distributed under the MIT License. See [LICENSE.md](./LICENSE) for more information.
