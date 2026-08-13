const express = require('express');
const router = express.Router();

const {
  createBkk,
  getAllBkk,
  getSingleBkk,
  updateBkk,
  deleteBkk
} = require('../controllers/bkkController');

router.get('/', getAllBkk);
router.get('/:id', getSingleBkk);
router.post('/', createBkk);
router.put('/:id', updateBkk);
router.delete('/:id', deleteBkk);

module.exports = router;
