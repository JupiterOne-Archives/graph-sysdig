# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Updated J1 SDK packages to v8
- Updated tests to use new SDK patterns
- Added rate limiting
- Updated `verifyAuthentication` to use another endpoint
- Added support for Image Scan entity from V2 API

- Added support for ingesting the following **new** entities:

| Resources | Entity `_type`   | Entity `_class` |
| --------- | ---------------- | --------------- |
| Finding   | `sysdig_finding` | `Finding`       |
| Scanner   | `sysdig_scanner` | `Service`       |

- Added support for ingesting the following **new** relationships:

| Source Entity `_type` | Relationship `_class` | Target Entity `_type` |
| --------------------- | --------------------- | --------------------- |
| `sysdig_image_scan`   | **IDENTIFIED**        | `sysdig_finding`      |
| `sysdig_scanner`      | **PERFORMED**         | `sysdig_image_scan`   |

- Added support for ingesting the following **new** mapped relationships:

| Source Entity `_type` | Relationship `_class` | Target Entity `_type` | Direction |
| --------------------- | --------------------- | --------------------- | --------- |
| `sysdig_finding`      | **IS**                | `*cve*`               | FORWARD   |

## 0.2.3 - 2022-08-31

### Changed

- Skipping duplicate `sysdig_image_scan` creation and adding informational
  gathering logs to understand duplicate images scans better.

## 0.2.2 - 2022-08-31

### Changed

- Temporarily disabled `verifyAuthentication` while the route used is serving
  503's

## 0.2.1 - 2022-08-30

### Fixed

- Added `analyzedAt` to the `_key` for `sysdig_image_scan` to ensure global
  uniqueness.

## 0.1.0 - 2021-12-14

### Added

- ### Added

- New properties added to resources:

  | Entity        | Properties |
  | ------------- | ---------- |
  | `sysdig_user` | `admin`    |
  | `sysdig_user` | `active`   |
  | `sysdig_user` | `webLink`  |
  | `sysdig_team` | `default`  |

- New managed questions

## 0.0.1 - 2021-11-29

### Added

- Added support for ingesting the following **new** entities:

| Resources | Entity `_type`   | Entity `_class` |
| --------- | ---------------- | --------------- |
| Account   | `sysdig_account` | `Account`       |
| Team      | `sysdig_team`    | `Team`          |
| User      | `sysdig_user`    | `User`          |

- Added support for ingesting the following **new** relationships:

| Source Entity `_type` | Relationship `_class` | Target Entity `_type` |
| --------------------- | --------------------- | --------------------- |
| `sysdig_account`      | **HAS**               | `sysdig_team`         |
| `sysdig_account`      | **HAS**               | `sysdig_user`         |
| `sysdig_team`         | **HAS**               | `sysdig_user`         |
