import * as core from '@actions/core';
import {deduplicate, pleaseSave} from './cache';
import {show_stats} from './show_stats';

const postRun = async () => {
  await show_stats();
  await deduplicate();
  await pleaseSave();
};

postRun().catch(err => {
  core.error(err);
  core.setFailed(err.message);
});
