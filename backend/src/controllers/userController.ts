import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { User, Playlist, PlaylistItem, Bookmark, Notification, PrayerRequest, Sermon } from '../models';
import { success } from '../utils/response';
import { AppError } from '../middleware/errorHandler';

// ── Profile ──

export const updateProfileValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('notificationsEnabled').optional().isBoolean(),
];

export async function updateProfile(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array()[0].msg });
    return;
  }

  const user = await User.findByPk(req.user!.id);
  if (!user) throw new AppError('User not found', 404);

  const { name, notificationsEnabled } = req.body;
  if (name !== undefined) user.name = name;
  if (notificationsEnabled !== undefined) user.notificationsEnabled = notificationsEnabled;

  await user.save();
  success(res, user.toSafeJSON());
}

// ── Playlists ──

export const createPlaylistValidation = [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Playlist name required (1-100 chars)'),
];

export async function getPlaylists(req: Request, res: Response): Promise<void> {
  const playlists = await Playlist.findAll({
    where: { userId: req.user!.id },
    include: [
      {
        model: PlaylistItem,
        as: 'items',
        include: [{ model: Sermon, as: 'sermon' }],
      },
    ],
    order: [['created_at', 'DESC']],
  });

  success(res, playlists);
}

export async function createPlaylist(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array()[0].msg });
    return;
  }

  const playlist = await Playlist.create({
    userId: req.user!.id,
    name: req.body.name,
  });

  success(res, playlist, 201);
}

export async function deletePlaylist(req: Request, res: Response): Promise<void> {
  const playlist = await Playlist.findOne({
    where: { id: req.params.id, userId: req.user!.id },
  });

  if (!playlist) throw new AppError('Playlist not found', 404);

  // Delete items first, then playlist
  await PlaylistItem.destroy({ where: { playlistId: playlist.id } });
  await playlist.destroy();

  success(res, { message: 'Playlist deleted' });
}

export async function addToPlaylist(req: Request, res: Response): Promise<void> {
  const { playlistId, sermonId } = req.body;

  const playlist = await Playlist.findOne({
    where: { id: playlistId, userId: req.user!.id },
  });
  if (!playlist) throw new AppError('Playlist not found', 404);

  const sermon = await Sermon.findByPk(sermonId);
  if (!sermon) throw new AppError('Sermon not found', 404);

  // Check for duplicate
  const existing = await PlaylistItem.findOne({
    where: { playlistId, sermonId },
  });
  if (existing) throw new AppError('Already in playlist', 409);

  // Get next sort order
  const maxOrder = await PlaylistItem.max('sortOrder', {
    where: { playlistId },
  }) as number || 0;

  const item = await PlaylistItem.create({
    playlistId,
    sermonId,
    sortOrder: maxOrder + 1,
  });

  success(res, item, 201);
}

export async function removeFromPlaylist(req: Request, res: Response): Promise<void> {
  const { playlistId, sermonId } = req.params;

  const playlist = await Playlist.findOne({
    where: { id: playlistId, userId: req.user!.id },
  });
  if (!playlist) throw new AppError('Playlist not found', 404);

  const deleted = await PlaylistItem.destroy({
    where: { playlistId, sermonId },
  });

  if (!deleted) throw new AppError('Item not in playlist', 404);

  success(res, { message: 'Removed from playlist' });
}

// ── Bookmarks ──

export async function getBookmarks(req: Request, res: Response): Promise<void> {
  const bookmarks = await Bookmark.findAll({
    where: { userId: req.user!.id },
    include: [{ model: Sermon, as: 'sermon' }],
    order: [['created_at', 'DESC']],
  });

  success(res, bookmarks);
}

export async function toggleBookmark(req: Request, res: Response): Promise<void> {
  const { sermonId } = req.body;

  const sermon = await Sermon.findByPk(sermonId);
  if (!sermon) throw new AppError('Sermon not found', 404);

  const existing = await Bookmark.findOne({
    where: { userId: req.user!.id, sermonId },
  });

  if (existing) {
    await existing.destroy();
    success(res, { bookmarked: false });
  } else {
    await Bookmark.create({ userId: req.user!.id, sermonId });
    success(res, { bookmarked: true });
  }
}

// ── Notifications ──

export async function getNotifications(req: Request, res: Response): Promise<void> {
  const notifications = await Notification.findAll({
    where: { userId: req.user!.id },
    order: [['created_at', 'DESC']],
    limit: 50,
  });

  success(res, notifications);
}

export async function markNotificationRead(req: Request, res: Response): Promise<void> {
  const notification = await Notification.findOne({
    where: { id: req.params.id, userId: req.user!.id },
  });

  if (!notification) throw new AppError('Notification not found', 404);

  notification.isRead = true;
  await notification.save();

  success(res, notification);
}

export async function markAllNotificationsRead(req: Request, res: Response): Promise<void> {
  await Notification.update(
    { isRead: true },
    { where: { userId: req.user!.id, isRead: false } }
  );

  success(res, { message: 'All notifications marked as read' });
}

// ── Prayer Requests ──

export const prayerRequestValidation = [
  body('message').trim().isLength({ min: 5, max: 2000 }).withMessage('Prayer request must be 5-2000 characters'),
];

export async function submitPrayerRequest(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array()[0].msg });
    return;
  }

  const prayer = await PrayerRequest.create({
    userId: req.user!.id,
    message: req.body.message,
  });

  success(res, prayer, 201);
}

export async function getMyPrayerRequests(req: Request, res: Response): Promise<void> {
  const requests = await PrayerRequest.findAll({
    where: { userId: req.user!.id },
    order: [['created_at', 'DESC']],
  });

  success(res, requests);
}
