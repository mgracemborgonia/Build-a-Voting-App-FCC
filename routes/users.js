const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
//sign up
router.post("/signup", async (req, res) => {
    const {username, password} = req.body;
    try{
        const hash_password = await bcrypt.hash(password, 10);
        await User.create({
            username,
            password: hash_password
        });
        res.redirect("/login.html");
    }catch(error){
        console.error(error);
        res.status(500).send("Failed to sign up.");
    }
});
//Log In
router.post("/login", async (req, res) => {
    const {username, password} = req.body;
    try{
        const user = await User.findOne({username});
        if(user && await bcrypt.compare(password, user.password)){
            req.session.user = username;
            res.redirect("/mypoll.html");
        }else{
            res.status(401).send("Invalid login.");
        }
    }catch(error){
        console.error(error);
        res.status(500).send("Failed to log in.");
    }
});

module.exports = router;