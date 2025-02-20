const express = require('express');
const visitorControllers = require("../controllers/visitorController");
const router = express.Router();

router.get('/getVisitors', visitorControllers.getVisitors);
router.post('/addVisitor', visitorControllers.addVisitor);
router.get('/getTodayVisitors', visitorControllers.getTodayVisitors);

module.exports = router;