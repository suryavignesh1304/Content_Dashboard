import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Heart, Trash2 } from 'lucide-react';
import { RootState } from '../../store';
import { useGetFavoritesQuery, useRemoveFromFavoritesMutation } from '../../store/api/contentApi';
import ContentCard from './ContentCard';
import LoadingSpinner from '../ui/LoadingSpinner';

const FavoritesSection: React.FC = () => {
  const { darkMode } = useSelector((state: RootState) => state.ui);
  const { data: favoritesData, isLoading, refetch } = useGetFavoritesQuery();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();

  const handleRemoveAll = async () => {
    if (window.confirm('Are you sure you want to remove all favorites?')) {
      try {
        // Remove all favorites one by one (in a real app, you might want a bulk delete endpoint)
        const removePromises = favoritesData?.map((favorite: any) => 
          removeFromFavorites(favorite.id).unwrap()
        );
        await Promise.all(removePromises || []);
        refetch();
      } catch (error) {
        console.error('Error removing all favorites:', error);
      }
    }
  };

  // Transform favorites data to ContentItem format
  const favoriteItems = React.useMemo(() => {
    return favoritesData?.map((favorite: any) => ({
      id: favorite.content_id,
      type: favorite.content_type,
      title: favorite.content_data.title || '',
      description: favorite.content_data.description || '',
      image: favorite.content_data.image,
      url: favorite.content_data.url,
      author: favorite.content_data.author,
      publishedAt: favorite.content_data.publishedAt,
      category: favorite.content_data.category,
      data: favorite.content_data.data || favorite.content_data
    })) || [];
  }, [favoritesData]);

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
          <div className={`p-2 rounded-lg ${darkMode ? 'bg-red-600' : 'bg-red-500'}`}>
            <Heart className="text-white" size={24} fill="currentColor" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Your Favorites
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {favoriteItems.length} saved items
            </p>
          </div>
        </div>

        {favoriteItems.length > 0 && (
          <button
            onClick={handleRemoveAll}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              darkMode
                ? 'text-red-400 hover:bg-red-900 hover:bg-opacity-20'
                : 'text-red-600 hover:bg-red-50'
            }`}
          >
            <Trash2 size={16} />
            Clear All
          </button>
        )}
      </motion.div>

      {/* Favorites Categories */}
      {favoriteItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-3"
        >
          {['All', 'News', 'Movies', 'Social'].map((category, index) => {
            const count = category === 'All' 
              ? favoriteItems.length 
              : favoriteItems.filter(item => item.type === category.toLowerCase()).length;
            
            return (
              <motion.span
                key={category}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  category === 'All'
                    ? darkMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-600 text-white'
                    : darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category} ({count})
              </motion.span>
            );
          })}
        </motion.div>
      )}

      {/* Favorites Grid */}
      {favoriteItems.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {favoriteItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="relative"
            >
              <ContentCard item={item} index={index} />
              
              {/* Favorite Badge */}
              <div className="absolute -top-2 -left-2 z-10">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-2 rounded-full shadow-lg">
                  <Heart size={12} fill="currentColor" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="mb-6">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
              darkMode ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <Heart size={40} className={darkMode ? 'text-gray-600' : 'text-gray-400'} />
            </div>
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            No favorites yet
          </h3>
          <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Start building your collection by clicking the heart icon on content you love.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow"
            onClick={() => window.history.back()}
          >
            Browse Content
          </motion.button>
        </motion.div>
      )}

      {/* Statistics */}
      {favoriteItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-xl ${
            darkMode ? 'bg-gray-800' : 'bg-gray-50'
          }`}
        >
          <div className="text-center">
            <div className={`text-3xl font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
              {favoriteItems.filter(item => item.type === 'news').length}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              News Articles
            </div>
          </div>
          
          <div className="text-center">
            <div className={`text-3xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              {favoriteItems.filter(item => item.type === 'movie').length}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Movies & Shows
            </div>
          </div>
          
          <div className="text-center">
            <div className={`text-3xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              {favoriteItems.filter(item => item.type === 'social').length}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Social Posts
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FavoritesSection;