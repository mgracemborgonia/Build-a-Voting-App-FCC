const mongoose = require("mongoose");
const {Schema} = mongoose;
const PollSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    options: [String],
    votes: {
        type: [Number],
        default: []
    }
});
module.exports = mongoose.model("Poll", PollSchema);