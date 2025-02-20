const express = require('express');
const visitorControllers = require("../controllers/visitorController");
const router = express.Router();

router.get('/getVisitors', visitorControllers.getVisitors);
router.post('/addVisitor', visitorControllers.addVisitor);
router.get('/getTodayVisitors', visitorControllers.getTodayVisitors);
router.put('/updateTimeout', visitorControllers.updateVisitorTimeout);
router.put('/updateVisitor/:visitorId', visitorControllers.updateVisitor);

module.exports = router;