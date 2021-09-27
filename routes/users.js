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

router.get('/:id', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		const { password, updatedAt, ...other } = user._doc;
		res.status(200).json(other);
	} catch (err) {
		return res.status(500).json(err);
	}
});

router.put('/:id/follow', async (req, res) => {
	const userId = req.body.userId;
	const userToFollowId = req.params.id;

	if (userId !== userToFollowId) {
		try {
			const userToFollow = await User.findById(userToFollowId);
			const user = await User.findById(userId);

			if (!userToFollow.followers.includes(userId)) {
				await userToFollow.updateOne({ $push: { followers: userId } });
				await user.updateOne({ $push: { followings: userToFollowId } });
				res.status(200).json('user has been followed');
			} else {
				res.status(400).json('you already follow this user');
			}
		} catch (err) {
			return res.status(500).json(err);
		}
	} else {
		res.status(403).json('you can delete only your account');
	}
});

module.exports = router;
