import express from 'express';

const app = express();
const PORT = 4000;

app.use(express.json());

let tasks = [
  { id: 1, taskName: "Develop Login Page", assignedTo: "Rahul Sharma", status: "Pending", priority: "High" },
  { id: 2, taskName: "Setup CI/CD Pipeline", assignedTo: "Sneha Patel", status: "In Progress", priority: "Medium" },
  { id: 3, taskName: "Write Unit Tests", assignedTo: "Vikas Gupta", status: "Completed", priority: "Low" }
];

// GET /tasks
app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

// GET /tasks/:id
app.get('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  res.status(200).json(task);
});

// POST /tasks
app.post('/tasks', (req, res) => {
  const { id, taskName, assignedTo, status, priority } = req.body;

  if (!id || !taskName || !assignedTo || !status || !priority) {
    return res.status(400).json({ error: "All fields (id, taskName, assignedTo, status, priority) are required" });
  }

  const existingTask = tasks.find(t => t.id === parseInt(id, 10));
  if (existingTask) {
    return res.status(409).json({ error: "Task with this ID already exists" });
  }

  const newTask = { id: parseInt(id, 10), taskName, assignedTo, status, priority };
  tasks.push(newTask);

  res.status(201).json({
    message: "Task added successfully",
    task: newTask
  });
});

// PUT /tasks/:id
app.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  const { taskName, assignedTo, status, priority } = req.body;

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...(taskName !== undefined && { taskName }),
    ...(assignedTo !== undefined && { assignedTo }),
    ...(status !== undefined && { status }),
    ...(priority !== undefined && { priority })
  };

  res.status(200).json({
    message: "Task updated successfully",
    task: tasks[taskIndex]
  });
});

// DELETE /tasks/:id
app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  const deletedTask = tasks.splice(taskIndex, 1);

  res.status(200).json({
    message: "Task deleted successfully",
    task: deletedTask[0]
  });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
