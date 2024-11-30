const express = require("express")
const router = express.Router()
const users = require("../controllers/users")






router.post("/api/auth/register",users.Register)
router.post("/api/auth/login",users.Login)
router.get("/api/auth/logout",users.Logout)


module.exports = router