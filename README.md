# sccache-action

Work in progress

The goal of this project is to provide a simple GitHub action to download
sccache artifacts.



## Usage

Just copy and paste the following in your GitHub action:

```
- name: Run sccache-cache
  uses: mozilla/sccache-action@v0.0.1
  with:
    version: "v0.3.3"

- name: Run sccache stat for check
  shell: bash
  run: ${SCCACHE_PATH} --show-stats
```

## License

Apache-2.0 (just like sccache)
