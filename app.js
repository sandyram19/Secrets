require('dotenv').config();
const express=require("express");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const encrypt=require("mongoose-encryption");
const { default: mongoose, Schema } = require("mongoose");

const app=express();

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://0.0.0.0:27017/userDB");

const userSchema=new mongoose.Schema({
    email: String,
    password: String
});


  

userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields: ["password"]}); 

const User=mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home")
})

app.get("/login",function(req,res){
    res.render("login")
})

app.get("/register",function(req,res){
    res.render("register")
})

app.post("/register",function(req,res){
    const newUser=new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save().then(function(){res.render("secrets");}).catch(function(err){console.log(err);}) 
})

app.post("/login",function(req,res){
    const username=req.body.username;
    const password=req.body.password;

    User.findOne({email:username}).then(function(foundUser){
        if (foundUser){
            if(foundUser.password === password){
                res.render("secrets");
            }
        }
    }).catch(function(err){res.render(err)})
})





app.listen(3000,function(){
    console.log("Server started om port 3000");
});

