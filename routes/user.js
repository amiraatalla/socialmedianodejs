const router = require('router');
const User = require('../models/User');


//friends
router.get("/friends/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(user.followings.map((friend_id) => {
            return User.findById(friend_id);
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
router.put("/follow/:id", async (req, res) => {
    if (req.body.userId != req.params.id) {
        try {
            const user = await User.findById({ req.params.id });
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await User.updateOne({$push:{followers:req.body.userId}});
                await currentUser.updateOne({$push:{$following: req.params.id}});
            }
        } catch (err) {

        }

    } else {
        res.status(403).json("you can not follow yourself");
    }
});