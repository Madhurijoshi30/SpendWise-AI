const express = require('express');
const {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getStats
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/parse', protect, createExpense);
router.get('/', protect, getExpenses);
router.get('/stats', protect, getStats);
router.put('/:id', protect, updateExpense);
router.delete('/:id', protect, deleteExpense);

module.exports = router;
