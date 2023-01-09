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
  console.log('try to setup sccache version: ', version);

  const filename = getFilename(version);
  const dirname = getDirname(version);

  const downloadUrl = `https://github.com/mozilla/sccache/releases/download/${version}/${filename}`;
  console.log('sccache download from url: ', downloadUrl);

  // Download and extract.
  const sccachePackage = await downloadTool(downloadUrl);

  var sccachePath;
  if (getExtension() == 'zip') {
    sccachePath = await extractZip(sccachePackage);
  } else {
    sccachePath = await extractTar(sccachePackage);
  }
  console.log('sccache extracted to: ', sccachePath);

  // Cache sccache.
  const sccacheHome = await cacheDir(
    `${sccachePath}/${dirname}`,
    'sccache',
    version
  );
  console.log('sccache cached to: ', sccacheHome);

  // Add cached sccache into path.
  core.addPath(`${sccacheHome}`);
  // Expose the sccache path as env.
  core.exportVariable('SCCACHE_PATH', `${sccacheHome}/sccache`);
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
