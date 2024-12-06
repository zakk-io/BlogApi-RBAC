const mongoose = require("mongoose")
const Groups = require("../models/groups")
const Users = require("../models/users")
const Posts = require("../models/posts")
const Comments = require("../models/comments")



const CreateComment = async (req,res) => {
    try {
        const commentor = req.user
        const text = req.body.text
        const post = req.post   

        const comment = await new Comments({
            post_id : post._id,
            commentor : commentor.id,
            text,
        }).save()

        return res.status(201).json({
            status: 201,
            successful: true,
            message: "comment Created successfully",
            comment
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
        res.json(error) 
    }
}




const ListComments = async (req,res) => {
    try {
        const post = req.post
          
        const comments = await Comments.find({
            post_id : post._id
        })

        if(comments.length === 0){
            return res.status(200).json({
                status: 200,
                successful: false,
                message: "no comments for now",
                comments
            })  
        }
        
        return res.status(200).json({
            status: 200,
            successful: true,
            comments
        })
        
    } catch (error) {
        res.json(error) 
    }
}





module.exports = {
    CreateComment,
    ListComments
}

