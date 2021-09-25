const router = require('express').Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');

router.post('/register', async (req, res) => {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		const newUser = User({
			username: req.body.username,
			email: req.body.email,
			password: hashedPassword,
		});

		const user = await newUser.save();
		res.status(200).json(user);
	} catch (err) {
		console.log(`err`, err);
	}
});

module.exports = router;
