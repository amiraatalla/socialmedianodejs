const router = require('express').Router();
const User = require('../models/User');


//friends
/**
 * @swagger
 * /friends/{userId}:
 *   get:
 *     parameters:
 *      - in: path
 *        name: userId
 *        required: true
 *        type: string
 *        description: Current User ID.
 *     description: Get all friends by id
 *     responses:
 *       200:
 *         description: Returns the requested friends
 */
router.get("/friends/:userId", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.userId });

        const friends = await Promise.all(user.followings.map((fri_id) => {
            return User.findById(fri_id);
        }));
        let friendsList = [];
        friends.map((friend) => {
            const { _id, username, profilePicture } = friend;
            friendsList.push({ _id, username, profilePicture });
        });
        res.status(200).json(friendsList);
    } catch (err) {
        res.status(500).json(err);
    }
});

//follow  a user
/**
 * @swagger
 * /follow/{id}:
 *   patch:
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: friend_id.
 *      - in: query
 *        name: userId
 *        required: true
 *        description: current_user
 *     responses:
 *       200:
 *         description: User has been followed 
 */
router.put("/follow/:id", async (req, res) => {
    if (req.body.userId != req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!currentUser.followers.includes(req.body.userId)) {
                await User.updateOne({ $push: { followers: req.body.userId } })
                await currentUser.updateOne({ $push: { followings: req.params.id } });
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
/**
 * @swagger
 * /unfollow/{id}:
 *   patch:
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: friend_id.
 *      - in: query
 *        name: userId
 *        required: true
 *        description: current_user
 *     responses:
 *       200:
 *         description: User has been unfollowed 
 */
router.put("/unfollow/:id", async (req, res) => {
    if (req.body.userId != req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (currentUser.followers.includes(req.body.userId)) {
                await User.updateOne({ $pull: { followers: req.body.userId } })
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
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