const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    timeIn: {
        type: Date,
        required: true
    },
    timeOut: {
        type: Date,
        required: false
    },
    visitorType: {
        type: String,
        required: true,
        enum: ['walk-in', 'meeting', 'attendee']
    },
    assignedEmployee: {
        type: String,
        required: function() {
            return this.visitorType === 'meeting' || this.visitorType === 'attendee';
        }
    },
    room: {
        type: String,
        required: function() {
            return this.visitorType === 'meeting' || this.visitorType === 'attendee';
        }
    }
}, {
    timestamps: true
});

const visitorModel = mongoose.model('Visitor', visitorSchema);

module.exports = visitorModel;