import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Settings, User, Bell, Shield, Palette, Globe, Save } from 'lucide-react';
import { RootState } from '../../store';
import { updateUserPreferences } from '../../store/slices/authSlice';
import { toggleDarkMode } from '../../store/slices/uiSlice';

const SettingsSection: React.FC = () => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [preferences, setPreferences] = useState({
    newsCategory: user?.preferences?.newsCategory || 'general',
    socialHashtag: user?.preferences?.socialHashtag || 'technology',
    notifications: user?.preferences?.notifications !== false,
    language: user?.preferences?.language || 'en',
    autoRefresh: user?.preferences?.autoRefresh !== false,
    contentDensity: user?.preferences?.contentDensity || 'comfortable',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      await dispatch(updateUserPreferences(preferences)).unwrap();
      // Show success message
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const settingsCategories = [
    {
      icon: User,
      title: 'Content Preferences',
      description: 'Customize your content feed',
      items: [
        {
          label: 'News Category',
          type: 'select',
          key: 'newsCategory',
          options: [
            { value: 'general', label: 'General' },
            { value: 'technology', label: 'Technology' },
            { value: 'business', label: 'Business' },
            { value: 'entertainment', label: 'Entertainment' },
            { value: 'health', label: 'Health' },
            { value: 'science', label: 'Science' },
            { value: 'sports', label: 'Sports' },
          ]
        },
        {
          label: 'Social Media Hashtag',
          type: 'text',
          key: 'socialHashtag',
          placeholder: 'Enter hashtag (without #)'
        },
        {
          label: 'Content Density',
          type: 'select',
          key: 'contentDensity',
          options: [
            { value: 'compact', label: 'Compact' },
            { value: 'comfortable', label: 'Comfortable' },
            { value: 'spacious', label: 'Spacious' },
          ]
        }
      ]
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Manage notification preferences',
      items: [
        {
          label: 'Enable Notifications',
          type: 'toggle',
          key: 'notifications'
        },
        {
          label: 'Auto Refresh Content',
          type: 'toggle',
          key: 'autoRefresh'
        }
      ]
    },
    {
      icon: Palette,
      title: 'Appearance',
      description: 'Customize the look and feel',
      items: [
        {
          label: 'Dark Mode',
          type: 'toggle',
          key: 'darkMode',
          value: darkMode,
          onChange: () => dispatch(toggleDarkMode())
        }
      ]
    },
    {
      icon: Globe,
      title: 'Language & Region',
      description: 'Set your language preferences',
      items: [
        {
          label: 'Language',
          type: 'select',
          key: 'language',
          options: [
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Spanish' },
            { value: 'fr', label: 'French' },
            { value: 'de', label: 'German' },
            { value: 'it', label: 'Italian' },
          ]
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <Settings className={darkMode ? 'text-gray-300' : 'text-gray-600'} size={24} />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Settings
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Customize your dashboard experience
            </p>
          </div>
        </div>

        <motion.button
          onClick={handleSavePreferences}
          disabled={isSaving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Save Changes
        </motion.button>
      </motion.div>

      {/* Settings Categories */}
      <div className="space-y-6">
        {settingsCategories.map((category, categoryIndex) => {
          const Icon = category.icon;
          
          return (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className={`rounded-xl border p-6 ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <Icon className={darkMode ? 'text-blue-400' : 'text-blue-600'} size={20} />
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {category.title}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {category.description}
                  </p>
                </div>
              </div>

              {/* Settings Items */}
              <div className="space-y-4">
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (categoryIndex * 0.1) + (itemIndex * 0.05) }}
                    className="flex items-center justify-between"
                  >
                    <label className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {item.label}
                    </label>

                    {/* Toggle */}
                    {item.type === 'toggle' && (
                      <button
                        onClick={item.onChange || (() => {
                          setPreferences(prev => ({
                            ...prev,
                            [item.key]: !prev[item.key as keyof typeof prev]
                          }));
                        })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          (item.value !== undefined ? item.value : preferences[item.key as keyof typeof preferences])
                            ? 'bg-blue-600'
                            : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            (item.value !== undefined ? item.value : preferences[item.key as keyof typeof preferences])
                              ? 'translate-x-6'
                              : 'translate-x-1'
                          }`}
                        />
                      </button>
                    )}

                    {/* Select */}
                    {item.type === 'select' && (
                      <select
                        value={preferences[item.key as keyof typeof preferences] as string}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          [item.key]: e.target.value
                        }))}
                        className={`px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        {item.options?.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* Text Input */}
                    {item.type === 'text' && (
                      <input
                        type="text"
                        value={preferences[item.key as keyof typeof preferences] as string}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          [item.key]: e.target.value
                        }))}
                        placeholder={item.placeholder}
                        className={`px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          darkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Account Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`rounded-xl border p-6 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <Shield className={darkMode ? 'text-red-400' : 'text-red-600'} size={20} />
          <div>
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Account & Security
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your account settings
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Email Address
            </span>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {user?.email}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Account Status
            </span>
            <span className="inline-flex items-center gap-1 text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Verified
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsSection;