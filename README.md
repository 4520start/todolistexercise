# ToDoList

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

## 開発用メモ
.envにこれを書き込む  
DATABASE_URL="postgresql://postgres.nqwiipawncayugdpeuil:SRP6940rh6wvUqQV@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"  

## やりたいこと

-並べ替え（UI設置、request処理、responseをUIに反映する）
-写真アップロード
-編集機能

CSS
-全体的にUI変える

各種項目追加
-期限
-優先度　色つき
-追加した時間





