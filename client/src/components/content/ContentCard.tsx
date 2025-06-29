import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ExternalLink, Clock, User, Star } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { RootState } from '../../store';
import { ContentItem } from '../../store/slices/contentSlice';
import { useAddToFavoritesMutation, useRemoveFromFavoritesMutation } from '../../store/api/contentApi';

interface ContentCardProps {
  item: ContentItem;
  index: number;
}

const ContentCard: React.FC<ContentCardProps> = ({ item, index }) => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state: RootState) => state.ui);
  const { favorites } = useSelector((state: RootState) => state.content);
  
  const [addToFavorites] = useAddToFavoritesMutation();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();
  
  const isFavorite = favorites.some(fav => fav.id === item.id);

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        const favoriteItem = favorites.find(fav => fav.id === item.id);
        if (favoriteItem) {
          await removeFromFavorites(favoriteItem.id).unwrap();
        }
      } else {
        await addToFavorites({
          contentId: item.id,
          contentType: item.type,
          contentData: item
        }).unwrap();
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return '';
    }
  };

  const getTypeIcon = () => {
    switch (item.type) {
      case 'news':
        return <Clock size={16} />;
      case 'movie':
        return <Star size={16} />;
      case 'social':
        return <User size={16} />;
      default:
        return null;
    }
  };

  const getTypeColor = () => {
    switch (item.type) {
      case 'news':
        return 'bg-blue-500';
      case 'movie':
        return 'bg-purple-500';
      case 'social':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`group relative rounded-xl shadow-md transition-all duration-300 hover:shadow-xl ${
        darkMode 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-200'
      }`}
    >
      {/* Image */}
      {item.image && (
        <div className="relative overflow-hidden rounded-t-xl">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Type Badge */}
          <div className={`absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs font-medium ${getTypeColor()}`}>
            {getTypeIcon()}
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-black bg-opacity-50 text-white hover:bg-opacity-70'
            }`}
          >
            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className={`font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {item.title}
        </h3>

        {/* Description */}
        <p className={`text-sm mb-3 line-clamp-3 ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {item.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            {item.author && (
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                {item.author}
              </span>
            )}
            {item.publishedAt && (
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                {formatDate(item.publishedAt)}
              </span>
            )}
            {item.category && (
              <span className={`px-2 py-1 rounded-full ${
                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}>
                {item.category}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-1 rounded-full transition-colors ${
                  darkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>

        {/* Additional data for different content types */}
        {item.type === 'movie' && item.data.vote_average && (
          <div className="flex items-center gap-1 mt-2">
            <Star size={14} className="text-yellow-500" fill="currentColor" />
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {item.data.vote_average}/10
            </span>
          </div>
        )}

        {item.type === 'social' && (
          <div className="flex items-center gap-4 mt-2 text-sm">
            {item.data.likes && (
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                ❤️ {item.data.likes}
              </span>
            )}
            {item.data.comments && (
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                💬 {item.data.comments}
              </span>
            )}
            {item.data.shares && (
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                🔄 {item.data.shares}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
};

export default ContentCard;