const router = require('express').Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');

router.get('/', (req, res) => {
	res.send('users page');
});

router.put('/:id', async (req, res) => {
	if (req.body.userId === req.params.id || req.body.isAdmin) {
		if (req.body.password) {
			try {
				const salt = await bcrypt.genSalt(10);
				req.body.password = await bcrypt.hash(req.body.password, salt);
			} catch (err) {
				return res.status(500).json(err);
			}
		}

		try {
			await User.findByIdAndUpdate(req.params.id, {
				$set: req.body,
			});

			return res.status(200).json('account has been updated');
		} catch (err) {
			return res.status(500).json(err);
		}
	}

	res.status(403).json('you can update only your account');
});

router.delete('/:id', async (req, res) => {
	if (req.body.userId === req.params.id || req.body.isAdmin) {
		try {
			await User.findByIdAndDelete(req.params.id);
			return res.status(200).json('account has been deleted');
		} catch (err) {
			return res.status(500).json(err);
		}
	}

	res.status(403).json('you can delete only your account');
});

module.exports = router;
