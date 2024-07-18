//これはサーバーサイドのコード

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { body, validationResult} from "express-validator";
import asycnHandler from "express-async-handler";

exports.todo_create_post = [
    //validate and sanitize fields
    body('title','title must not be empty').trim().isLength({ min: 1 }).escape(),
    body('due', 'due must not be empty').trim().isLength({ min: 1 }).escape(),
    body('date', 'date must not be empty').trim().isLength({ min: 1 }).escape(),
    body('priority', 'priority must not be empty').trim().isLength({ min: 1 }).escape(),

    asycnHandler(async(req,res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
      }
  
      const newData = {};
      newData.title = req.body.title;
      newData.due = req.body.due;
      newData.date = req.body.date;
      newData.priority = req.body.priority;
  
      try {
        const newtodo = await prisma.todo.create({
          data : newData
        });
        res.json(newtodo);
      } catch(error) {
        res.status(500).send(`Database error: ${error.message}`);
      }
    }),
  ];


exports.todo_list_get = [
  asycnHandler(async(res) => {
    try {
      const allTodos = await prisma.todo.findMany();
      res.json(allTodos);
    } catch(error) {
      res.status(500).send(`Database error: ${error.message}`);
    }
  }),
];
  

exports.todo_update_patch = [
  //validate and sanitize fields
  body('title').optional({checkFalsy: true}).trim().escape(),
  body('due').optional({checkFalsy: true}).trim().escape(),
  body('date').optional({checkFalsy: true}).trim().escape(),
  body('priority').optional({checkFalsy: true}).trim().escape(),

  asycnHandler(async(req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const updateData = {};
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.due) updateData.due = req.body.due;
    if (req.body.date) updateData.date = req.body.date;
    if (req.body.priority) updateData.priority = req.body.priority;

    try {
      const updatetodo = await prisma.todo.update({
        where : { id: parseInt(req.params.id) },
        data : updateData
      });
      res.json(updatetodo);
    } catch(error) {
      res.status(500).send(`Database error: ${error.message}`);
    }
  }),
];


exports.todo_delete = [
  asycnHandler(async(req,res) => {
    try {
      const newtodo = await prisma.todo.delete({
        where : { id: parseInt(req.params.id) },
      });
      res.json(newtodo);
    } catch(error) {
      res.status(500).send(`Database error: ${error.message}`);
    }
  }),
];








