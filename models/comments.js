const mongoose = require("mongoose")


const CommentsSchema = mongoose.Schema(
    {
        post_id : {
            type : mongoose.Types.ObjectId,
            ref : "Posts"
        },

        commentor : {
            type : mongoose.Types.ObjectId,
            ref : "Users"
        },

        text : {
            type : String,
            required : true,
        }
    }
)

const Comments = mongoose.model("Comments",CommentsSchema,"comments")

module.exports = Comments