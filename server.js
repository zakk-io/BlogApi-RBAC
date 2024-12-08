const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
require("dotenv").config()
const cookieparser = require("cookie-parser")
const users = require("./routes/users")
const groups = require("./routes/groups")
const posts = require("./routes/posts")
const comments = require("./routes/comments")
const {HandlingJsonSyntaxError,AuthMiddleware} = require("./middlewares")
const GroupPermissions = require("./Permissions/group")
const Groups = require("./models/groups")
const Posts = require("./models/posts")
//packages



//settings
const app = express()
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected!'));

app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs")
//settings





//middlewares
app.use(express.json())
app.use(cookieparser())
app.use(express.static(path.join(__dirname,'public')))
app.use(HandlingJsonSyntaxError)
//middlewares

//templates endpoints
app.use(users)
app.get('/register',(req,res) => {
    res.render('register')
})

app.get('/login',(req,res) => {
    res.render('login')
})
//templates endpoints


//templates endpoints
app.use(groups)
app.use(posts)
app.use(comments)

app.use(AuthMiddleware)

app.get('/dashbaord/:group_id',async (req,res) => {
    const user = req.user
    const data = {
        user,
    }
    res.render('dashbaord',data)
})


app.get('/dashbaord/posts',(req,res) => {
    res.render('dashbaord-posts')
})

app.get('*',(req,res) => {
    res.render('404')
})
//templates endpoints



app.listen(2000,() => console.log("server listening on port 2000"))