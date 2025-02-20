const roomsModel = require("../models/meetingRooms");

const getRooms = async(req, res) =>{
    try{
        const rooms = await roomsModel.find();

        res.status(200).json(rooms);

    } catch(error){
        console.error('Error fetching rooms', error);
        res.status(500).json({message: 'Internal Server Error'});
    }
};

const addRoom = async (req, res) => {
    try {
        const { roomName, capacity } = req.body;
        if (!roomName || !capacity) {
            return res.status(400).json({ message: "Room name and capacity are required" });
        }

        const existingRoom = await roomsModel.findOne({ roomName });
        if (existingRoom) {
            return res.status(400).json({ message: "Room with this name already exists" });
        }

        const newRoom = await roomsModel.create({
            roomName,
            capacity,
        });

        res.status(201).json({
            message: "Room added successfully",
            room: newRoom,
        });
    } catch (error) {
        console.error("Error adding room:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}; 

module.exports = { getRooms, addRoom}