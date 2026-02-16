# Badge de cobertura externo

## Codecov

1. Crie conta em <https://codecov.io/>
2. Adicione o projeto (GitHub)
3. No workflow CI/CD, adicione:

```yaml
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    token: ${{ secrets.CODECOV_TOKEN }}
    files: coverage/lcov.info
```bash

1. Gere badge:

```bash
![Codecov](https://codecov.io/gh/<usuario>/<repo>/branch/master/graph/badge.svg)
```sh

## Coveralls

1. Crie conta em <https://coveralls.io/>
2. Adicione o projeto (GitHub)
3. No workflow CI/CD, adicione:

```yaml
- name: Upload coverage to Coveralls
  uses: coverallsapp/github-action@v2
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    path-to-lcov: coverage/lcov.info
```

1. Gere badge:

```
![Coveralls](https://coveralls.io/repos/github/<usuario>/<repo>/badge.svg?branch=master)
```
