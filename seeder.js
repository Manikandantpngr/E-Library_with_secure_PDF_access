const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Category = require('./models/Category');

async function run() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/e-library';
  await mongoose.connect(uri);
  console.log('Connected to', uri);

  await User.deleteMany();
  await Category.deleteMany();

  const admin = await User.create({ name: 'Admin', email: 'admin@example.com', password: 'password', role: 'admin' });
  const librarian = await User.create({ name: 'Librarian', email: 'librarian@example.com', password: 'password', role: 'librarian' });
  const user = await User.create({ name: 'User', email: 'user@example.com', password: 'password', role: 'user' });

  const fiction = await Category.create({ name: 'Fiction', description: 'Fiction books' });
  const nonf = await Category.create({ name: 'Non-Fiction', description: 'Non-fiction books' });

  console.log('Seeded users and categories');
  console.log({ admin: admin.email, librarian: librarian.email, user: user.email });
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
