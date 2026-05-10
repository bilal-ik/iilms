'use strict';

const { Router } = require('express');
const { verifyToken } = require('../middleware/auth');
const { getMyProfile, updateMyProfile, getPublicProfile } = require('../controllers/profile.controller');

const router = Router();

router.get('/me',   verifyToken, getMyProfile);
router.put('/me',   verifyToken, updateMyProfile);
router.get('/:id',  getPublicProfile);   // public

module.exports = router;
