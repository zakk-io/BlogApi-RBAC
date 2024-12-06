const mongoose = require("mongoose")
const Users = require("../models/users")
const Groups = require("../models/groups")
const Comments = require("../models/comments")
const Posts = require("../models/posts")
const Roles = require("../roles")



const CheckPost = function(){
    return async (req,res,next) => {
        try {
            const post_id = req.params.post_id
            const group_id = req.params.group_id

            const post = await Posts.findOne({_id:post_id , group_id})
            if(!post || post.status === "pending"){
                return res.status(404).json({
                    status: 404,
                    successful: false,
                    message: "post not found",
                }) 
            }
            req.post = post
            return next()
            
        } catch (error) {
            if(error.name === "CastError"){
                return res.status(404).json({
                    status: 404,
                    successful: false,
                    message: "post not found",
                })
            }
            res.json(error) 
        }
    }
}





const CommentPermissions = function(action,check_ownership) {
    return async (req,res,next) => {
        try {
            const user_group = req.user_group
            const comment_id = req.params.comment_id

            const user_role = user_group.role
            const role = Roles.find((role) => role.name === user_role)
            const permissions = role.permissions

            //compare
            const haspermission = permissions.some(
                (perm) => perm.subject === "comment" && perm.actions.includes(action)
            )
    
            if(haspermission){
                req.comment_id = comment_id
                return next()
            }

            if(check_ownership){
                const comment = await Comments.findOne({
                    _id : comment_id,
                    commentor : req.user.id
                })                

                if(comment){
                  req.comment_id = comment_id
                  return next()
                }
            }

            return res.status(403).json({
                status: 403,
                successful: false,
                message: "you do not have permsisons to do this action",
            })

        } catch (error) {  
            if(error.name === "CastError"){
                return res.status(404).json({
                    status: 404,
                    successful: false,
                    message: "comment not found",
                })
            }

            console.log(error);
            res.json(error) 
        }
    }
}





module.exports = {
    CheckPost,
    CommentPermissions
}