// นำเข้าโมดูลที่จำเป็น
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path'); // เพิ่มโมดูล path

const app = express();
const port = 4000;

// ใช้ CORS และ JSON parsing
app.use(cors());
app.use(express.json());

// ให้บริการไฟล์ HTML และไฟล์อื่นๆ
app.use(express.static(path.join(__dirname, 'public'))); // เพิ่มบรรทัดนี้

// สร้างการเชื่อมต่อกับฐานข้อมูล MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // เปลี่ยนเป็นชื่อผู้ใช้ของคุณ
  password: 'admin', // เปลี่ยนเป็นรหัสผ่านของคุณ
  database: 'mydatabase',
});

// เชื่อมต่อกับฐานข้อมูล
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database.');
});

// ส่งไฟล์ HTML เมื่อเข้าถึงเส้นทางหลัก
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // เปลี่ยน path เป็นที่อยู่ไฟล์ HTML ของคุณ
});

// Create user
app.post('/users', (req, res) => {
  const { name, email, age } = req.body;
  const sql = 'INSERT INTO users (name, email, age) VALUES (?, ?, ?)';
  db.query(sql, [name, email, age], (err, result) => {
    if (err) throw err;
    res.send('User added successfully');
  });
});

// Read users
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Update user
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;
  const sql = 'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?';
  db.query(sql, [name, email, age, id], (err, result) => {
    if (err) throw err;
    res.send('User updated successfully');
  });
});

// Delete user
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM users WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.send('User deleted successfully');
  });
});

// เริ่มเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
