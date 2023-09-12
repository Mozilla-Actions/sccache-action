import {saveCache, restoreCache} from '@actions/cache';

const key = 'sccache';
export const pleaseSave = async () => {
  const path = process.env.SCCACHE_CACHE_DIR; // note: hard coded for now to: '/home/runner/.cache/sccache';
  if (!path) {
    console.log(`no sccache dir found in SCCACHE_CACHE_DIR ${path}`);
    return;
  }
  await saveCache([path], key);
};

export const pleaseRestore = async () => {
  const path = process.env.SCCACHE_CACHE_DIR;
  if (!path) {
    console.log(`no sccache dir found in SCCACHE_CACHE_DIR ${path}`);
    return;
  }
  await restoreCache([path], key);
};
