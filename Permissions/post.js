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
                    message: "user is not part of the group",
                })
            }
            req.user_group = group

            next()
        } catch (error) {
           console.log(error);
           res.json(error) 
        }
    }
}


const PostPermissions = function(action) {
    return async (req,res,next) => {
        try {
            const user_group = req.user_group
            const user = await Users.findOne({_id:req.user.id})

            const user_role = user_group.role
            const role = Roles.find((role) => role.name === user_role)
            const permissions = role.permissions

            //compare
            const haspermsisons = permissions.some(
                (perm) => perm.subject === "post" && perm.actions.includes(action)
            )
            if(!haspermsisons){
                return res.status(403).json({
                    status: 403,
                    successful: false,
                    message: "you do not have permsisons to do this action",
                })
            }

            next()
        } catch (error) {
            console.log(error);
            res.json(error) 
        }
    }
}

module.exports = {
    IsGroupMemeber,
    PostPermissions
}