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
  await prisma.todo.create({
    data: { title: request.body.title },
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
