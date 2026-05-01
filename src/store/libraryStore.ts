import { create } from 'zustand';
import { bookmarksApi } from '../api/bookmarks';

/**
 * Tracks which sermons/motivations the user has saved or downloaded.
 *
 * Bookmarks sync with the backend (`/bookmarks/toggle`).
 * Downloads stay local for now — when the offline-download endpoint is wired up,
 * `toggleDownload` will become async and call it.
 */
export interface LibraryState {
  bookmarkedIds: number[];
  downloadedIds: number[];
  bookmarksHydrated: boolean;

  hydrateBookmarks: () => Promise<void>;
  toggleBookmark: (sermonId: number) => Promise<void>;
  toggleDownload: (sermonId: number) => void;
  isBookmarked: (sermonId: number) => boolean;
  isDownloaded: (sermonId: number) => boolean;
  reset: () => void;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  bookmarkedIds: [],
  downloadedIds: [],
  bookmarksHydrated: false,

  hydrateBookmarks: async () => {
    try {
      const list = await bookmarksApi.list();
      set({
        bookmarkedIds: list.map((b) => b.sermonId),
        bookmarksHydrated: true,
      });
    } catch {
      // Network or auth issue — leave state alone, screens still function
      set({ bookmarksHydrated: true });
    }
  },

  toggleBookmark: async (sermonId) => {
    // Optimistic update
    const currentlyBookmarked = get().bookmarkedIds.includes(sermonId);
    set((state) => ({
      bookmarkedIds: currentlyBookmarked
        ? state.bookmarkedIds.filter((id) => id !== sermonId)
        : [...state.bookmarkedIds, sermonId],
    }));
    try {
      await bookmarksApi.toggle(sermonId);
    } catch {
      // Revert on failure
      set((state) => ({
        bookmarkedIds: currentlyBookmarked
          ? [...state.bookmarkedIds, sermonId]
          : state.bookmarkedIds.filter((id) => id !== sermonId),
      }));
    }
  },

  toggleDownload: (sermonId) =>
    set((state) => ({
      downloadedIds: state.downloadedIds.includes(sermonId)
        ? state.downloadedIds.filter((id) => id !== sermonId)
        : [...state.downloadedIds, sermonId],
    })),

  isBookmarked: (sermonId) => get().bookmarkedIds.includes(sermonId),
  isDownloaded: (sermonId) => get().downloadedIds.includes(sermonId),

  reset: () => set({ bookmarkedIds: [], downloadedIds: [], bookmarksHydrated: false }),
}));
