import User from './User';
import Devotion from './Devotion';
import Sermon from './Sermon';
import QAItem from './QAItem';
import Notification from './Notification';
import Playlist from './Playlist';
import PlaylistItem from './PlaylistItem';
import Bookmark from './Bookmark';
import PrayerRequest from './PrayerRequest';

// ── Associations ──

// User → Notifications (1:M)
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User → Playlists (1:M)
User.hasMany(Playlist, { foreignKey: 'userId', as: 'playlists' });
Playlist.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Playlist → PlaylistItems (1:M)
Playlist.hasMany(PlaylistItem, { foreignKey: 'playlistId', as: 'items' });
PlaylistItem.belongsTo(Playlist, { foreignKey: 'playlistId', as: 'playlist' });

// Sermon → PlaylistItems (1:M)
Sermon.hasMany(PlaylistItem, { foreignKey: 'sermonId', as: 'playlistItems' });
PlaylistItem.belongsTo(Sermon, { foreignKey: 'sermonId', as: 'sermon' });

// User → Bookmarks (1:M)
User.hasMany(Bookmark, { foreignKey: 'userId', as: 'bookmarks' });
Bookmark.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Sermon → Bookmarks (1:M)
Sermon.hasMany(Bookmark, { foreignKey: 'sermonId', as: 'bookmarks' });
Bookmark.belongsTo(Sermon, { foreignKey: 'sermonId', as: 'sermon' });

// User → PrayerRequests (1:M)
User.hasMany(PrayerRequest, { foreignKey: 'userId', as: 'prayerRequests' });
PrayerRequest.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Many-to-Many: User ↔ Sermon through Bookmarks
User.belongsToMany(Sermon, { through: Bookmark, foreignKey: 'userId', otherKey: 'sermonId', as: 'bookmarkedSermons' });
Sermon.belongsToMany(User, { through: Bookmark, foreignKey: 'sermonId', otherKey: 'userId', as: 'bookmarkedBy' });

// Many-to-Many: Playlist ↔ Sermon through PlaylistItems
Playlist.belongsToMany(Sermon, { through: PlaylistItem, foreignKey: 'playlistId', otherKey: 'sermonId', as: 'sermons' });
Sermon.belongsToMany(Playlist, { through: PlaylistItem, foreignKey: 'sermonId', otherKey: 'playlistId', as: 'inPlaylists' });

export {
  User,
  Devotion,
  Sermon,
  QAItem,
  Notification,
  Playlist,
  PlaylistItem,
  Bookmark,
  PrayerRequest,
};
