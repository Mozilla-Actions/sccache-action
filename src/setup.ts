// Copyright 2023 Mozilla Foundation
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as core from '@actions/core';
import {
  downloadTool,
  extractTar,
  extractZip,
  cacheDir
} from '@actions/tool-cache';

async function setup() {
  // TODO:  we can support install latest version by default if version
  // is not input.
  const version = core.getInput('version');
  core.debug(`try to setup sccache version: ${version}'`);

  const filename = getFilename(version);
  const dirname = getDirname(version);

  const downloadUrl = `https://github.com/mozilla/sccache/releases/download/${version}/${filename}`;
  core.debug(`sccache download from url: ${downloadUrl}`);

  // Download and extract.
  const sccachePackage = await downloadTool(downloadUrl);

  let sccachePath;
  if (getExtension() == 'zip') {
    sccachePath = await extractZip(sccachePackage);
  } else {
    sccachePath = await extractTar(sccachePackage);
  }
  core.debug(`sccache extracted to: ${sccachePath}`);

  // Cache sccache.
  const sccacheHome = await cacheDir(
    `${sccachePath}/${dirname}`,
    'sccache',
    version
  );
  core.debug(`sccache cached to: ${sccacheHome}`);

  // Add cached sccache into path.
  core.addPath(`${sccacheHome}`);
  // Expose the sccache path as env.
  core.exportVariable('SCCACHE_PATH', `${sccacheHome}/sccache`);

  // Expose the gha cache related variable to make users eaiser to
  // integrate with gha support.
  core.exportVariable('ACTIONS_CACHE_URL', process.env.ACTIONS_CACHE_URL || '');
  core.exportVariable(
    'ACTIONS_RUNTIME_TOKEN',
    process.env.ACTIONS_RUNTIME_TOKEN || ''
  );
}

function getFilename(version: string): Error | string {
  return `sccache-${version}-${getArch()}-${getPlatform()}.${getExtension()}`;
}

function getDirname(version: string): Error | string {
  return `sccache-${version}-${getArch()}-${getPlatform()}`;
}

function getArch(): Error | string {
  switch (process.arch) {
    case 'x64':
      return 'x86_64';
    case 'arm64':
      return 'aarch64';
    default:
      return Error('Unsupported arch "${process.arch}"');
  }
}

function getPlatform(): Error | string {
  switch (process.platform) {
    case 'darwin':
      return 'apple-darwin';
    case 'win32':
      return 'pc-windows-msvc';
    case 'linux':
      return 'unknown-linux-musl';
    default:
      return Error('Unsupported platform "${process.platform}"');
  }
}

function getExtension(): string {
  switch (process.platform) {
    case 'win32':
      return 'zip';
    default:
      return 'tar.gz';
  }
}

setup().catch(err => {
  core.error(err);
  core.setFailed(err.message);
});
