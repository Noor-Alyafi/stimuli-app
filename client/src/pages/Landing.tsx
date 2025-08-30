import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Gamepad2, TrendingUp, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SaveProgressModal } from "@/components/SaveProgressModal";

export default function Landing() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-light-gray to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-navy to-cyan rounded-full flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="white"/>
                  <path d="M8.5 9C8.78 9 9 8.78 9 8.5S8.78 8 8.5 8S8 8.22 8 8.5S8.22 9 8.5 9Z" fill="white"/>
                  <path d="M15.5 9C15.78 9 16 8.78 16 8.5S15.78 8 15.5 8S15 8.22 15 8.5S15.22 9 15.5 9Z" fill="white"/>
                  <path d="M12 6.5C10.62 6.5 9.5 7.62 9.5 9H10.5C10.5 8.17 11.17 7.5 12 7.5S13.5 8.17 13.5 9H14.5C14.5 7.62 13.38 6.5 12 6.5Z" fill="white"/>
                  <path d="M9 11.5C9 12.33 9.67 13 10.5 13H13.5C14.33 13 15 12.33 15 11.5H14C14 11.78 13.78 12 13.5 12H10.5C10.22 12 10 11.78 10 11.5H9Z" fill="white"/>
                </svg>
              </div>
              <h1 className="text-5xl font-inter font-bold text-navy">Stimuli</h1>
            </div>
            <p className="text-xl text-gray-600 mb-8">
              Train your senses. Grow your mind.
            </p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-12">
              Professional sensory training designed for neurodivergent minds. 
              Build focus, memory, and cognitive flexibility through scientifically-designed exercises.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button 
              size="lg"
              className="bg-navy hover:bg-navy/90 text-white px-8 py-4 text-lg font-medium"
              onClick={() => setShowAuthModal(true)}
            >
              Start Your Journey
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-inter font-bold text-navy mb-4">
              Why Choose Stimuli?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform combines neuroscience research with engaging gameplay 
              to create a personalized cognitive training experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Gamepad2 className="text-white" size={24} />
                  </div>
                  <h3 className="font-inter font-semibold text-navy mb-2">
                    Cognitive Games
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Scientifically-designed exercises targeting memory, attention, and processing speed.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="text-white" size={24} />
                  </div>
                  <h3 className="font-inter font-semibold text-navy mb-2">
                    Progress Tracking
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Watch your cognitive abilities grow with detailed analytics and visual progress trees.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Trophy className="text-white" size={24} />
                  </div>
                  <h3 className="font-inter font-semibold text-navy mb-2">
                    Achievements
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Unlock badges and celebrate milestones as you build consistent training habits.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Brain className="text-white" size={24} />
                  </div>
                  <h3 className="font-inter font-semibold text-navy mb-2">
                    Neurodivergent-Friendly
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Designed with accessibility in mind, supporting different learning styles and needs.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-navy to-cyan">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <h2 className="text-3xl font-inter font-bold text-white mb-4">
              Ready to Train Your Mind?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of users who are already improving their cognitive abilities.
            </p>
            <Button 
              size="lg"
              variant="secondary"
              className="bg-white text-navy hover:bg-gray-100 px-8 py-4 text-lg font-medium"
              onClick={() => setShowAuthModal(true)}
            >
              Get Started Today
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Authentication Modal */}
      <SaveProgressModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}
