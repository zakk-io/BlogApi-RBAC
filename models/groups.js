const mongoose = require("mongoose")


const GroupsSchema = mongoose.Schema(
    {
        name : {
            type : String,
            required : true,
            maxlength : 50,
        },

        owner : {
            type : mongoose.Types.ObjectId,
            ref : "Users"
        },

        members : [
            {
             type : mongoose.Types.ObjectId,
             ref : "Users"
            }
        ]
    }
)

const Groups = mongoose.model("Groups",GroupsSchema,"groups")

module.exports = Groups