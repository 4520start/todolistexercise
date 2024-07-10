import fs from "node:fs";
import express from "express";
import { PrismaClient } from "@prisma/client";
import escapeHTML from "escape-html";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("static"));
const prisma = new PrismaClient();

const template = fs.readFileSync("./template.html", "utf-8");
app.get("/", async (request, response) => {
  const todos = await prisma.todo.findMany();
  const html = template.replace(
    "<!-- todos -->",
    todos
      .map(
        (todo) => `
          <li>
            <span>${escapeHTML(todo.title)}</span>
            <span>期限：${todo.due.toLocaleDateString('ja-JP',{year: 'numeric', month: '2-digit', day: '2-digit'})}</span>
            <span>作成日：${todo.date.toLocaleDateString('ja-JP',{year: 'numeric', month: '2-digit', day: '2-digit'})}</span>
            <form method="post" action="/delete" class="delete-form">
              <input type="hidden" name="id" value="${todo.id}" />
              <button type="submit">削除</button>
            </form>
          </li>
        `,
      )
      .join(""),
  );
  response.send(html);
});

app.post("/create", async (request, response) => {
  const date = new Date();
  let title = request.body.title;
  const dueDay = new Date(request.body.due);

  // 優先度に応じてタイトルを修正
  switch (request.body.priority) {
    case 'high':
      title = `<span style="color: red;">${escapeHTML(title)}</span>`;
      break;
    case 'medium':
      title = `<span style="color: orange;">${escapeHTML(title)}</span>`;
      break;
    case 'low':
      title = `<span style="color: green;">${escapeHTML(title)}</span>`;
      break;
    default:
      title = escapeHTML(title);
      break;
  }
  await prisma.todo.create({
    data: { title: title, due: dueDay, date: date, priority: request.body.priority },
  });
  response.redirect("/");
});

app.post("/delete", async (request, response) => {
  await prisma.todo.delete({
    where: { id: parseInt(request.body.id) },
  });
  response.redirect("/");
});

app.listen(3000);


/*

index.htmlの内容、commponentsがこれを返すように変更する。

<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <title>ToDoリスト</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <h1>ToDoリスト</h1>
    <ul>
      <!-- todos -->
    </ul>
    <form action="/create" method="post">
      <input type="text" name="title" />
      <label for="dueDate">期限</label>
      <input type="date" id="dueDate" name="due">
      <label for="priority">優先度</label>
      <select id="priority" name="priority">
        <option value="high">高</option>
        <option value="medium">中</option>
        <option value="low">低</option>
      </select>
      <button type="submit">追加</button>
    </form>
    <script src="/script.js"></script>
  </body>
</html>

*/


/*

script.jsとstyle.cssの内容。これも加えるように。

const deleteForms = document.querySelectorAll(".delete-form");

for (const deleteForm of deleteForms) {
  deleteForm.onsubmit = (e) => {
    if (!window.confirm("本当に削除しますか？")) {
      e.preventDefault();
    }
  };
}


.delete-form {
  display: inline;
}


*/