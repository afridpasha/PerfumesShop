const express = require('express');
const router = express.Router();
const {
  getPerfumes,
  getPerfumeById,
  deletePerfume,
  createPerfume,
  updatePerfume,
  createPerfumeReview,
  getTopPerfumes,
} = require('../controllers/perfumeController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getPerfumes).post(protect, admin, createPerfume);
router.route('/top').get(getTopPerfumes);
router
  .route('/:id')
  .get(getPerfumeById)
  .delete(protect, admin, deletePerfume)
  .put(protect, admin, updatePerfume);
router.route('/:id/reviews').post(protect, createPerfumeReview);

module.exports = router; 