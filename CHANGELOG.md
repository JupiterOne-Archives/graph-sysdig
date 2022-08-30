# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
