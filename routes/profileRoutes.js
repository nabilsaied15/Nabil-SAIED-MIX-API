const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Place specific route before param routes to avoid being shadowed
router.get('/user-full/:id', profileController.getUserFullData);
router.get('/', profileController.listProfiles);
router.post('/', profileController.createProfile);
router.get('/:userId', profileController.getProfile);
router.put('/:userId', profileController.updateProfile);

module.exports = router;