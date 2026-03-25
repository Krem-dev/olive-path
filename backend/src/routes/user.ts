import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  updateProfile,
  updateProfileValidation,
  getPlaylists,
  createPlaylist,
  createPlaylistValidation,
  deletePlaylist,
  addToPlaylist,
  removeFromPlaylist,
  getBookmarks,
  toggleBookmark,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  submitPrayerRequest,
  prayerRequestValidation,
  getMyPrayerRequests,
} from '../controllers/userController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Profile
router.put('/profile', updateProfileValidation, asyncHandler(updateProfile));

// Playlists
router.get('/playlists', asyncHandler(getPlaylists));
router.post('/playlists', createPlaylistValidation, asyncHandler(createPlaylist));
router.delete('/playlists/:id', asyncHandler(deletePlaylist));
router.post('/playlists/items', asyncHandler(addToPlaylist));
router.delete('/playlists/:playlistId/items/:sermonId', asyncHandler(removeFromPlaylist));

// Bookmarks
router.get('/bookmarks', asyncHandler(getBookmarks));
router.post('/bookmarks/toggle', asyncHandler(toggleBookmark));

// Notifications
router.get('/notifications', asyncHandler(getNotifications));
router.put('/notifications/:id/read', asyncHandler(markNotificationRead));
router.put('/notifications/read-all', asyncHandler(markAllNotificationsRead));

// Prayer Requests
router.post('/prayer-requests', prayerRequestValidation, asyncHandler(submitPrayerRequest));
router.get('/prayer-requests', asyncHandler(getMyPrayerRequests));

export default router;
