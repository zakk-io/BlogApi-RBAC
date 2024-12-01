const Roles = [
    {
        name : "owner",
        permissions : [
            {subject : "group", actions : ["update","delete","invite_user","kick_user"]},
        ]
    },

    {
        name : "admin",
        permissions : [
            {subject : "group", actions : ["kick_user"]},
        ]
    },

    {
        name : "member",
        permissions : [
            {subject : "group", actions : [""]},
        ]
    },

]

module.exports = Roles