import { motion } from 'framer-motion';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SampleItinerary = () => {
  const scrollContainerRef = useRef(null);

  const itineraries = [
    {
      id: 1,
      title: 'Hospitality Pass',
      location: 'Nepal',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
      badge: 'Premium',
    },
    {
      id: 2,
      title: 'Meet & Greet',
      location: 'Romania',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80',
      badge: 'Exclusive',
    },
    {
      id: 3,
      title: 'Exclusive Line Treats',
      location: 'Romania',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80',
      badge: 'VIP',
    },
    {
      id: 4,
      title: 'City Tour',
      location: 'Romania',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80',
      badge: 'Included',
    },
  ];

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="section-padding bg-white" id="itinerary">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Sample Itinerary
            </h2>
            <p className="text-xl text-gray-600">
              Experience more than just the game
            </p>
          </motion.div>

          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {itineraries.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-80 group cursor-pointer"
            >
              <div className="relative h-80 rounded-2xl overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute top-4 left-4">
                  <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {item.badge}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-2xl font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-200">{item.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SampleItinerary;
