const mongoose = require("mongoose")
const Groups = require("../models/groups")
const Users = require("../models/users")
const Posts = require("../models/posts")




const CreatePost = async (req,res) => {
    try {
        const group_id = req.params.group_id
        const author = req.user
        const title = req.body.title
        const content = req.body.content

        const post = await new Posts({
            group_id,
            author : author.id,
            title,
            content
        }).save()

        return res.status(201).json({
            status: 201,
            successful: true,
            message: "post Created successfully",
            post
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
    CreatePost,
}
