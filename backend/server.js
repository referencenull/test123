const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 3001;

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3001'] }));

// Serve built frontend static files
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.get('/api/health', limiter, (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/products', limiter, (req, res) => {
  try {
    const { search, category, sort } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR sku LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    const sortMap = {
      name: 'name ASC',
      price: 'price ASC',
      quantity: 'quantity ASC',
      category: 'category ASC',
    };
    // Values are taken from a fixed whitelist (sortMap) preventing SQL injection
    const orderClause = sortMap[sort] || 'created_at DESC';
    query += ` ORDER BY ${orderClause}`;

    const products = db.prepare(query).all(...params);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', limiter, (req, res) => {
  try {
    const { name, category, price, quantity, sku, description } = req.body;
    if (!name || !category || price == null || quantity == null || !sku) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const stmt = db.prepare(
      'INSERT INTO products (name, category, price, quantity, sku, description) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const result = stmt.run(name, category, price, quantity, sku, description || '');
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(product);
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(400).json({ error: 'SKU already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', limiter, (req, res) => {
  try {
    const { id } = req.params;
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/products/:id/quantity', limiter, (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    if (quantity == null || quantity < 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    db.prepare('UPDATE products SET quantity = ? WHERE id = ?').run(quantity, id);
    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SPA fallback: serve index.html for all non-API routes
app.get('*', limiter, (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
