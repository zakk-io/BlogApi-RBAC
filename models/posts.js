const mongoose = require("mongoose")


const PostsSchema = mongoose.Schema(
    {
        group_id : {
            type : mongoose.Types.ObjectId,
            ref : "Group"
        },

        author : {
            type : mongoose.Types.ObjectId,
            ref : "Users"
        },

        title : {
            type : String,
            required : true,
            maxlength : 50
        },

        content : {
            type : String,
            required : true,
        },

        status : {
            type : String,
            enum : ["pending","approved"],
            default : "pending"
        }
    }
)

const Posts = mongoose.model("Posts",PostsSchema,"posts")

module.exports = Posts