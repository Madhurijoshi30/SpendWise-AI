const Transaction = require('../models/Transaction');
const { parseExpense } = require('../services/groqService');

// @desc    Parse and create expense from natural language
// @route   POST /api/expenses/parse
// @access  Private
const createExpense = async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === '') {
    return res.status(400).json({ message: 'Text is required' });
  }

  try {
    const parsed = await parseExpense(text);

    if (!parsed) {
      return res.status(400).json({
        message: 'Could not parse expense. Please include an amount in your text.'
      });
    }

    const transaction = await Transaction.create({
      userId: req.user._id,
      amount: parsed.amount,
      category: parsed.category,
      description: parsed.description,
      date: parsed.date,
      rawText: text
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all expenses for logged in user
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate, search } = req.query;

    const filter = { userId: req.user._id };

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: 'i' } },
        { rawText: { $regex: search, $options: 'i' } }
      ];
    }

    const expenses = await Transaction.find(filter)
      .sort({ date: -1, createdAt: -1 });

    res.json(expenses);
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res) => {
  try {
    const expense = await Transaction.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { amount, category, description, date } = req.body;

    if (amount !== undefined) expense.amount = amount;
    if (category) expense.category = category;
    if (description !== undefined) expense.description = description;
    if (date) expense.date = date;

    const updated = await expense.save();
    res.json(updated);
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    const expense = await Transaction.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await expense.deleteOne();
    res.json({ message: 'Expense removed' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get expense statistics
// @route   GET /api/expenses/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Total spending
    const totalResult = await Transaction.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const total = totalResult[0]?.total || 0;

    // Category breakdown
    const categoryBreakdown = await Transaction.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);

    // Monthly totals (last 12 months)
    const monthlyTotals = await Transaction.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 12 }
    ]);

    // This month's total
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const thisMonthTotal = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
          date: {
            $gte: new Date(`${thisMonth}-01`),
            $lte: new Date(`${thisMonth}-31`)
          }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Average daily spending (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dailyAvg = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: thirtyDaysAgo }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const avgDaily = (dailyAvg[0]?.total || 0) / 30;

    res.json({
      total,
      thisMonth: thisMonthTotal[0]?.total || 0,
      avgDaily: Math.round(avgDaily * 100) / 100,
      categoryBreakdown: categoryBreakdown.map(c => ({
        category: c._id,
        total: c.total,
        count: c.count
      })),
      monthlyTotals: monthlyTotals.map(m => ({
        month: m._id,
        total: m.total
      }))
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getStats
};
