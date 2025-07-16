const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(express.static('public'));

// Multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ss211105',
    database: 'onecart_database'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin_panel.html'));
});

app.get('/create-account', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Create_account.html'));
});

app.get('/addToCart', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'add_to_art_page.html'));
});

// Serve mobile form
app.get('/add-mobile-form', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'mobile_add.html'));
});

// Serve TV form
app.get('/add-tv-form', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'TV_add.html'));
});

app.get('/add-fridge-form', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'fridge_add.html'));
});

app.get('/add-washing-machine-form', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'washingMachine_add.html'));
});
app.get('/payment', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'payment.html'));
});
// Serve all products
app.get('/api/featured-products', (req, res) => {
  const queries = {
    mobile: 'SELECT * FROM mobiles ORDER BY id DESC LIMIT 1',
    tv: 'SELECT * FROM tvs ORDER BY id DESC LIMIT 1',
    fridge: 'SELECT * FROM fridges ORDER BY id DESC LIMIT 1',
    washing_machine: 'SELECT * FROM washing_machines ORDER BY id DESC LIMIT 1',
  };

  const results = {};

  const promises = Object.entries(queries).map(([key, query]) => {
    return new Promise((resolve, reject) => {
      db.query(query, (err, rows) => {
        if (err) return reject(err);
        // ✅ Add category key into the returned product
        results[key] = rows[0] ? { ...rows[0] } : null;
        resolve();
      });
    });
  });

  Promise.all(promises)
    .then(() => res.json(results))  // ✅ Returns: { mobile: { ... }, tv: { ... }, ... }
    .catch(err => res.status(500).json({ error: 'Error loading featured products', details: err }));
});

app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'checkout.html'));
});


// Add mobile to DB
app.post('/add-mobile', upload.single('image_path'), (req, res) => {
  const {
    title, description, price, brand, warranty,
    storage, ram, color, processor, category, more, quantity
  } = req.body;

  const imagePath = req.file?.path;

  const sql = `INSERT INTO mobiles 
    (title, description, price, brand, warranty, storage, ram, color, processor, category, more, quantity, image_path) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [
    title, description, price, brand, warranty,
    storage, ram, color, processor, category, more, quantity, imagePath
  ], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send('✅ Mobile added successfully!');
  });
});

app.post('/add-tv', upload.single('image_path'), (req, res) => {
  const {
    title, description, price, brand, screen_size,
    screen_type, resolution, smart_tv, hdmi_ports,
    usb_ports, warranty, color, category, more, quantity
  } = req.body;

  const imagePath = req.file?.path;

  const sql = `INSERT INTO tvs 
    (title, description, price, brand, screen_size, screen_type, resolution, smart_tv, hdmi_ports, usb_ports, warranty, color, category, more, quantity, image_path) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [
    title, description, price, brand, screen_size,
    screen_type, resolution, smart_tv ? 1 : 0, hdmi_ports,
    usb_ports, warranty, color, category, more, quantity, imagePath
  ], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send('✅ TV added successfully!');
  });
});

// Add Fridge
app.post('/add-fridge', upload.single('image_path'), (req, res) => {
  const {
    title, description, price, brand,
    capacity, door_type, defrosting_type,
    energy_rating, color, warranty,
    category, more, quantity
  } = req.body;

  const imagePath = req.file?.path;

  const sql = `INSERT INTO fridges (
    title, description, price, brand, capacity,
    door_type, defrosting_type, energy_rating,
    color, warranty, category, more, quantity, image_path
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [
    title, description, price, brand,
    capacity, door_type, defrosting_type,
    energy_rating, color, warranty,
    category, more, quantity, imagePath
  ], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send('✅ Fridge added successfully!');
  });
});

// Add Washing Machine
app.post('/add-washing-machine', upload.single('image_path'), (req, res) => {
  const {
    title, description, price, brand,
    capacity, loading_type, function_type,
    energy_rating, color, warranty,
    category, more, quantity
  } = req.body;

  const imagePath = req.file?.path;

  const sql = `INSERT INTO washing_machines (
    title, description, price, brand, capacity,
    loading_type, function_type, energy_rating,
    color, warranty, category, more, quantity, image_path
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [
    title, description, price, brand, capacity,
    loading_type, function_type, energy_rating,
    color, warranty, category, more, quantity, imagePath
  ], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send('✅ Washing machine added successfully!');
  });
});

app.post('/register', async (req, res) => {
  const { name, email, password, phone, address, pincode } = req.body;

  if (!name || !email || !password || !pincode) {
    return res.status(400).json({ error: 'Name, email, password, and pincode are required.' });
  }

  try {
    // Check if email already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      if (result.length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      const insertQuery = `INSERT INTO users (name, email, password, phone, address, pincode) VALUES (?, ?, ?, ?, ?, ?)`;
      db.query(insertQuery, [name, email, hashedPassword, phone, address, pincode], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error saving user' });
        res.status(201).json({ message: '✅ User registered successfully!', userId: result.insertId });
      });
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if both fields are filled
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  // Find user
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = results[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Optional: You can store session / JWT here
    res.status(200).json({
      message: '✅ Login successful!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  });
});














// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});