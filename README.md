# sccache-action

The [sccache](https://github.com/mozilla/sccache/
) action can be used in GitHub Actions workflows to integrate sccache into the build process. The sccache action is a step in a workflow that can be used to cache compilation results for subsequent builds, reducing the build time and speeding up the overall development process.


## Usage

Just copy and paste the following in your GitHub action:

```
# Using the latest version of sccache
- name: Run sccache-cache
  uses: mozilla-actions/sccache-action@v0.0.1
```

```
# Specify a given version of sccache
- name: Run sccache-cache
  uses: mozilla-actions/sccache-action@v0.0.1
  with:
    version: "v0.3.3"
```

```
# To get the execution stats
- name: Run sccache stat for check
  shell: bash
  run: ${SCCACHE_PATH} --show-stats
```

## License

Apache-2.0 (just like sccache)
