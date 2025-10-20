const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const mongoose = require('mongoose');

require('dotenv').config();

// ensure upload directories exist
const dirs = [path.join(__dirname, 'uploads'), path.join(__dirname, 'uploads', 'pdfs'), path.join(__dirname, 'uploads', 'images')];
for (const d of dirs) if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// routes
app.use('/auth', require('./routes/auth'));
app.use('/upload', require('./routes/upload'));
app.use('/books', require('./routes/books'));
app.use('/download', require('./routes/download'));

// static
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./middleware/notFound'));
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 3000;

if (process.env.MONGO_URI) {
	mongoose.connect(process.env.MONGO_URI).then(() => {
		console.log('Mongo connected');
		app.listen(PORT, () => console.log('Server listening on', PORT));
	}).catch(err => {
		console.error('Mongo connection error', err);
		process.exit(1);
	});
} else {
	// start without DB for quick testing (some endpoints will still work)
	app.listen(PORT, () => console.log('Server listening on', PORT));
}
