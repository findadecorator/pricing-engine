const express = require('express');
const router = express.Router();

const {
  getAllDecorators,
  getDecoratorById,
  updateDecorator,
  deleteDecorator
} = require('../controllers/decoratorController');

router.get('/', getAllDecorators);
router.get('/:id', getDecoratorById);
router.put('/:id', updateDecorator);
router.delete('/:id', deleteDecorator);

module.exports = router;
