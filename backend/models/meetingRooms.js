const mongoose = require("mongoose");

const meetingRooms = new mongoose.Schema({
    roomName:{
        type: String,
        required: true,
    },
    capacity:{
        type: Number,
        required: true,
    },
});

const MeetingRooms = new mongoose.model("MeetingRooms", meetingRooms);
module.exports = MeetingRooms;