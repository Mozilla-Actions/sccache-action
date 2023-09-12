import * as core from '@actions/core';
import {pleaseSave} from './cache';
import {show_stats} from './show_stats';

const postRun = async () => {
  await pleaseSave()
    .then(r => {
      console.log(`cache ID: ${r}`);
    })
    .catch(e => {
      console.log(`ERROR: ${e}`);
    });

  show_stats();
};

postRun().catch(err => {
  core.error(err);
  core.setFailed(err.message);
});
