const { Router } = require('express');
const authController = require('../controllers/authController');
const Quest = require('../models/question');
const router = Router();
const { requireAuth, checkUser } = require('../middleware/authMiddleware');




router.get('/topics',requireAuth, authController.get_topics);
router.get('/topics/:id',requireAuth, authController.get_question_by_topicsName);
router.get('/questions/:name',requireAuth, authController.get_question_by_name);
router.get('/form',requireAuth, authController.form_get);
router.post('/form',requireAuth, authController.form_post);

module.exports = router;