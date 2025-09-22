const express = require("express");
const router = express.Router();
const Poll = require("../models/Poll");
//create poll
router.post("/createpoll", async (req, res) => {
    const username = req.session.user;
    if(!username){
        return res.status(401).send("Invalid login.");
    }
    const {question, description} = req.body;
    const options = description.split(",").map(des => des.trim()).filter(Boolean);
    if(!question || !options){
        res.status(400).send("Please input a question and options.");
    }else if(options.length < 2){
        res.status(400).send("Please input at least 2 options.");
    }
    try{
        await Poll.create({
            username: username,
            question,
            options,
            votes: Array(options.length).fill(0)
        });
        res.redirect(`/mypoll.html?user=${username}`);
    }catch(error){
        console.error(error);
        res.status(500).send("Failed to create poll.");
    }
});
//your polls
router.get("/mypolls", async (req, res) => {
    try {
        const polls = await Poll.find();
        console.log(polls);
        res.json(polls);
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to load polls.");
    }
});
//number of votes
router.post("/votes", async (req, res) => {
    const {pollId, optionIndex, username} = req.body;
    try{
        const poll = await Poll.findById(pollId);
        if(!poll){
            return res.status(404).send("Poll not found.");
        }
        if(username || !username){
            poll.votes[optionIndex] += 1;
            await poll.save();
        }
        res.status(200).send("Successfully registered your vote.");
    }catch(error){
        console.error(error);
        res.status(500).send("Failed to register vote.");
    }
});

module.exports = router;