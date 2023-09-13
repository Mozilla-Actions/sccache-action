import {saveCache, restoreCache} from '@actions/cache';
import * as core from '@actions/core';
import * as gh from '@actions/github';
import * as glob from '@actions/glob';
import fs from 'fs';
import * as crypto from 'crypto';

const key = `sccache-${process.platform}`;

const cargoLockHash = async (): Promise<string> => {
  // TODO: have an input for lockfile
  // let lockfile = core.getInput('glob-to-lock');
  const glob_match = await globFiles(`**/Cargo.lock`);
  // console.log(glob_match);
  const fileBuffer = await fs.promises.readFile(glob_match[0]);
  const hash = crypto.createHash('sha256');
  hash.update(fileBuffer);
  const hash_string = hash.digest('hex').slice(0, 5).trim();
  console.log(hash_string);
  return hash_string;
};

async function globFiles(pattern: string): Promise<string[]> {
  const globber = await glob.create(pattern, {
    followSymbolicLinks: false
  });
  // fs.statSync resolve the symbolic link and returns stat for the
  // file it pointed to, so isFile would make sure the resolved
  // file is actually a regular file.
  return (await globber.glob()).filter(file => fs.statSync(file).isFile());
}

const makeKey = async (): Promise<string> => {
  const hash = await cargoLockHash();
  return `${key}-${hash}`;
};

export const pleaseSave = async () => {
  const path = process.env.SCCACHE_CACHE_DIR;
  console.log(path);
  if (!path) {
    console.log(`no sccache dir found in SCCACHE_CACHE_DIR ${path}`);
    return;
  }
  await saveCache([path], await makeKey());
};

export const pleaseRestore = async () => {
  console.log('restore sccache files');
  const path = process.env.SCCACHE_CACHE_DIR;
  console.log(`restoring to: ${path}`);
  if (!path) {
    console.log(`no sccache dir found in SCCACHE_CACHE_DIR ${path}`);
    return;
  }

  const exact_restore = await makeKey();
  const alt_restore = [key];
  console.log(
    `searching for exact cache: ${exact_restore}, or alternate matching: ${key}`
  );

  // restores anything that matches `sccache` if the exact hash is not found
  await restoreCache([path], exact_restore, alt_restore)
    .then(r => {
      if (!r) {
        console.log(
          `no exising cache matching ${exact_restore} nor "${alt_restore}"`
        );
      } else {
        console.log(`restoring cache: ${r}`);
      }
    })
    .catch(e => console.log(`err: ${e}`));
};

export const deduplicate = async () => {
  console.log('trying to deduplicate cache');
  const token = core.getInput('token', {required: true});
  const octokit = gh.getOctokit(token);

  const res = await octokit.rest.actions
    .deleteActionsCacheByKey({
      owner: gh.context.repo.owner,
      repo: gh.context.repo.repo,
      key: await makeKey()
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
