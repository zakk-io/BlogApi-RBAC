const mongoose = require("mongoose")
const xss = require("xss")
const Groups = require("../models/groups")
const Users = require("../models/users")




const CreateGroup = async (req,res) => {
    try {
        const user = await Users.findOne({email:req.user.email})
        const clean_name = xss(req.body.name)

        const group = await new Groups({
            name : clean_name,
            owner : user._id,
            members : [user._id]
        }).save()

        user.groups.push({
            group_id : group._id,
            role : "owner"
        })
        await user.save()

        return res.status(201).json({
            status: 201,
            successful: true,
            message: "Group Created successfully",
            group
        })

    } catch (error) {
        const ErrorObject = {
            status : 400,
            successful : false,
            error : error.name,
            message : error._message,
            body : error.message
        }

        if(error.name === "ValidationError"){
            return res.status(400).json(ErrorObject)
        }

        console.log(error);
        res.json(error)  
    }
}



const UpdateGroup = async (req,res) => {
    try {
        const clean_name = xss(req.body.name)
        await Groups.updateOne({_id:req.group._id},{$set:{name : clean_name}})
        
        return res.status(200).json({
            status: 200,
            successful: true,
            message: "Group Updated successfully",
        })

    } catch (error) {
        const ErrorObject = {
            status : 400,
            successful : false,
            error : error.name,
            message : error._message,
            body : error.message
        }

        if(error.name === "ValidationError"){
            return res.status(400).json(ErrorObject)
        }

        console.log(error);
        res.json(error)  
    }
}



const DeleteGroup = async (req,res) => {
    try {
        await Groups.deleteOne({_id:req.group._id})
        
        return res.status(200).json({
            status: 200,
            successful: true,
            message: "Group deleted successfully",
        })

    } catch (error) {
        console.log(error);
        res.json(error)  
    }
}


//expermental
const JoinGroup = async (req,res) => {
    const group = await Groups.findOne({_id:req.params.group_id})
    const user = await Users.findOne({_id:req.user.id})
    group.members.push(user._id)
    await group.save()

    user.groups.push({
        group_id : group._id,
        role : "member"
    })
    await user.save()
    return res.json({
        message : `${user.username} has joined group ${group.name}`
    })
}
//expermental

module.exports = {
    CreateGroup,
    UpdateGroup,
    DeleteGroup,
    JoinGroup
}
