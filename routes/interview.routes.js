const { Router } = require('express');
const authController = require('../controllers/authController');
const Quest = require('../models/question');
const router = Router();
const { requireAuth, checkUser } = require('../middleware/authMiddleware');


router.get('/add_experience',requireAuth,  authController.add_experience);
router.get('/interviews/:name',requireAuth,  authController.show_experience);
router.post('/add_experience',requireAuth,  authController.add_experience_post);
router.get('/interviews',requireAuth,  authController.interview_get);
router.get('/temp',requireAuth,  (req, res) => res.render('temp'));


module.exports = router;