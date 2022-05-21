const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');


router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json({
            "message": "Post created successfully!!",
            "data": savedPost
        });
    } catch (err) {
        res.status(500).json(err);
    };
});


module.exports = router;