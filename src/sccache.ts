import * as core from '@actions/core';
import {downloadTool, extractTar, cacheDir} from '@actions/tool-cache';
import {exec} from 'child_process';
import * as fs from 'fs';
import {promisify} from 'util';

async function setup() {
  // TODO:  we can support install latest version by default if version
  // is not input.
  const version = core.getInput('version');
  console.log('try to setup for version: ', version);

  const downloadUrl = `https://github.com/mozilla/sccache/releases/download/${version}/${getFilename(
    version
  )}`;
  console.log('try to setup from url: ', downloadUrl);

  // Download and extract.
  const sccachePackage = await downloadTool(downloadUrl);
  const sccachePath = await extractTar(sccachePackage);

  // Cache sccache.
  const sccacheHome = await cacheDir(sccachePath, 'sccache', version);
  // Add cached sccache into path.
  core.addPath(`${sccacheHome}`);
  // Expose the sccache path as env.
  core.exportVariable('SCCACHE_PATH', `${sccacheHome}/sccache`);
}

function getFilename(version: string): Error | string {
  return `sccache-${version}-${getArch()}-${getPlatform()}.${getExtension()}`;
}

function getArch(): Error | string {
  switch (process.arch) {
    case 'x64':
      return 'x86_64';
    case 'arm64':
      return 'aarch64';
    default:
      return Error('not supported arch');
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
      return Error('not supported platform');
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
