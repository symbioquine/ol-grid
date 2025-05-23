# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2022-05-05

### Changed

- Updated OpenLayers to 10.4.0
- Ran `npm audit fix --force` to update other dependencies

## [1.1.7] - 2022-05-05

### Changed

- Updated OpenLayers to 6.14.1
- Ran `npm audit fix --force` to update other dependencies

## [1.1.6] - 2021-04-02

### Changed

- Use `npm ci` correctly in Github release jobs
- Run NPM release job as part of main Github release action to ensure it gets triggered correctly

## [1.1.5] - 2021-04-02

### Fixed

- Fix issue where grid doesn't get redrawn when `setActive` is toggled on/off and nothing else changed

### Changed

- `npm update`
- Bump build NodeJS version in npm-publish.yml to 13.x
- Add CHANGELOG.md and script to automatically create Github releases
- Bump ini from 1.3.5 to 1.3.8
- Bump y18n from 4.0.0 to 4.0.1

## [1.1.4] - 2020-08-30

### Changed

- Bump version to test publishing to NPM

## [1.1.2] - 2020-07-21

### Changed

- Bump lodash from 4.17.15 to 4.17.19

## [1.1.1] - 2020-07-05

### Fixed

- Fixes issue where grid doesn't get redrawn when it previously had no visible points

## [1.1] - 2020-07-04

### Changed

- Still ironing out Github/NPM release process

## [1.0] - 2020-07-04

### Changed

- Ironing out Github/NPM release process

[unreleased]: https://github.com/symbioquine/ol-grid/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/symbioquine/ol-grid/compare/v1.1.7...v2.0.0
[1.1.7]: https://github.com/symbioquine/ol-grid/compare/v1.1.6...v1.1.7
[1.1.6]: https://github.com/symbioquine/ol-grid/compare/v1.1.5...v1.1.6
[1.1.5]: https://github.com/symbioquine/ol-grid/compare/v1.1.4...v1.1.5
[1.1.4]: https://github.com/symbioquine/ol-grid/compare/v1.1.2...v1.1.4
[1.1.2]: https://github.com/symbioquine/ol-grid/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/symbioquine/ol-grid/compare/v1.1...v1.1.1
[1.1]: https://github.com/symbioquine/ol-grid/compare/v1.0...v1.1
[1.0]: https://github.com/symbioquine/ol-grid/releases/tag/v1.0
