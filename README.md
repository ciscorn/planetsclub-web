# planetsclub-web

PLANETSアーカイブスのブラウザ側です。

## 概要

主に以下を使っています。

- Nuxt.js / Vue.js
- Buefy / Bulma
- Apollo (GraphQL)


## 開発

はじめに依存パッケージをインストールしてください。

```bash
$ yarn install
```

次のコマンドでローカルマシンでデバッグ実行できます。

```bash
$ ./run_dev.sh
```

APIサーバ (planetsclub-api) として実運用のサーバを使う場合は以下のようにします。

```bash
$ ./run_dev.sh remoteapi
```
