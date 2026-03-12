import { useState, useCallback, useEffect } from "react";

export type BookmarkCategory = "news" | "usecases";

export interface Bookmark {
  id: string;
  category: BookmarkCategory;
  title: string;
  url: string;
  source: string;
  savedAt: string;
  data: any; // full item data for rendering
}

const STORAGE_KEY = "mv-intelligence-bookmarks";

function loadBookmarks(): Bookmark[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveBookmarks(bookmarks: Bookmark[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(loadBookmarks);

  useEffect(() => {
    saveBookmarks(bookmarks);
  }, [bookmarks]);

  const isBookmarked = useCallback(
    (id: string) => bookmarks.some((b) => b.id === id),
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    (item: Omit<Bookmark, "savedAt">) => {
      setBookmarks((prev) => {
        const exists = prev.some((b) => b.id === item.id);
        if (exists) return prev.filter((b) => b.id !== item.id);
        return [...prev, { ...item, savedAt: new Date().toISOString() }];
      });
    },
    []
  );

  const getByCategory = useCallback(
    (category: BookmarkCategory) => bookmarks.filter((b) => b.category === category),
    [bookmarks]
  );

  const removeBookmark = useCallback((id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  return { bookmarks, isBookmarked, toggleBookmark, getByCategory, removeBookmark };
}
