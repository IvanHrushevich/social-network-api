const router = require('express').Router();

const Post = require('../models/post');

router.post('/', async (req, res) => {
	const newPost = new Post(req.body);

	try {
		const savedPost = await newPost.save();
		res.status(200).json(savedPost);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.put('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (post.userId === req.body.userId) {
			await post.updateOne({ $set: req.body });
			res.status(200).json('the post has been updated');
		} else {
			res.status(403).json('you can update only your post');
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (post.userId === req.body.userId) {
			await post.deleteOne();
			res.status(200).json('the post has been deleted');
		} else {
			res.status(403).json('you can delete only your post');
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

router.post('/:id/like', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		const userLikedId = req.body.userId;

		if (!post.likes.includes(userLikedId)) {
			await post.updateOne({ $push: { likes: userLikedId } });
			res.status(200).json('the post has been liked');
		} else {
			await post.updateOne({ $pull: { likes: userLikedId } });
			res.status(200).json('the post has been disliked');
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		res.status(200).json(post);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
