import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const contentApi = createApi({
  reducerPath: 'contentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['News', 'Movies', 'Social', 'Favorites', 'ContentOrder'],
  endpoints: (builder) => ({
    // News endpoints
    getNews: builder.query<any, { category?: string; page?: number; q?: string }>({
      query: ({ category = 'general', page = 1, q }) => ({
        url: '/news',
        params: { category, page, q },
      }),
      providesTags: ['News'],
    }),

    // Movies endpoints
    getMovies: builder.query<any, { type?: string; page?: number; query?: string }>({
      query: ({ type = 'popular', page = 1, query }) => ({
        url: '/movies',
        params: { type, page, query },
      }),
      providesTags: ['Movies'],
    }),

    // Social endpoints
    getSocialPosts: builder.query<any, { hashtag?: string; page?: number }>({
      query: ({ hashtag = 'technology', page = 1 }) => ({
        url: '/social',
        params: { hashtag, page },
      }),
      providesTags: ['Social'],
    }),

    // Favorites endpoints
    getFavorites: builder.query<any, void>({
      query: () => '/user/favorites',
      providesTags: ['Favorites'],
    }),

    addToFavorites: builder.mutation<any, { contentId: string; contentType: string; contentData: any }>({
      query: (data) => ({
        url: '/user/favorites',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Favorites'],
    }),

    removeFromFavorites: builder.mutation<any, string>({
      query: (id) => ({
        url: `/user/favorites/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Favorites'],
    }),

    // Content order endpoints
    getContentOrder: builder.query<any, void>({
      query: () => '/user/content-order',
      providesTags: ['ContentOrder'],
    }),

    updateContentOrder: builder.mutation<any, { contentOrder: string[] }>({
      query: (data) => ({
        url: '/user/content-order',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['ContentOrder'],
    }),
  }),
});

export const {
  useGetNewsQuery,
  useGetMoviesQuery,
  useGetSocialPostsQuery,
  useGetFavoritesQuery,
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
  useGetContentOrderQuery,
  useUpdateContentOrderMutation,
} = contentApi;