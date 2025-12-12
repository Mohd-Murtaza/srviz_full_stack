import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import Button from '../ui/Button';

const HeroSection = ({ onContactClick }) => {
  return (
    <section className="relative min-h-screen h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-0">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-hero-pattern" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom text-center text-white px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-block mb-4 md:mb-6"
          >
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 md:px-6 rounded-full text-xs md:text-sm border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Premium Sports Travel Packages
            </span>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight px-2">
            SPORTS TRAVEL<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-red-400">
              PACKAGES FOR<br />
              GLOBAL EVENTS
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-6 md:mb-8 max-w-3xl mx-auto px-4">
            Experience the world's greatest sporting events with premium hospitality packages. 
            From F1 to Grand Slams, we make your sports dreams come true.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 px-4">
            <Button variant="primary" size="lg" onClick={onContactClick} className="w-full sm:w-auto">
              Plan My Trip
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Play className="w-5 h-5" />
              Watch Video
            </Button>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-3 gap-4 md:gap-8 mt-8 md:mt-16 max-w-2xl mx-auto px-4"
          >
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-400">12K+</div>
              <div className="text-xs sm:text-sm text-gray-300 mt-1">Happy Travelers</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-400">68%</div>
              <div className="text-xs sm:text-sm text-gray-300 mt-1">Free Transfers</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-400">4.9/5</div>
              <div className="text-xs sm:text-sm text-gray-300 mt-1">Rating</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:flex"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-2 bg-white rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
