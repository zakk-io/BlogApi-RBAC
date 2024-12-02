const mongoose = require("mongoose")
const validator = require("validator")


const InvitationsSchema = mongoose.Schema(
    {
        group_id : {
            type : mongoose.Types.ObjectId,
            ref : "Groups"
        },

        email : {
            type : String,
            required : true,
            maxlength : 100,
            validate : {
                validator : (value) => validator.isEmail(value), 
                message : "provide valid email address",
            }
        },

        role : {
            type : String,
            enum : ["admin","member"],
            required : true,
        },

        token : {
            type : String,
            unique : true,
        },

        used : {
            type : Boolean,
            default : false
        }

    }
)

const Invitations = mongoose.model("Invitations",InvitationsSchema,"invitations")

module.exports = Invitations