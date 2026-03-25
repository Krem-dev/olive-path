import { Router } from 'express';
import {
  getTodayDevotion,
  getDevotions,
  getSermons,
  getSermonById,
  getRecentSermons,
  getQAItems,
  getQACategories,
} from '../controllers/contentController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Devotions
router.get('/devotions/today', asyncHandler(getTodayDevotion));
router.get('/devotions', asyncHandler(getDevotions));

// Sermons (includes preaching + motivation)
router.get('/sermons', asyncHandler(getSermons));
router.get('/sermons/recent', asyncHandler(getRecentSermons));
router.get('/sermons/:id', asyncHandler(getSermonById));

// Q&A
router.get('/qa', asyncHandler(getQAItems));
router.get('/qa/categories', asyncHandler(getQACategories));

export default router;
