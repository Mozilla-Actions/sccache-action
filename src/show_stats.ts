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
import {exec} from 'child_process';

async function show_stats() {
  core.debug('start sccache show starts');

  exec(
    `${process.env.SCCACHE_PATH} --show-stats`,
    (err: any, stdout: any, stderr: any) => {
      core.info(stdout);
      core.warning(stderr);

      if (err) {
        core.error('failed to show sccache stats');
        throw new Error(err);
      }
    }
  );
}

show_stats().catch(err => {
  core.error(err);
  core.setFailed(err.message);
});
