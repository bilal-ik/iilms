'use strict';

const { Router } = require('express');
const { chat, getChatHistory } = require('../controllers/chat.controller');

const router = Router();

router.post('/',              chat);                    // no auth required
router.get('/history/:session_id', getChatHistory);

module.exports = router;
