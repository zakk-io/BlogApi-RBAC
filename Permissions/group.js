const mongoose = require("mongoose")
const Users = require("../models/users")
const Group = require("../models/groups")
const Roles = require("../roles")


const GroupPermissions = function (action) {
    return async (req,res,next) => {
        try {
            //Get user role
            const group_id = req.params.group_id
            const user = await Users.findOne({email:req.user.email})
            const group = user.groups.find((group) => group.group_id.toString() === group_id)
            
            if(!group){
                return res.status(403).json({
                    status: 403,
                    successful: false,
                    message: "group is not found or user is not part of the group",
                })
            }

            const user_role = group.role
            const role = Roles.find((role) => role.name === user_role)
            //Get user role

            //compare
            const haspermsisons = role.permissions.some(
                (perm) => perm.subject === "group" && perm.actions.includes(action)
            )
            if(!haspermsisons){
                return res.status(403).json({
                    status: 403,
                    successful: false,
                    message: "you do not have permsisons to do this action",
                })
            }

            req.group = group
            return next()
            //compare
            
        } catch (error) {
            console.log(error)
            res.json(error)
        }
    }
}


module.exports = GroupPermissions
