const express = require("express")
const router = express.Router()
const groups = require("../controllers/groups")
const {AuthMiddleware} = require("../middlewares")
const GroupPermissions = require("../Permissions/group")


router.use(AuthMiddleware)

router.post("/api/groups",groups.CreateGroup)
router.put("/api/groups/:group_id",GroupPermissions("update"),groups.UpdateGroup)
router.delete("/api/groups/:group_id",GroupPermissions("delete"),groups.DeleteGroup)


//expermental
router.get("/api/groups/:group_id/join",groups.JoinGroup)




module.exports = router