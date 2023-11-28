# sccache-action

The [sccache](https://github.com/mozilla/sccache/
) action can be used in GitHub Actions workflows to integrate sccache into the build process. The sccache action is a step in a workflow that can be used to cache compilation results for subsequent builds, reducing the build time and speeding up the overall development process.

sccache can easily use GitHub actions cache with almost no configuration.

This action is available on:
https://github.com/marketplace/actions/sccache-action

## Usage

Just copy and paste the following in your GitHub action:

### Use the latest version of sccache if no version is specified

```
- name: Run sccache-cache
  uses: mozilla-actions/sccache-action@v0.0.3
```

### Conditionally run cache and enable it

```
- name: Run sccache-cache only on non-release runs
  if: github.event_name != 'release' && github.event_name != 'workflow_dispatch'
  uses: mozilla-actions/sccache-action@v0.0.3
- name: Set Rust caching env vars only on non-release runs
  if: github.event_name != 'release' && github.event_name != 'workflow_dispatch'
  run: |
    echo "SCCACHE_GHA_ENABLED=true" >> $GITHUB_ENV
    echo "RUSTC_WRAPPER=sccache" >> $GITHUB_ENV
```

### Specify a given version of sccache

```
- name: Run sccache-cache
  uses: mozilla-actions/sccache-action@v0.0.3
  with:
    version: "v0.7.4"
```

### To get the execution stats

Note that using the previous declaration will automatically create a
`Post Run sccache-cache` task.

```
- name: Run sccache stat for check
  shell: bash
  run: ${SCCACHE_PATH} --show-stats
```

### Rust code

For Rust code, the following environment variables should be set:

```
    env:
      SCCACHE_GHA_ENABLED: "true"
      RUSTC_WRAPPER: "sccache"
```

### C/C++ code

For C/C++ code, the following environment variables should be set:

```
    env:
      SCCACHE_GHA_ENABLED: "true"
```

With cmake, add the following argument:

```
-DCMAKE_C_COMPILER_LAUNCHER=sccache
-DCMAKE_CXX_COMPILER_LAUNCHER=sccache
```

With configure, call it with:
```
# With gcc
./configure CC="sccache gcc" CXX=sccache gcc"
# With clang
./configure CC="sccache clang" CXX=sccache clang"
```

## Prepare a new release

1. Update the example in README.md
1. Update version in `package.json`
1. Run `npm i --package-lock-only`
1. Tag a new release

## License

Apache-2.0 (just like sccache)
