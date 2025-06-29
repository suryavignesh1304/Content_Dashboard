import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ContentItem {
  id: string;
  type: 'news' | 'movie' | 'social';
  title: string;
  description: string;
  image?: string;
  url?: string;
  author?: string;
  publishedAt?: string;
  category?: string;
  data: Record<string, any>;
}

interface ContentState {
  feeds: {
    news: ContentItem[];
    movies: ContentItem[];
    social: ContentItem[];
  };
  favorites: ContentItem[];
  contentOrder: string[];
  searchResults: ContentItem[];
  searchQuery: string;
  filters: {
    categories: string[];
    dateRange: string;
  };
  pagination: {
    news: { page: number; hasMore: boolean };
    movies: { page: number; hasMore: boolean };
    social: { page: number; hasMore: boolean };
  };
}

const initialState: ContentState = {
  feeds: {
    news: [],
    movies: [],
    social: [],
  },
  favorites: [],
  contentOrder: [],
  searchResults: [],
  searchQuery: '',
  filters: {
    categories: [],
    dateRange: 'week',
  },
  pagination: {
    news: { page: 1, hasMore: true },
    movies: { page: 1, hasMore: true },
    social: { page: 1, hasMore: true },
  },
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setNewsContent: (state, action: PayloadAction<ContentItem[]>) => {
      state.feeds.news = action.payload;
    },
    addNewsContent: (state, action: PayloadAction<ContentItem[]>) => {
      state.feeds.news.push(...action.payload);
    },
    setMoviesContent: (state, action: PayloadAction<ContentItem[]>) => {
      state.feeds.movies = action.payload;
    },
    addMoviesContent: (state, action: PayloadAction<ContentItem[]>) => {
      state.feeds.movies.push(...action.payload);
    },
    setSocialContent: (state, action: PayloadAction<ContentItem[]>) => {
      state.feeds.social = action.payload;
    },
    addSocialContent: (state, action: PayloadAction<ContentItem[]>) => {
      state.feeds.social.push(...action.payload);
    },
    setFavorites: (state, action: PayloadAction<ContentItem[]>) => {
      state.favorites = action.payload;
    },
    addToFavorites: (state, action: PayloadAction<ContentItem>) => {
      const exists = state.favorites.find(item => item.id === action.payload.id);
      if (!exists) {
        state.favorites.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(item => item.id !== action.payload);
    },
    setContentOrder: (state, action: PayloadAction<string[]>) => {
      state.contentOrder = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<ContentItem[]>) => {
      state.searchResults = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ContentState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    updatePagination: (state, action: PayloadAction<{ type: keyof ContentState['pagination']; page: number; hasMore: boolean }>) => {
      const { type, page, hasMore } = action.payload;
      state.pagination[type] = { page, hasMore };
    },
    resetContent: (state, action: PayloadAction<keyof ContentState['feeds']>) => {
      state.feeds[action.payload] = [];
      state.pagination[action.payload] = { page: 1, hasMore: true };
    },
  },
});

export const {
  setNewsContent,
  addNewsContent,
  setMoviesContent,
  addMoviesContent,
  setSocialContent,
  addSocialContent,
  setFavorites,
  addToFavorites,
  removeFromFavorites,
  setContentOrder,
  setSearchResults,
  setSearchQuery,
  setFilters,
  updatePagination,
  resetContent,
} = contentSlice.actions;

export default contentSlice.reducer;