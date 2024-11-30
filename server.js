const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
require("dotenv").config()
const cookieparser = require("cookie-parser")
const users = require("./routes/users")
const {HandlingJsonSyntaxError,AuthMiddleware} = require("./middlewares")
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
app.use(users)
//middlewares




//templates endpoints
app.get('/dashbaord',(req,res) => {
    res.render('dashbaord')
})

app.get('/dashbaord/posts',(req,res) => {
    res.render('dashbaord-posts')
})

app.get('/register',(req,res) => {
    res.render('register')
})

app.get('*',(req,res) => {
    res.render('404')
})
//templates endpoints


app.listen(2000,() => console.log("server listening on port 2000"))