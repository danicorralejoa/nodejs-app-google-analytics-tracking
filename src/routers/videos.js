const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videos');

router.get('/video', videoController.getVideo);

module.exports = router