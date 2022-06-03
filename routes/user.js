const router = require('express').Router();
const User = require('../models/User');


//friends
router.get("/friends/:userId", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.userId });
        const friends = await Promise.all(user.followings.map((friendId) => {
               if(!friendId) return
                return User.findById(friendId);
            // return User.findById(friend_id);
        }));
        let friendsList = [];
        friends.map((friend) => {
            const { _id, username, profilePicture } = friends;
            friendsList.push({ _id, username, profilePicture });
        });
        res.status(200).json(friendsList);
    } catch (err) {
        res.status(500).json(err);
    }
});

//follow  a user
router.post("/follow/:id", async (req, res) => {
    if (req.body.userId != req.params.id) {
        try {

           

            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                await User.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { $following: req.params.id } });
                res.status(200).json("User has been followed");
            }
            else {
                res.status(403).json("You already follow this user ")
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("you can not follow yourself");
    }
});

//unfollow  a user
router.put("/unfollow/:id", async (req, res) => {
    if (req.body.userId != req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                await User.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { $following: req.params.id } });
                res.status(200).json("User has been unfollowed");
            }
            else {
                res.status(403).json("You do not follow this user ")
            }
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("you can not follow yourself");
    }
});

module.exports = router;