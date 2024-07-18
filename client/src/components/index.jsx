import useState, { useEffect } from 'react';
import { Autocomplete, Box, Button, Container, DialogActions, DialogContent, DialogContentText, DialogTitle, FormGroup, TextField } from "@mui/material";
import { useDrag, useDrop } from "react-dnd";
import { updateTodo } from "../common/api/todo";
import { updateTodo, deleteTodo, getTodoList, createTodo } from '../common/api/todo';

const TodoComponent = () => {
  const [todoList, setTodoList] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [originalTodo, setOriginalTodo] = useState(null);
  const [changedFields, setChangedFields] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteAlertDialogOpen, setIsDeleteAlertDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTodo, setNewTodo] = useState({});

  const [{isDragging}, dragRef] = useDrag(() => ({
    type: 'TODO_ITEM',
    item: {id: todo.id},
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [, dropRef] = useDrop({
    accept: 'TODO_ITEM',
    drop: (item,monitor) => {
      if (!monitor.didDrop()) {
        onDrop(item.id, todo.id);
      }
    }
  });

  useEffect(() => {
    getTodoList().then(todos => {
      setTodoList(todos);
    })
    .catch(error => {
      console.log('error handling',error);
    });
  }, []);

  const handleAutocompleteChange = (value) => {
    setSelectedTodo(value);
    setOriginalTodo(value);
    setChangedFields({});
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedTodo(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
    if (originalTodo[name] !== value) {
      setChangedFields(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setChangedFields(prev => {
        const newState = { ...prev };
        delete newState[name];
        return newState;
      });
    }
  };


  const handleDialogClose = () => {
    if (isDialogOpen === true) {
      setIsDialogOpen(false);
    } else if (isCreateDialogOpen === true) {
      setOriginalTodo(null);
      setIsCreateDialogOpen(false);
    }
    setSelectedTodo(null);
  };

  const handleCreateDialog = () => {
    const emptytodo = {};
    setNewTodo(emptytodo);
    setSelectedTodo(emptytodo);
    setOriginalTodo(emptytodo);
    const emptyfield = {};
    setChangedFields(emptyfield);
    setIsCreateDialogOpen(true);
  };


  const handleDialogSave = () => {
    updateTodo({...changedFields, id: selectedTodo.id});
    const list = todoList.map(todo => {
      if (selectedTodo.id === todo.id) {
        return { ...todo, ...changedFields };
      }
      return todo;
    });
    setTodoList(list);
    setChangedFields({});
    handleDialogClose();
  };

    
  handleCreateSave = () => {
    createTodo({changedFields})
    .then(createdtodo => {
      setTodoList(prevtodos => [...prevtodos, createdtodo]);
      setChangedFields({});
      handleDialogClose();
    })
    .catch(error =>{
      console.log('error handling', error);
    });
  };


  const handleDelete = () => {
    deleteTodo(selectedTodo.id);
    const list = todoList.filter(todo => todo.id !== selectedTodo.id);
    setTodoList(list);
    setIsDeleteAlertDialogOpen(false);
  };

  return (
    <div>
      <Container maxWidth='xs'>
        <Box display={"flex"} justifyContent={'space-between'} mb={4} mt={4}>
          <Button variant="contained" color="primary" onClick={() => setIsDialogOpen(true)}>Edit</Button> 
          <Button variant="contained" color="primary" onClick={handleCreateDialog}>Create</Button> 
        </Box>
        <FormGroup>
          {todoList.map((todo) => (
            <Box key={todo.id} display='flex' justifyContent='space-between' alignItems='center' mb={10}>
              <Box ref={node => dragRef(dropRef(node))} style={{opacity}} flexGrow={1} mr={2}>
                <span>{todo.title}</span>
                <span>期限：{todo.due.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
                <span>作成日：{todo.date.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
                <span>優先度: {todo.priority}</span>
              </Box>
            </Box>
          ))}
        </FormGroup>
        <Dialog open={isDialogOpen} onclose={handleDialogClose}>
          <DialogTitle>Todo要素の編集</DialogTitle>
          <DialogContent>
            <Autocomplete
             freeSolo
             options={todoList}
             getOptionLabel={(option) => option.title}
             renderInput={(params) => (
              <TextField
               {...params}
               label='Search todo'
               variant='outlined'
              />
             )}
             onchange={handleAutocompleteChange}
            />
            <TextField
              label='title'
              variant='outlined'
              size='small'
              name='title'
              value={selectedTodo.title || ''}
              onchange={handleInputChange}
              fullWidth
              margin='dense'
            />
            <TextField
              label='due'
              variant='outlined'
              size='small'
              name='due'
              value={selectedTodo.due || ''}
              onchange={handleInputChange}
              fullWidth
              margin='dense'
            />
            <TextField
              label='date'
              variant='outlined'
              size='small'
              name='due'
              value={selectedTodo.date || ''}
              onchange={handleInputChange}
              fullWidth
              margin='dense'
            />
            <TextField
              label='priority'
              variant='outlined'
              size='small'
              name='priority'
              value={selectedTodo.priority || ''}
              onchange={handleInputChange}
              fullWidth
              margin='dense'
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">Cancel</Button>
            <Button onClick={handleDialogSave} color='primary'>Save</Button>
            <Button onClick={() => setIsDeleteAlertDialogOpen(true)} color='primary'>Delete</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={isDeleteAlertDialogOpen}>
          <DialogTitle>todo削除の確認</DialogTitle>
          <DialogContent>
            <DialogContentText>
              本当にこのtodoを削除しますか？
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDelete} color="primary">はい</Button>
            <Button onClick={() => setIsDeleteAlertDialogOpen(false)} color='primary'>いいえ</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={isCreateDialogOpen} onclose={handleDialogClose}>
          <DialogTitle>Todo要素の作成</DialogTitle>
          <DialogContent>
            <TextField
              label='title'
              variant='outlined'
              size='small'
              name='title'
              value={selectedTodo.title || ''}
              onchange={handleInputChange}
              fullWidth
              margin='dense'
            />
            <TextField
              label='due'
              variant='outlined'
              size='small'
              name='due'
              value={selectedTodo.due || ''}
              onchange={handleInputChange}
              fullWidth
              margin='dense'
            />
            <TextField
              label='date'
              variant='outlined'
              size='small'
              name='due'
              value={selectedTodo.date || ''}
              onchange={handleInputChange}
              fullWidth
              margin='dense'
            />
            <TextField
              label='priority'
              variant='outlined'
              size='small'
              name='priority'
              value={selectedTodo.priority || ''}
              onchange={handleInputChange}
              fullWidth
              margin='dense'
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">Cancel</Button>
            <Button onClick={handleCreateSave} color='primary'>Save</Button>
          </DialogActions>
        </Dialog>



      </Container>
    </div>
  );
};

export default TodoComponent;

    



