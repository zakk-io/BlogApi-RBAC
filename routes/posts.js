const express = require("express")
const router = express.Router()
const posts = require("../controllers/posts")
const {AuthMiddleware} = require("../middlewares")
const {IsGroupMemeber,PostPermissions} = require("../Permissions/post")


router.use(AuthMiddleware)

router.post("/api/groups/:group_id/posts",IsGroupMemeber(),posts.CreatePost)
router.get("/api/groups/:group_id/posts",IsGroupMemeber(),posts.ListPosts),
router.get("/api/groups/:group_id/posts/pended",[IsGroupMemeber(),PostPermissions("pended_posts")],posts.PendedPosts),
router.get("/api/groups/:group_id/posts/:post_id",[IsGroupMemeber(),PostPermissions("post_approval")],posts.PostApproval)
router.put("/api/posts/:post_id",posts.UpdatePost)







module.exports = router