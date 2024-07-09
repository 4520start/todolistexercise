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
