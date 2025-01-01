<!-- Improved compatibility of back to top link -->
<a id="readme-top"></a>

<!-- Project Shields -->
[![npm](https://img.shields.io/npm/dt/vite-plugin-build-info-file?style=for-the-badge)](https://www.npmjs.com/package/vite-plugin-build-info-file)
[![GitHub Repo stars](https://img.shields.io/github/stars/LukeHackett/vite-plugin-build-info-file?label=GitHub%20Stars&style=for-the-badge)](https://github.com/LukeHackett/vite-plugin-build-info-file)
[![GitHub](https://img.shields.io/github/license/LukeHackett/vite-plugin-build-info-file?color=blue&style=for-the-badge)](https://github.com/LukeHackett/vite-plugin-build-info-file/blob/master/LICENSE)
![GitHub last commit](https://img.shields.io/github/last-commit/LukeHackett/vite-plugin-build-info-file?style=for-the-badge)
[![Issues](https://img.shields.io/github/issues/LukeHackett/vite-plugin-build-info-file?style=for-the-badge)](https://github.com/LukeHackett/vite-plugin-build-info-file/issues)

<!-- Project Introduction -->
<br />
<div align="center">
  <a href="https://github.com/LukeHackett/vite-plugin-build-info-file">
    <img src="./.github/docs/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">vite-plugin-build-info-file</h3>

  <p align="center">
    A <a href="https://vite.dev">vite</a> plugin that generates build information and outputs it as a json file.
    <br />
    <a href="https://github.com/LukeHackett/vite-plugin-build-info-file"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/LukeHackett/vite-plugin-build-info-file">View Demo</a>
    ·
    <a href="https://github.com/LukeHackett/vite-plugin-build-info-file/issues/new?labels=bug">Report Bug</a>
    ·
    <a href="https://github.com/LukeHackett/vite-plugin-build-info-file/issues/new?labels=enhancement">Request Feature</a>
  </p>
</div>


<!-- GETTING STARTED -->
## Getting Started


```bash
npm i --save-dev vite-plugin-build-info-file # yarn add -D vite-plugin-build-info-file
```

### Usage

```ts
// vite.config.js

import { defineConfig } from "vite";
import buildInfoFile from "vite-plugin-build-info-file";

export default defineConfig({
  plugins: [buildInfoFile()],
});
```

### Options

```ts
// WIP
```

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

Please review the [Contributing Guidelines](./CONTRIBUTING.md) if you would like to make a contribution to this project.

## Issues

If you encounter any other bugs or need some other features feel free to open an [issue](https://github.com/LukeHackett/vite-plugin-build-info-file/issues).
