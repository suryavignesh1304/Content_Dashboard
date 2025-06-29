import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { TrendingUp, Siren as Fire, Clock } from 'lucide-react';
import { RootState } from '../../store';
import { useGetNewsQuery, useGetMoviesQuery } from '../../store/api/contentApi';
import ContentCard from './ContentCard';
import LoadingSpinner from '../ui/LoadingSpinner';

const TrendingSection: React.FC = () => {
  const { darkMode } = useSelector((state: RootState) => state.ui);
  
  // Fetch trending content
  const { data: trendingNews, isLoading: newsLoading } = useGetNewsQuery({
    category: 'general',
    page: 1
  });
  
  const { data: trendingMovies, isLoading: moviesLoading } = useGetMoviesQuery({
    type: 'popular',
    page: 1
  });

  const isLoading = newsLoading || moviesLoading;

  // Transform data for trending display
  const trendingContent = React.useMemo(() => {
    const news = trendingNews?.articles?.slice(0, 6)?.map((article: any) => ({
      id: `trending-news-${article.url || Math.random()}`,
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

    const movies = trendingMovies?.results?.slice(0, 6)?.map((movie: any) => ({
      id: `trending-movie-${movie.id}`,
      type: 'movie' as const,
      title: movie.title || movie.name || '',
      description: movie.overview || '',
      image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined,
      publishedAt: movie.release_date || movie.first_air_date,
      category: 'entertainment',
      data: movie
    })) || [];

    return [...news, ...movies].sort(() => Math.random() - 0.5); // Randomize for demo
  }, [trendingNews, trendingMovies]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${darkMode ? 'bg-orange-600' : 'bg-orange-500'}`}>
            <TrendingUp className="text-white" size={24} />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Trending Now
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              What's popular across all categories
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Fire className="text-orange-500" size={20} />
          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Hot Topics
          </span>
        </div>
      </motion.div>

      {/* Trending Categories */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-3"
      >
        {['Breaking News', 'Popular Movies', 'Tech Updates', 'Sports', 'Entertainment'].map((category, index) => (
          <motion.span
            key={category}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
              darkMode
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Clock size={14} />
            {category}
          </motion.span>
        ))}
      </motion.div>

      {/* Trending Content Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {trendingContent.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="relative"
          >
            <ContentCard item={item} index={index} />
            
            {/* Trending Badge */}
            <div className="absolute -top-2 -right-2 z-10">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                <Fire size={12} />
                #{index + 1}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-xl ${
          darkMode ? 'bg-gray-800' : 'bg-gray-50'
        }`}
      >
        <div className="text-center">
          <div className={`text-3xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            24.7K
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Stories Today
          </div>
        </div>
        
        <div className="text-center">
          <div className={`text-3xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
            1.2M
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Total Reads
          </div>
        </div>
        
        <div className="text-center">
          <div className={`text-3xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
            89%
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Engagement Rate
          </div>
        </div>
      </motion.div>

      {/* Empty State */}
      {trendingContent.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="mb-4">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
              darkMode ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              📈
            </div>
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            No trending content available
          </h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Check back later for the latest trending stories and updates.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default TrendingSection;