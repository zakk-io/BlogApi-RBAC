const express = require("express")
const router = express.Router()
const groups = require("../controllers/groups")
const {AuthMiddleware} = require("../middlewares")
const GroupPermissions = require("../Permissions/group")



router.get("/api/groups/:group_id/join",groups.JoinGroup)
router.use(AuthMiddleware)
router.post("/api/groups",groups.CreateGroup)
router.put("/api/groups/:group_id",GroupPermissions("update"),groups.UpdateGroup)
router.delete("/api/groups/:group_id",GroupPermissions("delete"),groups.DeleteGroup)
router.post("/api/groups/:group_id",GroupPermissions("invite_user"),groups.InviteToGroup)
router.post("/api/groups/:group_id/UpdateRole",GroupPermissions("update_role"),groups.UpdateRole)
router.post("/api/groups/:group_id/kick",GroupPermissions("kick_user"),groups.KickUser)







module.exports = router