import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { motion } from 'framer-motion';
import { RootState } from '../../store';
import { ContentItem, setContentOrder } from '../../store/slices/contentSlice';
import { useGetNewsQuery, useGetMoviesQuery, useGetSocialPostsQuery } from '../../store/api/contentApi';
import ContentCard from './ContentCard';
import LoadingSpinner from '../ui/LoadingSpinner';

const ContentFeed: React.FC = () => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state: RootState) => state.ui);
  const { feeds, contentOrder, searchQuery, filters } = useSelector((state: RootState) => state.content);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [combinedContent, setCombinedContent] = useState<ContentItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // API queries
  const { data: newsData, isLoading: newsLoading } = useGetNewsQuery({
    category: user?.preferences?.newsCategory || 'general',
    page,
    q: searchQuery
  });

  const { data: moviesData, isLoading: moviesLoading } = useGetMoviesQuery({
    type: 'popular',
    page,
    query: searchQuery
  });

  const { data: socialData, isLoading: socialLoading } = useGetSocialPostsQuery({
    hashtag: user?.preferences?.socialHashtag || 'technology',
    page
  });

  // Transform API data to ContentItem format
  const transformNewsData = (articles: any[]): ContentItem[] => {
    return articles?.map((article: any) => ({
      id: `news-${article.url || Math.random()}`,
      type: 'news' as const,
      title: article.title || '',
      description: article.description || '',
      image: article.urlToImage,
      url: article.url,
      author: article.author,
      publishedAt: article.publishedAt,
      category: 'news',
      data: article
    })) || [];
  };

  const transformMoviesData = (movies: any[]): ContentItem[] => {
    return movies?.map((movie: any) => ({
      id: `movie-${movie.id}`,
      type: 'movie' as const,
      title: movie.title || movie.name || '',
      description: movie.overview || '',
      image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined,
      publishedAt: movie.release_date || movie.first_air_date,
      category: 'entertainment',
      data: movie
    })) || [];
  };

  const transformSocialData = (posts: any[]): ContentItem[] => {
    return posts?.map((post: any) => ({
      id: `social-${post.id}`,
      type: 'social' as const,
      title: `@${post.username}`,
      description: post.content || '',
      image: post.image,
      author: post.username,
      publishedAt: post.timestamp,
      category: 'social',
      data: post
    })) || [];
  };

  // Combine and organize content
  useEffect(() => {
    const newsItems = transformNewsData(newsData?.articles || []);
    const movieItems = transformMoviesData(moviesData?.results || []);
    const socialItems = transformSocialData(socialData?.posts || []);

    const allContent = [...newsItems, ...movieItems, ...socialItems];
    
    // Apply search filter
    const filteredContent = searchQuery 
      ? allContent.filter(item => 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : allContent;

    // Apply content order if exists
    const orderedContent = contentOrder.length > 0 
      ? contentOrder.map(id => filteredContent.find(item => item.id === id)).filter(Boolean) as ContentItem[]
      : filteredContent;

    setCombinedContent(orderedContent);
    setHasMore(orderedContent.length > 0 && page < 5); // Limit to 5 pages for demo
  }, [newsData, moviesData, socialData, contentOrder, searchQuery, page]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(combinedContent);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCombinedContent(items);
    dispatch(setContentOrder(items.map(item => item.id)));
  };

  const loadMore = () => {
    if (hasMore && !newsLoading && !moviesLoading && !socialLoading) {
      setPage(prev => prev + 1);
    }
  };

  const isLoading = newsLoading || moviesLoading || socialLoading;

  if (isLoading && combinedContent.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Personalized Feed'}
        </h2>
        
        {combinedContent.length > 0 && (
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {combinedContent.length} items
          </p>
        )}
      </div>

      {/* Content Grid with Drag & Drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="content-feed">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <InfiniteScroll
                dataLength={combinedContent.length}
                next={loadMore}
                hasMore={hasMore}
                loader={<LoadingSpinner />}
                endMessage={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <p className={`text-lg font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      You've reached the end!
                    </p>
                  </motion.div>
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {combinedContent.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`transition-transform duration-200 ${
                            snapshot.isDragging ? 'scale-105 rotate-2 z-50' : ''
                          }`}
                        >
                          <ContentCard item={item} index={index} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>
              </InfiniteScroll>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Empty State */}
      {combinedContent.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="mb-4">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
              darkMode ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              📰
            </div>
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            No content found
          </h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {searchQuery 
              ? 'Try adjusting your search terms or browse by category.'
              : 'Check your preferences or try refreshing the page.'
            }
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ContentFeed;