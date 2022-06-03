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


router.put("/:id/:userId", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const postUpdated = await Post.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.params.userId
            },
            req.body,
            { new: true }
        );

        if (!postUpdated) {
            throw new Error('could not update Post');
        }
        res.json(postUpdated);

    } catch (e) {
        res.sendStatus(500);
    }
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
        Post.findByIdAndDelete(id, (err, data) => {
            if (err) {
                return res.status(500).json();
            } else {
                if (data) {
                    return res.json(data);
                } else {
                    return res.status(400).send("This post is not exist");
                }
            }
        });
    }
    else {
        res.status(403).json("You can only delete your posts");
    }
});


//get  post all
router.get("/getAllPosts", async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
});


//post like/dislike API
router.post("/like/:id", async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            const like = await Post.findOneAndUpdate(
                { _id: req.params.id },
                { $push: { likes: req.body.userId } },
                { new: true }
            );
            res.json(like);
        }
        else {
            const dislike = await Post.findOneAndUpdate(
                { _id: req.params.id },
                { $pull: { likes: req.body.userId } },
                { new: true }
            );
            res.json(dislike);
        }
    } catch (e) {
        res.sendStatus(500);
    }
});



//get a post
router.get("/getAPost/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});


//get a user time line
router.get("/timeLine/:userId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        )
        res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
        res.status(500).json(err);
    }
});

//get a profile
router.get("/profile/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        const post = await Post.find({ userId: user._id});
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;