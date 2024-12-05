const Roles = [
    {
        name : "owner",
        permissions : [
            {subject : "group", actions : ["update","delete","invite_user","kick_user","update_role"]},
            {subject : "post", actions : ["pended_posts","post_approval","delete_post"]}
        ]
    },

    {
        name : "admin",
        permissions : [
            {subject : "group", actions : ["kick_user"]},
            {subject : "post", actions : ["pended_posts","post_approval","delete_post"]}
        ]
    },

    {
        name : "member",
        permissions : [
            {subject : "group", actions : [""]},
            {subject : "post", actions : [""]}

        ]
    },

]

module.exports = Roles