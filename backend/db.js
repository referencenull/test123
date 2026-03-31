const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'inventory.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    sku TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

const count = db.prepare('SELECT COUNT(*) as count FROM products').get();
if (count.count === 0) {
  const insert = db.prepare(
    'INSERT INTO products (name, category, price, quantity, sku, description) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const insertMany = db.transaction((products) => {
    for (const p of products) insert.run(p.name, p.category, p.price, p.quantity, p.sku, p.description);
  });
  insertMany([
    { name: 'MacBook Pro 14"', category: 'Electronics', price: 1999.99, quantity: 15, sku: 'ELEC-001', description: 'Powerful laptop with M3 chip' },
    { name: 'iPhone 15 Pro', category: 'Electronics', price: 1099.99, quantity: 30, sku: 'ELEC-002', description: 'Latest flagship smartphone' },
    { name: 'iPad Air 5th Gen', category: 'Electronics', price: 749.99, quantity: 22, sku: 'ELEC-003', description: 'Versatile tablet for work and play' },
    { name: 'Sony WH-1000XM5', category: 'Electronics', price: 349.99, quantity: 18, sku: 'ELEC-004', description: 'Premium noise-cancelling headphones' },
    { name: 'Apple Watch Series 9', category: 'Electronics', price: 429.99, quantity: 25, sku: 'ELEC-005', description: 'Advanced health & fitness tracking' },
    { name: 'Classic White T-Shirt', category: 'Clothing', price: 29.99, quantity: 100, sku: 'CLTH-001', description: 'Premium cotton everyday tee' },
    { name: 'Slim Fit Jeans', category: 'Clothing', price: 79.99, quantity: 60, sku: 'CLTH-002', description: 'Modern slim fit denim jeans' },
    { name: 'Puffer Jacket', category: 'Clothing', price: 149.99, quantity: 35, sku: 'CLTH-003', description: 'Warm and lightweight winter jacket' },
    { name: 'Athletic Sneakers', category: 'Clothing', price: 119.99, quantity: 45, sku: 'CLTH-004', description: 'Comfortable everyday sneakers' },
    { name: 'Premium Coffee Beans', category: 'Food & Beverages', price: 24.99, quantity: 80, sku: 'FOOD-001', description: 'Single-origin Arabica coffee beans' },
    { name: 'Organic Raw Honey', category: 'Food & Beverages', price: 18.99, quantity: 50, sku: 'FOOD-002', description: 'Pure wildflower honey, 16oz' },
    { name: 'Chocolate Protein Bars', category: 'Food & Beverages', price: 34.99, quantity: 120, sku: 'FOOD-003', description: 'Pack of 12 high-protein bars' },
    { name: 'Premium Green Tea', category: 'Food & Beverages', price: 14.99, quantity: 90, sku: 'FOOD-004', description: 'Japanese sencha green tea, 50 bags' },
    { name: 'Non-Slip Yoga Mat', category: 'Sports', price: 59.99, quantity: 40, sku: 'SPRT-001', description: 'Eco-friendly 6mm thick yoga mat' },
    { name: 'Adjustable Dumbbells', category: 'Sports', price: 299.99, quantity: 12, sku: 'SPRT-002', description: '5-50 lbs adjustable set' },
    { name: 'Trail Running Shoes', category: 'Sports', price: 139.99, quantity: 28, sku: 'SPRT-003', description: 'Lightweight all-terrain running shoes' },
    { name: 'Mountain Bicycle', category: 'Sports', price: 849.99, quantity: 8, sku: 'SPRT-004', description: '21-speed hardtail mountain bike' },
    { name: 'LED Desk Lamp', category: 'Home & Garden', price: 49.99, quantity: 55, sku: 'HOME-001', description: 'Adjustable color temperature desk lamp' },
    { name: 'Ceramic Plant Pots Set', category: 'Home & Garden', price: 39.99, quantity: 70, sku: 'HOME-002', description: 'Set of 3 modern ceramic pots' },
    { name: 'Lavender Scented Candles', category: 'Home & Garden', price: 22.99, quantity: 4, sku: 'HOME-003', description: 'Hand-poured soy wax, 3-pack' },
  ]);
}

module.exports = db;
