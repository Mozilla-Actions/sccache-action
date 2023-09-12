import * as core from '@actions/core';
import {deduplicate, pleaseSave} from './cache';
import {show_stats} from './show_stats';

const postRun = async () => {
  await show_stats();

  const is_local = core.getInput('local', {required: false});
  if (is_local == 'true') {
    await deduplicate();
    await pleaseSave();
  }
};

postRun().catch(err => {
  core.error(err);
  core.setFailed(err.message);
});
