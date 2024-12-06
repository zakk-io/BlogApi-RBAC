const express = require("express")
const router = express.Router()
const comments = require("../controllers/comments")
const {AuthMiddleware} = require("../middlewares")
const {IsGroupMemeber} = require("../Permissions/post")
const {CheckPost,CommentPermissions} = require("../Permissions/comments")




router.use(AuthMiddleware)

router.post("/api/groups/:group_id/posts/:post_id/comments",[IsGroupMemeber(),CheckPost()],comments.CreateComment)
router.get("/api/groups/:group_id/posts/:post_id/comments",[IsGroupMemeber(),CheckPost()],comments.ListComments)
router.delete("/api/groups/:group_id/posts/:post_id/comments/:comment_id",[IsGroupMemeber(),CheckPost(),CommentPermissions("delete_comment",true)],comments.DeleteComment)




module.exports = router