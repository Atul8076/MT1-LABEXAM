import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

let tasks = [
  { id: 1, taskName: "Develop Login Page", assignedTo: "Rahul Sharma", status: "Pending" },
  { id: 2, taskName: "Database Schema Design", assignedTo: "Pooja Verma", status: "Completed" }
];

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // GET /
  if (method === 'GET' && url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Welcome to Employee Task Management Application</h1>');
  }

  // GET /about
  else if (method === 'GET' && url === '/about') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Employee Task Management Application - Built with Node.js HTTP and FS modules.');
  }

  // GET /home -> Static file via FS
  else if (method === 'GET' && url === '/home') {
    const filePath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Internal Server Error reading file" }));
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  }

  // GET /tasks
  else if (method === 'GET' && url === '/tasks') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(tasks));
  }

  // POST /add-task
  else if (method === 'POST' && url === '/add-task') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const parsedBody = JSON.parse(body);
        const { id, taskName, assignedTo, status } = parsedBody;

        if (!id || !taskName || !assignedTo || !status) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: "Missing required fields: id, taskName, assignedTo, status" }));
        }

        const newTask = { id: Number(id), taskName, assignedTo, status };
        tasks.push(newTask);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Task added successfully", task: newTask }));
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Invalid JSON format" }));
      }
    });
  }

  // 404
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: "Route not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
