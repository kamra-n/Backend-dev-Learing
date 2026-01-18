# Nodejs_01 - Basic HTTP Server with File Logging

## 📖 Overview

This project demonstrates how to create a **basic HTTP server in Node.js** using the built-in `http` module. It also showcases **file system operations** by logging requests to a text file.

---

## 🚀 What Does This Project Do?

1. **Creates an HTTP Server** - Listens on `http://localhost:3000`
2. **Handles Multiple Routes** - Responds differently based on the URL path
3. **Logs Requests to a File** - Writes timestamps to `logs.txt` when the home route is visited

---

## 📁 Project Structure

```
Nodejs_01/
├── index.js        # Main server file
├── package.json    # Project configuration
├── logs.txt        # Log file (auto-generated)
└── README.md       # This documentation
```

---

## 🛠️ Technologies & Concepts Used

| Technology/Concept | Description |
|-------------------|-------------|
| `http` module | Built-in Node.js module to create HTTP servers |
| `fs` module | File System module for reading/writing files |
| ES Modules | Using `import` syntax instead of `require` |
| `path` & `url` modules | For handling file paths in ES modules |
| Async/Await | Asynchronous file operations |

---

## 📝 Code Explanation

### 1. **ES Module Setup**
```javascript
import { createServer } from 'http'
import fs from 'node:fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```
- Uses ES Modules (`"type": "module"` in package.json)
- `__dirname` is manually created since it's not available in ES modules

### 2. **Server Creation with Routes**
```javascript
const server = createServer(async (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });

    switch (req.url) {
        case '/':
            // Home route - logs to file
            res.end('Hello From home');
            break;
        case '/about':
            res.end('Hello From about');
            break;
        default:
            res.end('Page Not Found');
            break;
    }
});
```

### 3. **File Logging**
```javascript
const date = new Date().toISOString();
await fs.promises.appendFile(__dirname + '/logs.txt', `New Logs from / route at ${date} \n`);
```
- Every visit to `/` appends a timestamped log entry to `logs.txt`

---

## 🌐 Available Routes

| Route | Response |
|-------|----------|
| `http://localhost:3000/` | "Hello From home" + logs timestamp |
| `http://localhost:3000/about` | "Hello From about" |
| Any other route | "Page Not Found" |

---

## ▶️ How to Run

```bash
# Navigate to the project folder
cd Nodejs_01

# Start the server
npm run start
```

The server will start at **http://localhost:3000**

---

## 📚 Key Learning Points

1. ✅ Creating HTTP servers without Express
2. ✅ Handling different routes using `switch` statement
3. ✅ File system operations with `fs.promises`
4. ✅ Working with ES Modules in Node.js
5. ✅ Understanding `__dirname` workaround in ES modules
6. ✅ Asynchronous programming with `async/await`

---

## 🔍 Example Log Output

```
New Logs from / route at 2026-01-18T11:53:21.206Z 
New Logs from / route at 2026-01-18T11:53:26.993Z 
New Logs from / route at 2026-01-18T11:53:31.231Z 
```

---

> **Note:** This is a foundational project for understanding Node.js backend development before moving on to frameworks like Express.js.
