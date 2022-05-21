const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');


//add post
router.post("/new", async (req, res) => {
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


//update post
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({
                $set: req.body
            });
            res.status(200).json({
                "message": "Post Updated successfully!!",
                "data": post
            });
        }
        else {
            res.status(403).json("You can only update your posts !");
        }
    } catch (err) {
        res.status(500).json(err);
    };
});



module.exports = router;