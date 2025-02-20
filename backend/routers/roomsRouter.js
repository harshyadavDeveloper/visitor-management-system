const express = require('express');
const roomsController = require("../controllers/roomsController");
const router = express.Router();

router.route('/addroom').post(roomsController.addRoom);
router.route('/getrooms').get(roomsController.getRooms);

module.exports = router;