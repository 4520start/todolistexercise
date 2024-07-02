# 単語帳アプリ

単語帳アプリのテンプレートです。

## 環境構築

1. `npm install` を実行する
2. `/.env.sample` を `/.env` にコピーする
3. データベースを作成する。
4. データベースの接続情報を `.env` に入れる
5. `npx prisma db push` を実行する

## 開発用サーバーの起動

1. `node main.mjs` で実行する
2. `http://localhost:3000/` を開く
