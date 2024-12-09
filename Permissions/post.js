const mongoose = require("mongoose")
const Users = require("../models/users")
const Groups = require("../models/groups")
const Posts = require("../models/posts")
const Roles = require("../roles")



const IsGroupMemeber = function() {
    return async (req,res,next) => {
        try {
            const group_id = req.params.group_id
            const user = await Users.findOne({_id:req.user.id})

            const group = user.groups.find((group) => group.group_id.toString() === group_id)
            if(!group){
                return res.status(403).json({
                    status: 403,
                    successful: false,
                    message: "group not found or user is not part of it",
                })
            }
            req.user_group = group
            next()
        } catch (error) {
            if(error.name === "CastError"){
                return res.status(404).json({
                    status: 404,
                    successful: false,
                    message: "group not found",
                })
            }
            
            console.log(error);
            res.json(error)
        }
    }
}


const PostPermissions = function(action,check_ownership) {
    return async (req,res,next) => {
        try {
            const user_group = req.user_group
            const post_id = req.params.post_id
            const user = await Users.findOne({_id:req.user.id})

            const user_role = user_group.role
            const role = Roles.find((role) => role.name === user_role)
            const permissions = role.permissions

            //compare
            const haspermission = permissions.some(
                (perm) => perm.subject === "post" && perm.actions.includes(action)
            )

            if(haspermission){
                return next()
            }

            if(check_ownership){
                const post = await Posts.findOne({
                    _id :post_id,
                    author: req.user.id,
                    status: "approved" 
                })

                if(!post){
                    return res.status(404).json({
                        status: 404,
                        successful: false,
                        message: "post not found",
                    })
                }
                req.post = post
                return next()
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
                    message: "post not found",
                })
            }
            
            console.log(error);
            res.json(error) 
        }
    }
}

module.exports = {
    IsGroupMemeber,
    PostPermissions
}