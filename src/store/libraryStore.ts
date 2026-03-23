import { create } from 'zustand';

export interface Playlist {
  id: string;
  name: string;
  itemIds: string[];
  createdAt: string;
}

export interface LibraryState {
  playlists: Playlist[];
  downloadedIds: string[];
  bookmarkedIds: string[];
  createPlaylist: (name: string) => void;
  deletePlaylist: (id: string) => void;
  addToPlaylist: (playlistId: string, itemId: string) => void;
  removeFromPlaylist: (playlistId: string, itemId: string) => void;
  toggleDownload: (itemId: string) => void;
  toggleBookmark: (itemId: string) => void;
  isDownloaded: (itemId: string) => boolean;
  isBookmarked: (itemId: string) => boolean;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  playlists: [
    {
      id: 'pl-1',
      name: 'My Favourites',
      itemIds: ['s-1', 's-3', 'm-1'],
      createdAt: '2026-03-10',
    },
    {
      id: 'pl-2',
      name: 'Sunday Sermons',
      itemIds: ['s-2', 's-4', 's-6'],
      createdAt: '2026-03-15',
    },
  ],
  downloadedIds: ['s-1', 'm-2'],
  bookmarkedIds: ['s-1', 's-5', 'm-1', 'm-3'],

  createPlaylist: (name) =>
    set((state) => ({
      playlists: [
        ...state.playlists,
        {
          id: `pl-${Date.now()}`,
          name,
          itemIds: [],
          createdAt: new Date().toISOString().split('T')[0],
        },
      ],
    })),

  deletePlaylist: (id) =>
    set((state) => ({
      playlists: state.playlists.filter((p) => p.id !== id),
    })),

  addToPlaylist: (playlistId, itemId) =>
    set((state) => ({
      playlists: state.playlists.map((p) =>
        p.id === playlistId && !p.itemIds.includes(itemId)
          ? { ...p, itemIds: [...p.itemIds, itemId] }
          : p
      ),
    })),

  removeFromPlaylist: (playlistId, itemId) =>
    set((state) => ({
      playlists: state.playlists.map((p) =>
        p.id === playlistId
          ? { ...p, itemIds: p.itemIds.filter((i) => i !== itemId) }
          : p
      ),
    })),

  toggleDownload: (itemId) =>
    set((state) => ({
      downloadedIds: state.downloadedIds.includes(itemId)
        ? state.downloadedIds.filter((i) => i !== itemId)
        : [...state.downloadedIds, itemId],
    })),

  toggleBookmark: (itemId) =>
    set((state) => ({
      bookmarkedIds: state.bookmarkedIds.includes(itemId)
        ? state.bookmarkedIds.filter((i) => i !== itemId)
        : [...state.bookmarkedIds, itemId],
    })),

  isDownloaded: (itemId) => get().downloadedIds.includes(itemId),
  isBookmarked: (itemId) => get().bookmarkedIds.includes(itemId),
}));
