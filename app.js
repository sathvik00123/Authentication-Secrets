
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine","ejs");



mongoose.connect("mongodb://localhost:27017/userDB",{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    family : 4
});

const userSchema = new mongoose.Schema({
    email : String,
    password : String
});


userSchema.plugin(encrypt, {secret : process.env.SECRET, encryptedFields : ["password"] });

const User = new mongoose.model("User",userSchema);



app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    const newUser = new User({
        email : req.body.username,
        password : req.body.password
    })

    newUser.save()  // encryption takes place
    .then(function(){
        res.render("secrets");
    }).catch(function(err){
        console.log(err);
    })
})


app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email : username})  // decryption takes place
    .then(function(foundUser){
        if(foundUser.password === password){
            res.render("secrets");
        }
    }).catch(function(err){
        console.log(err);
    })
})







app.listen(3000,function(){
    console.log("server started at port 3000.");
});




