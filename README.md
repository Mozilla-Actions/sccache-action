# sccache-action

The [sccache](https://github.com/mozilla/sccache/
) action can be used in GitHub Actions workflows to integrate sccache into the build process. The sccache action is a step in a workflow that can be used to cache compilation results for subsequent builds, reducing the build time and speeding up the overall development process.


## Usage

Just copy and paste the following in your GitHub action:

### Specify a given version of sccache

```
- name: Run sccache-cache
  uses: mozilla-actions/sccache-action@v0.0.2
  with:
    version: "v0.4.0-pre.9"
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

## Prepare a new release

1. Update README.md in the examplee
1. Update version in `package.json`
1. Run `npm i --package-lock-only`
1. Tag a new release

## License

Apache-2.0 (just like sccache)
