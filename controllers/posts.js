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



const ListPosts = async (req,res) => {
    try {
        const group_id = req.params.group_id

        const posts = await Posts.find({
            group_id : group_id,
            status : "approved"
        })
        
        if(posts.length === 0){
            return res.status(200).json({
                status: 200,
                successful: true,
                message : "no posts for now"
            })          
        }

        return res.status(200).json({
            status: 200,
            successful: true,
            posts
        })
        
    } catch (error) {
        console.log(error);
        res.json(error) 
    }
}


const PendedPosts = async (req,res) => {
    try {
        const group_id = req.params.group_id

        const posts = await Posts.find({
            group_id : group_id,
            status : "pending"
        })
        
        if(posts.length === 0){
            return res.status(200).json({
                status: 200,
                successful: true,
                message : "no pended posts for now"
            })          
        }

        return res.status(200).json({
            status: 200,
            successful: true,
            posts
        })
        
    } catch (error) {
        console.log(error);
        res.json(error) 
    }
}


const PostApproval = async (req,res) => {
    try {
        const group_id = req.params.group_id
        const post_id = req.params.post_id

        await Posts.updateOne({
            _id : post_id,
            group_id,
            status : "pending"  
        } , {$set:{status : "approved"}})
        
        return res.status(200).json({
            status: 200,
            successful: true,
            message: "post approved successfully",
        })

    } catch (error) {
        console.log(error);
        res.json(error) 
    }
}



module.exports = {
    CreatePost,
    ListPosts,
    PostApproval,
    PendedPosts
}
