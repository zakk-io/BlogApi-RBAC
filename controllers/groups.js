const mongoose = require("mongoose")
const xss = require("xss")
const Groups = require("../models/groups")
const Users = require("../models/users")
const Invitations = require("../models/invitations")
const nodemailer = require("nodemailer")
const crypto = require("crypto")
const { log } = require("console")
const Posts = require("../models/posts")
const Comments = require("../models/comments")



var ALLOWED_ROLES = ["admin","member"]


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



const InviteToGroup = async (req,res) => {
    try {
        const email = req.body.email
        const role = req.body.role
        const group_id = req.params.group_id
        const token = crypto.randomUUID()
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mozakk.io@gmail.com', 
                pass: process.env.EMAIL_APP_PASSWORD, 
            },
        });

        let invitation;
        const group = await Groups.findOne({_id:group_id})
        const owner = await Users.findOne({_id:group.owner})
        invitation = await Invitations.findOne({ 
            email : email,
            group_id : group_id,
            used : true 
        })
        if(invitation || owner.email === email){
            return res.status(400).json({
                status: 400,
                successful: false,
                message: "user already group member",
            })
        }

        invitation = await new Invitations({
            group_id : group_id,
            email : email,
            role : role,
            token : token
        }).save()
        
        const InvitationLink = `http://127.0.0.1:2000/api/groups/${group_id}/join?token=${token}`
        const mailOptions = {
            from: 'mozakk.io@gmail.com',
            to: req.body.email,
            subject: 'Group Invitation', 
            text: `Hello my friend ${email},  ${req.user.email} invited you to his/her group on zakk.io | click the link ${InvitationLink}`, 
        };
        
        
        const info = await transporter.sendMail(mailOptions)
        return res.status(200).json({
            status: 200,
            successful: true,
            message: "invitation has been sent successfully",
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




const JoinGroup = async (req,res) => {
    try {
    const token = req.query.token
    const group_id = req.params.group_id
    const group = await Groups.findOne({_id:group_id})
    
    const invitation = await Invitations.findOne({
        group_id : group_id, //no idor
        token : token, //no frud
        used : false //no reuseing
    })

    if(!invitation){
        return res.status(403).json({
            status: 403,
            successful: false,
            message: "invitation invalid or expired",
        })
    }
    const email = invitation.email
    const role = invitation.role
    
    const user = await Users.findOne({email:email})

    const InvitationLink = `/api/groups/${group_id}/join?token=${token}`
    if(!user){
        return res.redirect(`/register?redirect=${InvitationLink}`)
    }

    group.members.push(user._id)
    await group.save()

    user.groups.push({
        group_id : group._id,
        role : role
    })
    await user.save()

    invitation.used = true
    await invitation.save()

    await Invitations.deleteMany({
        group_id : group_id, 
        email : email,
        used : false
    })

    return res.status(200).json({
        status: 200,
        successful: true,
        message: "user has been joined to the group successfully",
    })        
    } catch (error) {
        if(error.name === "CastError"){
            return res.status(404).json({
                status: 404,
                successful: false,
                message: "group not found",
            })
        }
        console.log(error);
        res.json(error)  

    }
}



const UpdateRole = async(req,res) => {
    try {
        const email = req.body.email 
        const role = req.body.role
        const group_id = req.params.group_id

        const group = await Groups.findOne({_id:group_id})
        const owner = await Users.findOne({_id:group.owner})
        

        if(owner.email === email){
            return res.status(400).json({
                status: 400,
                successful: false,
                message: "can not update group owner role",
            })
        }
        
        if(!ALLOWED_ROLES.includes(role)){
            return res.status(400).json({
                status: 400,
                successful: false,
                message: `allowed roles are ${ALLOWED_ROLES}`,
            })   
        }

        const user = await Users.findOne({email:email})
        if(!user){
            return res.status(404).json({
                status: 404,
                successful: false,
                message: "user not found",
            })  
        }

        const g = user.groups.find((g) => g.group_id.toString() === group_id)
        if(!g){
            return res.status(400).json({
                status: 400,
                successful: false,
                message: "user not part of the group",
            })  
        }
        g.role = role
        
        await user.save()

        return res.status(200).json({
            status: 200,
            successful: true,
            message: "user role updated successfully",
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


const KickUser = async (req,res) => {
    try {
        const email = req.body.email
        const group_id = req.params.group_id

        const group = await Groups.findOne({_id:group_id})
        const owner = await Users.findOne({_id:group.owner}) 
        if(owner.email === email){
            return res.status(400).json({
                status: 400,
                successful: false,
                message: "group owner can not be kicked",
            })
        }

        const user = await Users.findOne({email:email})
        if(!user){
            return res.status(404).json({
                status: 404,
                successful: false,
                message: "user not found",
            })  
        }
        
        const g = user.groups.find((g) => g.group_id.toString() === group_id)
        if(!g){
            console.log(g);
            return res.status(400).json({
                status: 400,
                successful: false,
                message: "user not part of the group",
            })  
        }

        
        //remove group from the groups list in user object
        user.groups.pull(g)
        await user.save()

        //remove user form members list from group object
        group.members.pull(user._id)
        await group.save()

        await Invitations.deleteOne({
            group_id : group_id,
            email : email,
            used : true
        })

        return res.status(200).json({
            status: 200,
            successful: true,
            message: `user kicked out the group by ${req.user.email}`,
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



const GroupMembers = async (req,res) => {
    const group_id = req.params.group_id
    const group = await Groups.findOne({
        _id : group_id,
        owner : req.user.id
    }).populate("members")

    const members = await Promise.all(group.members.map(async (member) => {
        const g = member.groups.find((g) => g.group_id.toString() === group_id)
        const posts = await Posts.find({
            group_id,
            author : member._id
        })

        return {
            id : member._id,
            username : member.username,
            email : member.email,
            role : g.role,
            posts : posts.length
        }
    }))

    return res.status(200).json({
        status: 200,
        successful: true,
        members
    })
}


//ListInvitedUsers
const ListInvitations = async (req,res) => {
    try {
        const group_id = req.params.group_id
        const invitations = await Invitations.find({group_id , used : false})

        if(invitations.length === 0){
            return res.status(404).json({
                status: 404,
                successful: false,
                invitations: [],
                message: "no invitations for now",
            }) 
        }

        return res.status(200).json({
            status: 200,
            successful: true,
            invitations
        })


    } catch (error) {
        console.log(error);
        res.json(error)   
    }
}
//ListInvitedUsers




//DeleteInvitation
const DeleteInvitation = async (req,res) => {
    try {
        const invitation_id = req.params.invitation_id

        const invitation = await Invitations.findOne({
            _id : invitation_id,
            used : false
        })

        if(!invitation){
            return res.status(404).json({
                status: 404,
                successful: false,
                message: "invitation not found",
            }) 
        }
        
        await Invitations.deleteOne({_id:invitation._id})
        return res.status(200).json({
            status: 200,
            successful: true,
            message: "invitation deleted successfully",
        }) 

    } catch (error) {
        console.log(error);
        res.json(error)   
    }
}
//DeleteInvitation


module.exports = {
    CreateGroup,
    UpdateGroup,
    DeleteGroup,
    InviteToGroup,
    JoinGroup,
    UpdateRole,
    KickUser,
    GroupMembers,
    ListInvitations,
    DeleteInvitation
}
