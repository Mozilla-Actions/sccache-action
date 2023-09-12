import {saveCache, restoreCache} from '@actions/cache';
import * as core from '@actions/core';
import * as gh from '@actions/github';

const key = 'sccache';
export const pleaseSave = async () => {
  const path = process.env.SCCACHE_CACHE_DIR;
  console.log(path);
  if (!path) {
    console.log(`no sccache dir found in SCCACHE_CACHE_DIR ${path}`);
    return;
  }
  await saveCache([path], key);
};

export const pleaseRestore = async () => {
  console.log('restore sccache files');
  const path = process.env.SCCACHE_CACHE_DIR;
  console.log(path);
  if (!path) {
    console.log(`no sccache dir found in SCCACHE_CACHE_DIR ${path}`);
    return;
  }
  await restoreCache([path], key).then(r => {
    if (!r) {
      console.log(`no cache matching "${path}" to restore`);
    }
  });
};

export const deduplicate = async () => {
  console.log('trying to deduplicate cache');
  const token = core.getInput('token', {required: true});
  const octokit = gh.getOctokit(token);

  const res = await octokit.rest.actions
    .deleteActionsCacheByKey({
      owner: gh.context.repo.owner,
      repo: gh.context.repo.repo,
      key
    })
    .then(() => {
      // TODO: more info
      return 'successfully deleted cache';
    })
    .catch(e => {
      console.log(`catch: ${e}`);
      return 'nothing to delete';
    });

  console.log(`delete cache api response: ${res}`);
};
