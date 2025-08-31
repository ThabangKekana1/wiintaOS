import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { 
  Heart, 
  BookOpen, 
  Briefcase,
  Globe,
  Users,
  Bell,
  Shield,
  Eye,
  MessageSquare,
  ChevronRight,
  Check,
  Building,
  GraduationCap,
  TreePine
} from 'lucide-react';

export function PreferencesPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    feedContent: [],
    socialFeatures: {
      discoverability: true,
      publicProfile: false,
      friendSuggestions: true,
      contentSharing: true,
      mentionNotifications: true,
      likeNotifications: false,
      commentNotifications: true,
      followNotifications: true
    },
    privacy: {
      dataSharing: false,
      analyticsOptIn: true,
      locationServices: false,
      voiceDataRetention: true
    },
    personalization: {
      emotionalAnalysis: true,
      adaptiveInterface: true,
      voicePersonalization: true,
      contentRecommendations: true
    }
  });

  const steps = [
    'Feed Interests',
    'Social Features', 
    'Privacy Settings',
    'Personalisation',
    'Complete Setup'
  ];

  const feedCategories = [
    { id: 'healthcare', label: 'Healthcare Systems', icon: Heart, color: 'from-red-500 to-pink-500' },
    { id: 'education', label: 'Education & Learning', icon: GraduationCap, color: 'from-blue-500 to-indigo-500' },
    { id: 'social-care', label: 'Social Care', icon: Users, color: 'from-green-500 to-emerald-500' },
    { id: 'entrepreneurship', label: 'Entrepreneurship', icon: Briefcase, color: 'from-orange-500 to-amber-500' },
    { id: 'governance', label: 'Government & Policy', icon: Building, color: 'from-purple-500 to-violet-500' },
    { id: 'workforce', label: 'Workforce Development', icon: Users, color: 'from-teal-500 to-cyan-500' },
    { id: 'community', label: 'Community Building', icon: Globe, color: 'from-violet-500 to-purple-500' },
    { id: 'family', label: 'Family & Relationships', icon: Heart, color: 'from-pink-500 to-rose-500' },
    { id: 'mental-health', label: 'Mental Health', icon: Shield, color: 'from-indigo-500 to-purple-500' },
    { id: 'social-justice', label: 'Social Justice', icon: Shield, color: 'from-yellow-500 to-orange-500' },
    { id: 'environment', label: 'Environmental Issues', icon: TreePine, color: 'from-green-600 to-emerald-600' },
    { id: 'economics', label: 'Economics & Finance', icon: Briefcase, color: 'from-slate-500 to-gray-500' }
  ];

  const toggleFeedInterest = (categoryId: string) => {
    setPreferences(prev => ({
      ...prev,
      feedContent: prev.feedContent.includes(categoryId)
        ? prev.feedContent.filter(id => id !== categoryId)
        : [...prev.feedContent, categoryId]
    }));
  };

  const toggleSocialFeature = (feature: string) => {
    setPreferences(prev => ({
      ...prev,
      socialFeatures: {
        ...prev.socialFeatures,
        [feature]: !prev.socialFeatures[feature]
      }
    }));
  };

  const togglePrivacySetting = (setting: string) => {
    setPreferences(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [setting]: !prev.privacy[setting]
      }
    }));
  };

  const togglePersonalizationSetting = (setting: string) => {
    setPreferences(prev => ({
      ...prev,
      personalization: {
        ...prev.personalization,
        [setting]: !prev.personalization[setting]
      }
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden dark">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20 animate-pulse" />
      </div>

      {/* Progress bar */}
      <div className="relative z-10 pt-8 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-medium text-white">Customise Your Experience</h1>
              <span className="text-sm text-white/60">{currentStep + 1} of {steps.length}</span>
            </div>
            <Progress value={progress} className="h-2 bg-white/10" />
            <div className="flex justify-between mt-2 text-xs text-white/60">
              {steps.map((step, index) => (
                <span 
                  key={step}
                  className={index <= currentStep ? 'text-white' : 'text-white/40'}
                >
                  {step}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 px-6 pb-24">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="feed-interests"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="bg-white/5 backdrop-blur-md border-white/10">
                  <div className="p-8">
                    <h2 className="text-xl font-medium mb-2 text-white">What interests you?</h2>
                    <p className="text-white/60 mb-6">Choose topics you'd like to see in your feed. You can always change these later.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {feedCategories.map((category) => {
                        const isSelected = preferences.feedContent.includes(category.id);
                        const Icon = category.icon;
                        
                        return (
                          <motion.div
                            key={category.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleFeedInterest(category.id)}
                            className={`relative p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                              isSelected 
                                ? 'border-white/30 bg-white/10' 
                                : 'border-white/10 bg-white/5 hover:bg-white/8'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <span className="text-sm font-medium text-white">{category.label}</span>
                              </div>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-5 h-5 bg-white rounded-full flex items-center justify-center"
                                >
                                  <Check className="w-3 h-3 text-black" />
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="social-features"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="bg-white/5 backdrop-blur-md border-white/10">
                  <div className="p-8">
                    <h2 className="text-xl font-medium mb-2 text-white">Social Features</h2>
                    <p className="text-white/60 mb-6">Configure how you interact with others and how they can find you.</p>
                    
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-medium text-white">Discovery & Profile</h3>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium text-white">Make my profile discoverable</Label>
                            <p className="text-xs text-white/60">Allow others to find you through search and suggestions</p>
                          </div>
                          <Switch 
                            checked={preferences.socialFeatures.discoverability}
                            onCheckedChange={() => toggleSocialFeature('discoverability')}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium text-white">Public profile</Label>
                            <p className="text-xs text-white/60">Make your profile visible to everyone, not just connections</p>
                          </div>
                          <Switch 
                            checked={preferences.socialFeatures.publicProfile}
                            onCheckedChange={() => toggleSocialFeature('publicProfile')}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium text-white">Friend suggestions</Label>
                            <p className="text-xs text-white/60">Receive suggestions for people you might know</p>
                          </div>
                          <Switch 
                            checked={preferences.socialFeatures.friendSuggestions}
                            onCheckedChange={() => toggleSocialFeature('friendSuggestions')}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-medium text-white">Notifications</h3>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium text-white">Mentions</Label>
                            <p className="text-xs text-white/60">When someone mentions you in a post</p>
                          </div>
                          <Switch 
                            checked={preferences.socialFeatures.mentionNotifications}
                            onCheckedChange={() => toggleSocialFeature('mentionNotifications')}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium text-white">Likes</Label>
                            <p className="text-xs text-white/60">When someone likes your content</p>
                          </div>
                          <Switch 
                            checked={preferences.socialFeatures.likeNotifications}
                            onCheckedChange={() => toggleSocialFeature('likeNotifications')}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium text-white">Comments</Label>
                            <p className="text-xs text-white/60">When someone comments on your posts</p>
                          </div>
                          <Switch 
                            checked={preferences.socialFeatures.commentNotifications}
                            onCheckedChange={() => toggleSocialFeature('commentNotifications')}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium text-white">New followers</Label>
                            <p className="text-xs text-white/60">When someone starts following you</p>
                          </div>
                          <Switch 
                            checked={preferences.socialFeatures.followNotifications}
                            onCheckedChange={() => toggleSocialFeature('followNotifications')}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="privacy-settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="bg-white/5 backdrop-blur-md border-white/10">
                  <div className="p-8">
                    <h2 className="text-xl font-medium mb-2 text-white">Privacy Settings</h2>
                    <p className="text-white/60 mb-6">Control how your data is used and shared. Your privacy is important to us.</p>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium text-white">Data sharing with partners</Label>
                          <p className="text-xs text-white/60">Share anonymised data to improve our services</p>
                        </div>
                        <Switch 
                          checked={preferences.privacy.dataSharing}
                          onCheckedChange={() => togglePrivacySetting('dataSharing')}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium text-white">Analytics opt-in</Label>
                          <p className="text-xs text-white/60">Help us improve by sharing usage analytics</p>
                        </div>
                        <Switch 
                          checked={preferences.privacy.analyticsOptIn}
                          onCheckedChange={() => togglePrivacySetting('analyticsOptIn')}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium text-white">Location services</Label>
                          <p className="text-xs text-white/60">Use your location for personalised content and features</p>
                        </div>
                        <Switch 
                          checked={preferences.privacy.locationServices}
                          onCheckedChange={() => togglePrivacySetting('locationServices')}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium text-white">Voice data retention</Label>
                          <p className="text-xs text-white/60">Store voice interactions to improve emotional analysis</p>
                        </div>
                        <Switch 
                          checked={preferences.privacy.voiceDataRetention}
                          onCheckedChange={() => togglePrivacySetting('voiceDataRetention')}
                        />
                      </div>

                      <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-start space-x-3">
                          <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-400">Privacy Note</p>
                            <p className="text-xs text-white/60 mt-1">
                              Wiinta OS is designed with privacy in mind. We never collect personally identifiable information without your explicit consent, and all emotional analysis happens with your permission.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="personalization"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="bg-white/5 backdrop-blur-md border-white/10">
                  <div className="p-8">
                    <h2 className="text-xl font-medium mb-2 text-white">Personalisation</h2>
                    <p className="text-white/60 mb-6">Customise how Wiinta adapts to your emotional state and preferences.</p>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium text-white">Emotional analysis</Label>
                          <p className="text-xs text-white/60">Analyze your voice to understand emotional state</p>
                        </div>
                        <Switch 
                          checked={preferences.personalization.emotionalAnalysis}
                          onCheckedChange={() => togglePersonalizationSetting('emotionalAnalysis')}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium text-white">Adaptive interface</Label>
                          <p className="text-xs text-white/60">Interface adapts based on your emotional state</p>
                        </div>
                        <Switch 
                          checked={preferences.personalization.adaptiveInterface}
                          onCheckedChange={() => togglePersonalizationSetting('adaptiveInterface')}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium text-white">Voice personalisation</Label>
                          <p className="text-xs text-white/60">Customise system voice based on your preferences</p>
                        </div>
                        <Switch 
                          checked={preferences.personalization.voicePersonalization}
                          onCheckedChange={() => togglePersonalizationSetting('voicePersonalization')}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium text-white">Content recommendations</Label>
                          <p className="text-xs text-white/60">Receive personalised content based on your interests</p>
                        </div>
                        <Switch 
                          checked={preferences.personalization.contentRecommendations}
                          onCheckedChange={() => togglePersonalizationSetting('contentRecommendations')}
                        />
                      </div>

                      <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20">
                        <div className="flex items-start space-x-3">
                          <Heart className="w-5 h-5 text-purple-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-purple-400">Empathic Computing</p>
                            <p className="text-xs text-white/60 mt-1">
                              These settings enable Wiinta's emotional intelligence features, creating a more empathetic and responsive user experience.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="bg-white/5 backdrop-blur-md border-white/10">
                  <div className="p-8 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <Check className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <h2 className="text-xl font-medium mb-2 text-white">You're all set!</h2>
                    <p className="text-white/60 mb-6">
                      Your preferences have been saved. You can always update them later in your settings.
                    </p>

                    <div className="bg-white/5 rounded-lg p-4 mb-6">
                      <h3 className="font-medium mb-3 text-white">Your Setup Summary:</h3>
                      <div className="text-left space-y-2 text-sm text-white/70">
                        <p>• {preferences.feedContent.length} interests selected</p>
                        <p>• Social features configured</p>
                        <p>• Privacy settings customised</p>
                        <p>• Personalisation preferences set</p>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-white text-black hover:bg-white/90 transition-colors font-medium"
                      onClick={() => {
                        // Navigate to main app
                        console.log('Preferences saved:', preferences);
                      }}
                    >
                      Enter Wiinta OS
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          {currentStep < 4 && (
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="bg-white/5 border-white/20 text-white hover:bg-white/10 font-medium"
              >
                Previous
              </Button>
              
              <Button 
                onClick={nextStep}
                className="bg-white text-black hover:bg-white/90 transition-colors font-medium"
              >
                {currentStep === 3 ? 'Finish Setup' : 'Continue'}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}