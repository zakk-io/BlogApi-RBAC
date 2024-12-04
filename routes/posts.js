const express = require("express")
const router = express.Router()
const posts = require("../controllers/posts")
const {AuthMiddleware} = require("../middlewares")
const {IsGroupMemeber} = require("../Permissions/post")


router.use(AuthMiddleware)

router.post("/api/groups/:group_id/posts",IsGroupMemeber(),posts.CreatePost)







module.exports = router