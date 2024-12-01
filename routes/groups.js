const express = require("express")
const router = express.Router()
const groups = require("../controllers/groups")
const {AuthMiddleware} = require("../middlewares")

router.use(AuthMiddleware)

router.post("/api/groups",groups.CreateGroup)



module.exports = router