const mongoose = require("mongoose")
const Users = require("../models/users")
const Groups = require("../models/groups")
const Posts = require("../models/posts")
const Roles = require("../roles")



const IsGroupMemeber = function() {
    return async (req,res,next) => {
        try {
            const group_id = req.params.group_id
            const author =  await Users.findOne({_id:req.user.id})


            const group = author.groups.find((group) => group.group_id.toString() === group_id)
            if(!group){
                return res.status(403).json({
                    status: 403,
                    successful: false,
                    message: "user is not part of the group",
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
    IsGroupMemeber
}