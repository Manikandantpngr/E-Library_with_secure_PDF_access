const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// GET /categories
router.get('/', async (req, res) => {
	const cats = await Category.find();
	res.json(cats);
});

// POST /categories - admin
router.post('/', auth, role('admin'), async (req, res) => {
	const cat = await Category.create(req.body);
	res.json(cat);
});

// PUT /categories/:id - admin
router.put('/:id', auth, role('admin'), async (req, res) => {
	const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
	res.json(cat);
});

// DELETE /categories/:id - admin
router.delete('/:id', auth, role('admin'), async (req, res) => {
	await Category.findByIdAndDelete(req.params.id);
	res.json({ message: 'Deleted' });
});

module.exports = router;
