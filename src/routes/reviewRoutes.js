const express = require('express');
const router = express.Router();

const {
  addReview,
  getReviewsForDecorator
} = require('../controllers/reviewController');

router.post('/', addReview);
router.get('/:decoratorId', getReviewsForDecorator);

module.exports = router;
