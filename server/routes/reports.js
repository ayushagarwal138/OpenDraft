const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { getReports, updateReport, deleteReport, createReport } = require('../controllers/reportController');

const router = express.Router();

router.use(protect);

// Admin only
router.get('/', authorize('admin'), getReports);
router.put('/:id', authorize('admin'), updateReport);
router.delete('/:id', authorize('admin'), deleteReport);

// Any authenticated user can create a report
router.post('/', createReport);

module.exports = router;