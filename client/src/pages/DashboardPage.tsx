import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '../store';
import { fetchUserProfile } from '../store/slices/authSlice';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import ContentFeed from '../components/content/ContentFeed';
import TrendingSection from '../components/content/TrendingSection';
import FavoritesSection from '../components/content/FavoritesSection';
import SettingsSection from '../components/settings/SettingsSection';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const { darkMode, sidebarOpen, activeSection } = useSelector((state: RootState) => state.ui);
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, token]);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'feed':
        return <ContentFeed />;
      case 'trending':
        return <TrendingSection />;
      case 'favorites':
        return <FavoritesSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <ContentFeed />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <Header />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : 'ml-0'
        }`}
        style={{ paddingTop: '80px' }} // Account for fixed header
      >
        <div className="container mx-auto px-4 py-6">
          {renderActiveSection()}
        </div>
      </motion.main>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => dispatch({ type: 'ui/setSidebarOpen', payload: false })}
        />
      )}
    </div>
  );
};

export default DashboardPage;