const visitorModel = require("../models/visitorModel");

const getVisitors = async (req, res) => {
    try {
        const visitors = await visitorModel.find();
        res.status(200).json(visitors);
    } catch (error) {
        console.error('Error fetching visitors:', error);
        res.status(500).json({ message: 'Server error while fetching visitors' });
    }
};

const getTodayVisitors = async (req, res) => {
    try {
        // Get today's date at start (00:00:00) and end (23:59:59)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const visitors = await visitorModel.find({
            timeIn: {
                $gte: today,
                $lt: tomorrow
            }
        }).sort({ timeIn: -1 }); // Sort by timeIn in descending order

        console.log("Fetched today's visitors:", visitors);
        res.status(200).json(visitors);
    } catch (error) {
        console.error('Error fetching today\'s visitors:', error);
        res.status(500).json({ message: 'Server error while fetching today\'s visitors' });
    }
};

const addVisitor = async (req, res) => {
    try {
        // Extract visitor data from the request body
        const {
            name,
            email,
            phone,
            timeIn,
            timeOut,
            assignedEmployee,
            room,
            visitorType
        } = req.body;

        // Base validation for fields required for all visitor types
        if (!name || !email || !phone || !timeIn || !visitorType) {
            return res.status(400).json({
                message: 'Name, email, phone, time in, and visitor type are required fields'
            });
        }

        // Create visitor object with base fields
        let visitorData = {
            name,
            email,
            phone,
            timeIn,
            timeOut,
            visitorType
        };

        // Additional validation and fields for meeting visitor and attendee
        if (visitorType === 'meeting' || visitorType === 'attendee') {
            if (!assignedEmployee || !room) {
                return res.status(400).json({
                    message: 'Assigned employee and room are required for meeting visitors'
                });
            }
            // Add meeting-specific fields
            visitorData.assignedEmployee = assignedEmployee;
            visitorData.room = room;
        }

        // Create a new visitor document
        const newVisitor = await visitorModel.create(visitorData);

        // Send success response
        res.status(201).json({
            message: 'Visitor added successfully',
            visitor: newVisitor
        });
    } catch (error) {
        console.error('Error adding visitor:', error);
        res.status(500).json({ message: 'Server error while adding visitor' });
    }
};

// Update visitor timeout endpoint
const updateVisitorTimeout = async (req, res) => {
    try {
        const { visitorId, timeOut } = req.body;
        
        const updatedVisitor = await visitorModel.findByIdAndUpdate(
            visitorId,
            { timeOut },
            { new: true }
        );

        res.json({
            message: 'Visitor timeout updated successfully',
            visitor: updatedVisitor
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating visitor timeout' });
    }
};

const updateVisitor = async (req, res) => {
    try {
        const { visitorId } = req.params; // Get visitor ID from URL
        const { name, email, phone, timeIn, timeOut, assignedEmployee, room, visitorType } = req.body;

        // Validate that at least one field is provided for an update
        if (!name && !email && !phone && !timeIn && !timeOut && !assignedEmployee && !room && !visitorType) {
            return res.status(400).json({ message: "At least one field must be provided for an update" });
        }

        // Find and update the visitor
        const updatedVisitor = await visitorModel.findByIdAndUpdate(
            visitorId,
            { name, email, phone, timeIn, timeOut, assignedEmployee, room, visitorType },
            { new: true, runValidators: true } // Return the updated document
        );

        if (!updatedVisitor) {
            return res.status(404).json({ message: "Visitor not found" });
        }

        res.status(200).json({
            message: "Visitor updated successfully",
            visitor: updatedVisitor
        });
    } catch (error) {
        console.error("Error updating visitor:", error);
        res.status(500).json({ message: "Server error while updating visitor" });
    }
};


module.exports = { getVisitors, getTodayVisitors, addVisitor, updateVisitorTimeout, updateVisitor };
