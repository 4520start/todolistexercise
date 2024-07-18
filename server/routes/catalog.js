import express from 'express';
const router = express.Router();

import * as todo_controllers from '../controllers/todo';

router.patch('/todo/:id/update', todo_controllers.todo_update_patch);

router.delete('/todo/:id/delete', todo_controllers.todo_delete);

router.post('/todo/create', todo_controllers.todo_create_post);

router.get('/todos', todo_controllers.todo_list_get);

module.exports = router;