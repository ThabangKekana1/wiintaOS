import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import backgroundImage from 'figma:asset/1687bbd5641833bb94b2670c3454024cdf88374b.png';

interface LandingPageProps {
  onAccountCreated?: () => void;
}

export function LandingPage({ onAccountCreated }: LandingPageProps) {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (isSignUp) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log(isSignUp ? 'Sign up' : 'Sign in', formData);
    setIsLoading(false);
    
    // If this is a signup and we have the callback, navigate to preferences
    if (isSignUp && onAccountCreated) {
      onAccountCreated();
      return;
    }
    
    // Reset form for sign in or if no callback
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    });
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setErrors({});
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    });
  };

  const handleTryWiinta = () => {
    setShowLoginForm(true);
    setIsSignUp(true);
  };

  const footerLinks = [
    { label: 'About', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Developers', href: '#' },
    { label: 'Advertising', href: '#' },
    { label: 'Settings', href: '#' }
  ];

  return (
    <div className="min-h-screen dark relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt="Background"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-3 items-center h-16">
              {/* Logo - Left Column */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-start"
              >
                <span className="text-lg text-white font-thin" style={{ fontFamily: 'Inter, sans-serif' }}>
                  wiintaOS
                </span>
              </motion.div>

              {/* Navigation Links - Center Column */}
              <div className="hidden lg:flex items-center justify-center space-x-8">
                <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium whitespace-nowrap">
                  Use Cases
                </a>
                <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium whitespace-nowrap">
                  Features
                </a>
                <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium whitespace-nowrap">
                  Enterprise
                </a>
                <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium whitespace-nowrap">
                  Pricing
                </a>
                <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium whitespace-nowrap">
                  Careers
                </a>
              </div>

              {/* Try Wiinta Button - Right Column */}
              <div className="flex items-center justify-end">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="hidden sm:block"
                >
                  <button
                    onClick={handleTryWiinta}
                    className="relative bg-transparent hover:bg-white/10 text-white border border-white/60 hover:border-white rounded-full px-6 py-2 text-sm font-medium transition-all duration-300 overflow-hidden group"
                  >
                    <span className="relative z-10">Try Wiinta</span>
                    <div className="absolute inset-0 rounded-full">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-glare transform -skew-x-12 w-[150%] -left-[25%]"></div>
                    </div>
                  </button>
                </motion.div>

                {/* Mobile menu button */}
                <div className="lg:hidden flex items-center space-x-4">
                  <button
                    onClick={handleTryWiinta}
                    className="text-white/80 hover:text-white transition-colors text-sm font-medium sm:hidden"
                  >
                    Try Wiinta
                  </button>
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Mobile Navigation Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden bg-black/40 backdrop-blur-xl border-t border-white/10"
              >
                <div className="px-4 py-4 space-y-3">
                  <a href="#" className="block text-white/80 hover:text-white transition-colors text-sm font-medium py-2">
                    Use Cases
                  </a>
                  <a href="#" className="block text-white/80 hover:text-white transition-colors text-sm font-medium py-2">
                    Features
                  </a>
                  <a href="#" className="block text-white/80 hover:text-white transition-colors text-sm font-medium py-2">
                    Enterprise
                  </a>
                  <a href="#" className="block text-white/80 hover:text-white transition-colors text-sm font-medium py-2">
                    Pricing
                  </a>
                  <a href="#" className="block text-white/80 hover:text-white transition-colors text-sm font-medium py-2">
                    Careers
                  </a>
                  <div className="pt-3 hidden sm:block">
                    <button
                      onClick={() => {
                        handleTryWiinta();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-transparent hover:bg-white/10 text-white border border-white/60 hover:border-white rounded-full px-6 py-2 text-sm font-medium transition-all duration-300"
                    >
                      Try Wiinta
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Main Content */}
        <div className="pt-16 flex-1 flex items-center justify-center">
          <div className="max-w-lg w-full mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              {!showLoginForm ? (
                <motion.div
                  key="landing"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="text-center space-y-12"
                >
                  {/* Main Heading */}
                  <div className="space-y-6">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium text-white leading-tight whitespace-nowrap">
                      Welcome to{' '}
                      <span 
                        className="font-medium inline-block"
                        style={{
                          background: 'linear-gradient(90deg, #60A5FA, #A78BFA, #F472B6)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          color: '#60A5FA' // fallback color
                        }}
                      >
                        WiintaOS
                      </span>.
                    </h1>
                    
                    <p className="text-lg sm:text-xl text-white/80 max-w-4xl mx-auto leading-relaxed px-4">
                      An emotionally intelligent voice-first operating system that prioritises empathy and ambient interaction over traditional interfaces.
                    </p>
                  </div>

                  {/* Feature Pills */}
                  <div className="flex items-center justify-center flex-wrap gap-4">
                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-white/90">AI Powered</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-white/90">Real-time</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-white/90">Empathic</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full px-4">
                    <Button 
                      size="lg"
                      className="bg-white hover:bg-white/90 text-black rounded-full px-8 py-4 h-auto w-full sm:w-auto min-w-[200px]"
                    >
                      Explore Features
                    </Button>
                    
                    <Button
                      size="lg"
                      onClick={handleTryWiinta}
                      className="relative bg-transparent hover:bg-white/10 text-white border-2 border-white hover:border-white rounded-full px-8 py-4 h-auto w-full sm:w-auto min-w-[200px] transition-all duration-300 overflow-hidden group font-medium"
                    >
                      <span className="relative z-10">Try Wiinta</span>
                      {/* Enhanced glare effect */}
                      <div className="absolute inset-0 rounded-full opacity-80">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-glare transform -skew-x-12 w-[150%] -left-[25%]"></div>
                      </div>
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="text-center space-y-8"
                >
                  {/* Back Button */}
                  <div className="flex justify-start">
                    <button
                      onClick={() => {
                        setShowLoginForm(false);
                        setErrors({});
                        setFormData({
                          email: '',
                          password: '',
                          confirmPassword: '',
                          name: ''
                        });
                      }}
                      className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span>Back</span>
                    </button>
                  </div>

                  {/* Sign Up Form */}
                  <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                    <div className="space-y-6">
                      <div className="text-center space-y-2">
                        <h2 className="text-2xl font-medium text-white">
                          {isSignUp ? 'Join Wiinta' : 'Welcome back'}
                        </h2>
                        <p className="text-white/70">
                          {isSignUp 
                            ? 'Create your account to get started' 
                            : 'Sign in to your account'
                          }
                        </p>
                      </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <AnimatePresence mode="wait">
                        {isSignUp && (
                          <motion.div
                            key="name"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-2"
                          >
                            <Label htmlFor="name" className="text-white">
                              Name
                            </Label>
                            <div className="relative">
                              <Input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className={`h-12 rounded-xl border-white/20 bg-white/10 text-white placeholder:text-white/50 ${
                                  errors.name ? 'border-red-400' : ''
                                }`}
                                placeholder="@wiintaX"
                              />
                            </div>
                            {errors.name && (
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-sm text-red-400"
                              >
                                {errors.name}
                              </motion.p>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`h-12 rounded-xl border-white/20 bg-white/10 text-white placeholder:text-white/50 ${
                            errors.email ? 'border-red-400' : ''
                          }`}
                          placeholder="Enter your email"
                        />
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-red-400"
                          >
                            {errors.email}
                          </motion.p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-white">
                          Password
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className={`h-12 rounded-xl border-white/20 bg-white/10 text-white placeholder:text-white/50 ${
                            errors.password ? 'border-red-400' : ''
                          }`}
                          placeholder="Enter your password"
                        />
                        {errors.password && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-red-400"
                          >
                            {errors.password}
                          </motion.p>
                        )}
                      </div>

                      <AnimatePresence mode="wait">
                        {isSignUp && (
                          <motion.div
                            key="confirmPassword"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-2"
                          >
                            <Label htmlFor="confirmPassword" className="text-white">
                              Confirm Password
                            </Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              value={formData.confirmPassword}
                              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                              className={`h-12 rounded-xl border-white/20 bg-white/10 text-white placeholder:text-white/50 ${
                                errors.confirmPassword ? 'border-red-400' : ''
                              }`}
                              placeholder="Confirm your password"
                            />
                            {errors.confirmPassword && (
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-sm text-red-400"
                              >
                                {errors.confirmPassword}
                              </motion.p>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-white hover:bg-white/90 text-black rounded-xl"
                      >
                        {isLoading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                          />
                        ) : (
                          isSignUp ? 'Create Account' : 'Sign In'
                        )}
                      </Button>

                      <div className="text-center">
                        <button
                          type="button"
                          onClick={toggleMode}
                          className="text-sm text-white/70 hover:text-white transition-colors"
                        >
                          {isSignUp 
                            ? 'Already have an account? Sign in' 
                            : "Don't have an account? Sign up"
                          }
                        </button>
                      </div>
                      </form>

                      {isSignUp && (
                        <div className="text-center">
                          <p className="text-xs text-white/50 leading-relaxed">
                            By creating an account, you agree to our{' '}
                            <a href="#" className="text-white hover:underline">
                              Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="#" className="text-white hover:underline">
                              Privacy Policy
                            </a>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col space-y-4">
              {/* Footer Links */}
              <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-sm">
                {footerLinks.map((link, index) => (
                  <React.Fragment key={link.label}>
                    <a
                      href={link.href}
                      className="text-white/60 hover:text-white/80 transition-colors px-2 py-1"
                    >
                      {link.label}
                    </a>
                    {index < footerLinks.length - 1 && (
                      <span className="text-white/30">|</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
              
              {/* Copyright */}
              <div className="text-center">
                <p className="text-white/50 text-sm">
                  © Metasapien IO 2025
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}