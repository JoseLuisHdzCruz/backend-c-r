const express = require('express');
const router = express.Router();
const feedbackController = require('../../controllers/Admin/feedbackController');

router.get('/', feedbackController.getFeedbacks);
router.get('/get-questions', feedbackController.getQuestions);
router.post("/submit-feedback", feedbackController.saveFeedback);

module.exports = router;
