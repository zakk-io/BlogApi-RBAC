const mongoose = require("mongoose")
const validator = require("validator")


const UserSchema = mongoose.Schema(
    {
        username : {
            type : String,
            required : true,
            maxlength : 50,
        },

        email : {
            type : String,
            required : true,
            maxlength : 100,
            unique : true,
            validate : {
                validator : (value) => validator.isEmail(value), 
                message : "provide valid email address",
            }
        },

        password : {
            type : String,
            required : true,
            maxlength : 255,  
        },

        groups : [
            {
                group_id : {type:mongoose.Types.ObjectId,ref:"Groups"},
                role : {
                    type: String,
                    enum : ["owner","admin","member"],
                }
            }
        ]
    }
)

const Users = mongoose.model("Users",UserSchema,"users")

module.exports = Users