import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 sm:w-80 h-40 sm:h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 sm:w-80 h-40 sm:h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-20 sm:top-40 left-20 sm:left-40 w-40 sm:w-80 h-40 sm:h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left w-full max-w-lg mx-auto lg:max-w-none"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              Content
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              Your personalized hub for news, entertainment, and social content. 
              Discover, organize, and enjoy content tailored just for you.
            </p>
            
            {/* Features */}
            <div className="space-y-3 sm:space-y-4">
              {[
                '🎯 Personalized content recommendations',
                '📱 Real-time updates from multiple sources',
                '❤️ Save and organize your favorites',
                '🎨 Beautiful, customizable interface'
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-2 sm:gap-3 text-gray-700 text-sm sm:text-base"
                >
                  <span className="text-lg sm:text-2xl">{feature.split(' ')[0]}</span>
                  <span>{feature.substring(feature.indexOf(' ') + 1)}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Auth Forms */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center w-full"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md backdrop-blur-sm bg-opacity-95">
              <AnimatePresence mode="wait">
                {isLogin ? (
                  <LoginForm 
                    key="login"
                    onSwitchToRegister={() => setIsLogin(false)} 
                  />
                ) : (
                  <RegisterForm 
                    key="register"
                    onSwitchToLogin={() => setIsLogin(true)} 
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-3 sm:w-4 h-3 sm:h-4 bg-blue-400 rounded-full animate-ping opacity-60"></div>
      <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-4 sm:w-6 h-4 sm:h-6 bg-purple-400 rounded-full animate-pulse opacity-60"></div>
      <div className="absolute top-1/2 right-6 sm:right-10 w-2 sm:w-3 h-2 sm:h-3 bg-pink-400 rounded-full animate-bounce opacity-60"></div>
    </div>
  );
};

export default AuthPage;