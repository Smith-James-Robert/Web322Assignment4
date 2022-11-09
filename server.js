var HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const path= require("path");
const bodyParser = require("body-parser");
const multer = require("multer");
const { test } = require("media-typer");
const e = require("express");
var qs = require('qs');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://JamesSmith:8bhFGM5LcSPvXrb@senecaweb322.stg0tk4.mongodb.net/testDatabase?retryWrites=true&w=majority")
var Schema = mongoose.Schema;
var accountSchema = new Schema({

    "user":{
        "type":String,
        "unique":true
    },
    "phone":Number,
    "pass":String,//TO DO ENCRYPT PASSWORD
    "fName":String,
    "lName":String,
    "emailAddress":{
        "type":String,
        "unique":true
    },
    "company":{
        "type": String,
        "default": -1
    },
    "adrs1":{
        "type":String,
        "default": -1
    },
    "adrs2":{
        "type":String,
        "default": -1
    },
    "admin":{
        "type":Boolean,
        "default":false
    }
});
var Account = mongoose.model("as4Account",accountSchema);
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');



app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
    res.redirect('/blog');
    //res.send("Hello World!");
});
app.get("/registration", function(req,res){
    res.render('registration',{
        layout:false
    });
})
app.get("/blog", function(req,res){
    res.sendFile(path.join(__dirname,"blog.html"));
})     
/* 
app.get("/article/:id", function(req,res){
    res.sendFile(path.join(__dirname,"read_more.html"));
})
*/
app.get("/login", function(req,res){
   // res.sendFile(path.join(__dirname,"login.html"));
   res.render('login',{
    layout:false
   });
})
app.get("/dashboard",function (req,res){
    res.sendFile(path.join(__dirname,"dashboard.html"));
})
app.post("/login",function(req,res){
 

    const noSpecial=/[!-\/:-@[-`{-~]/;
 var username=req.body.username;
 var userName=username;
 var password=req.body.password;
 var passWord=password;
 var validPassword=false;
Account.find({
username:userName,
password:passWord
}).exec().then((accounts))
{
    accounts=accounts.map(value=>value.toObject());
    console.log(accounts);
}
 if (password!='' && noSpecial.test(password) && password.length>=8)
 {
    validPassword=true;
 }
 var validUser=false;
 if (username!='' && !noSpecial.test(username))
 {
validUser=true;
 }
 var someData={
    username:req.body.username,
    password:req.body.password,
    passValid:!validPassword,
    userValid:!validUser
 }
 console.log(req.body.username);
 console.log(username);
 //&& noSpecial.test(username)
 console.log(validPassword)
 if (username!='' && validPassword && !noSpecial.test(username))
 {
 console.log("Your password is: " + password);
 console.log("Your username is: " + username);
 res.redirect('/dashboard');
 }
 else{
   // res.redirect('/login');
   console.log("apple");
    res.render('login',{
        data:someData,
        layout:false
    })
 }
 })
 app.post("/registration",function(req,res){    
    var username=req.body.username;
    var password=req.body.password;
    var email=req.body.email;
    var firstName=req.body.firstName;
    var lastName=req.body.lastName;
    var phone=req.body.phone;
    var companyName=req.body.companyName;
    var address1=req.body.address1;
    var address2=req.body.address2;
    var valid=true;
    var userValid=true;
    var passValid=true;
    var emailValid=true;
    var phoneValid=true;
    var firstValid=true;
    var lastValid=true;

    var usernameError= false;
    var emailError=false;

    const noSpecial=/[!-\/:-@[-`{-~]/;
    const phoneNumber=/[0-9]{10}/
    
    if (username=='' || noSpecial.test(username))
    {
        valid=false;
        userValid=false;
    }
    if (password=='' || !noSpecial.test(password) || password.length<8)
    {
        valid=false;
        passValid=false;
    }
    if (!email.includes('@'))
    {   
        valid=false;
        emailValid=false;
    }
    if (firstName=='') //No additional Validation required
    {
        valid=false;
        firstValid=false;
    }
    if (lastName=='') //No additional Validation required
    {
        valid=false;
        lastValid=false;
    }
    if (!phoneNumber.test(phone))
    {
        valid=false;
        phoneValid=false;
    }


    console.log("Valid =" + valid);
    console.log(email);
    console.log(firstName);
    console.log(lastName);
    console.log(phone);
    console.log(companyName);
    console.log(address1);
    console.log(address2);
    console.log(username);
    console.log(password);
    console.log(userValid);
    console.log(passValid);
    var someData={
        phoneNum:phone,
        validPhone:!phoneValid,
        user:username,
        validUser:!userValid,
        pass:password,
        validPass:!passValid,
        emailAddress:email,
        validEmail:!emailValid,
        FirstName:firstName,
        validFirst:!firstValid,
        LastName:lastName,
        validLast:!lastValid,
        usernameError:false
    }
    if (valid)
    {
        var account = new Account ({
            user:username,
            phone:phone,
            pass:password,
            fName:firstName,
            lName:lastName,
            emailAddress:email,
            company:companyName,
            adrs1:address1,
            adrs2:address2
        })
        Account.find({user: someData.user}, "user" ).exec().then((accounts)=>
        {
            accounts=accounts.map(value => value.toObject());
            console.log("ACCOUNT FOUND=");
            console.log(accounts);
            console.log(accounts.user);
            if (accounts.user!=undefined)
            {
                console.log("AccountValue");
                usernameError=true;
            }
        }
        ).catch(

        )
        Account.find({emailAddress: someData.emailAddress}, "emailAddress").exec().then((accounts)=>
        {
            accounts=accounts.map(value=>value.toObject());
            console.log("Email FOUND=");
            console.log(accounts.emailAddress);
            if (accounts.emailAddress!=undefined)
            {
                console.log("EmailValue");
                emailError=true;
            }
        }).catch()
        account.save().then(()=>{
            console.log(account);
        }).catch(err=>{
            //JUST DO IT RIGHT EVEN IF ITS REALLY ANNOYING TO DO RIGHT
            valid=false;
            console.log("valid="+valid);
            someData.validUser=usernameError;
            someData.usernameError=emailError;
            console.log(someData);
            res.render('registration',{
                data:someData,
                layout:false
                })
           // res.redirect('/blog');
        });
    //Send data to database.
    }
    else
    {
        res.render('registration',{
            data:someData,
            layout:false
        })
    }
 })
app.get("/iconsmall.png",function(req,res){
    res.sendFile(path.join(__dirname,"icon.png"));
})
app.get("/twitter",function(req,res){
    res.sendFile(path.join(__dirname,"Tweeter.png"));
})
app.get("/article/1",function(req,res){
    res.sendFile(path.join(__dirname,"article1.html"));
})
app.get("/article/2",function(req,res){
    res.sendFile(path.join(__dirname,"article2.html"));
})
app.get("/article/3",function(req,res){
    res.sendFile(path.join(__dirname,"article3.html"));
})
/*app.use((req, res) => {
   res.redirect('/');
  });
*/
// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT);
//sequelizer object .sync().then(() => {
//    app.listen(HTTP_PORT)
//})
