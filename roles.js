const Roles = [
    {
        name : "owner",
        permissions : [
            {subject : "group", actions : ["update","delete","invite_user","list_invited_users","delete_invitations","kick_user","update_role","dashbaord","group_members"]},
            {subject : "post", actions : ["pended_posts","post_approval","delete_post"]},
            {subject : "comment", actions : ["delete_comment"]}
        ]
    },

    {
        name : "admin",
        permissions : [
            {subject : "group", actions : ["kick_user"]},
            {subject : "post", actions : ["pended_posts","post_approval","delete_post"]},
            {subject : "comment", actions : ["delete_comment"]}
        ]
    },

    {
        name : "member",
        permissions : [
            {subject : "group", actions : [""]},
            {subject : "post", actions : [""]},
            {subject : "comment", actions : [""]}

        ]
    },

]

module.exports = Roles