const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// GET /users - admin only
router.get('/', auth, role('admin'), async (req, res) => {
	const users = await User.find().select('-password');
	res.json(users);
});

// GET /users/me
router.get('/me', auth, async (req, res) => {
	res.json(req.user);
});

// PUT /users/me - update profile
router.put('/me', auth, async (req, res) => {
	const allowed = ['name', 'email'];
	for (const k of Object.keys(req.body)) if (!allowed.includes(k)) delete req.body[k];
	const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true }).select('-password');
	res.json(user);
});

// DELETE /users/:id - admin
router.delete('/:id', auth, role('admin'), async (req, res) => {
	await User.findByIdAndDelete(req.params.id);
	res.json({ message: 'Deleted' });
});

module.exports = router;

