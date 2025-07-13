const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let users = [
  { id: 1, name: 'Ahmed' },
  { id: 2, name: 'Sarra' },
];

let tasks = [
  { id: 1, userId: 1, title: 'Faire les courses', done: false },
  { id: 2, userId: 2, title: 'Appeler le docteur', done: true },
];


app.get('/users', (req, res) => res.json(users));

app.post('/users', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Name required' });
  const newUser = { id: users.length + 1, name };
  users.push(newUser);
  res.status(201).json(newUser);
});


app.get('/tasks', (req, res) => res.json(tasks));

app.post('/tasks', (req, res) => {
  const { userId, title } = req.body;
  if (!userId || !title) return res.status(400).json({ message: 'userId and title required' });
  const newTask = { id: tasks.length + 1, userId, title, done: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/tasks/:id/done', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  task.done = !task.done; 
  res.json(task);
});

app.listen(port, () => console.log(`API running on ${port}`));
