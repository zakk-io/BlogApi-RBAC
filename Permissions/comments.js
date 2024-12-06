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




module.exports = {
    CheckPost,
}