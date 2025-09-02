const Report = require('../models/Report');

// @desc    Get all reports (Admin only)
// @route   GET /api/reports
// @access  Private (Admin)
const getReports = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate('reporter', 'name avatar');
    const total = await Report.countDocuments();
    res.json({ success: true, count: reports.length, total, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching reports', error: error.message });
  }
};

// @desc    Update a report (Admin only)
// @route   PUT /api/reports/:id
// @access  Private (Admin)
const updateReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating report', error: error.message });
  }
};

// @desc    Delete a report (Admin only)
// @route   DELETE /api/reports/:id
// @access  Private (Admin)
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    await report.deleteOne();
    res.json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting report', error: error.message });
  }
};

// @desc    Create a report (any user)
// @route   POST /api/reports
// @access  Private
const createReport = async (req, res) => {
  try {
    const { type, targetId, reason } = req.body;
    if (!['post', 'comment', 'user'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid report type' });
    }
    const report = await Report.create({
      reporter: req.user.id,
      type,
      targetId,
      reason,
    });
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating report', error: error.message });
  }
};

module.exports = {
  getReports,
  updateReport,
  deleteReport,
  createReport,
};