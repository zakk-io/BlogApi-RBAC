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


module.exports = {
    CreateGroup,
}
