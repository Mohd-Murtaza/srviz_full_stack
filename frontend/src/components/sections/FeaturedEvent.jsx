import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const FeaturedEvent = ({ event }) => {
  const navigate = useNavigate();
  
  if (!event) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <section className="section-padding bg-gradient-to-br from-dark-900 to-dark-800" id="featured">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-primary-500/10 text-primary-400 rounded-full text-sm font-semibold mb-4">
            Featured Event
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Don't Miss This!
          </h2>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <Card hoverable={false} className="overflow-hidden">
            <div className="relative min-h-[500px] md:min-h-[600px]">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src="https://c.files.bbci.co.uk/cea1/live/1de105b0-f5a5-11ef-bcea-7b70a14a5556.jpg"
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
                {/* Dark Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/0" />
                <div className="absolute top-4 left-4 bg-primary-600 text-white px-4 py-2 rounded-full font-bold z-10">
                  Featured
                </div>
              </div>

              {/* Content Overlay */}
              <div className="relative z-10 p-8 md:p-12 flex flex-col justify-center h-full min-h-[500px] md:min-h-[600px]">
                <div className="max-w-2xl">
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
                    {event.name}
                  </h3>
                  <p className="text-gray-200 text-base md:text-lg mb-6 md:mb-8 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="space-y-3 mb-6 md:mb-8">
                    <div className="flex items-center gap-3 text-gray-200">
                      <Calendar className="w-5 h-5 text-primary-400" />
                      <span className="text-sm md:text-base">
                        {formatDate(event.startDate)} - {formatDate(event.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-200">
                      <MapPin className="w-5 h-5 text-primary-400" />
                      <span className="text-sm md:text-base">{event.location}</span>
                    </div>
                  </div>

                  <div>
                    <Button 
                      variant="primary" 
                      size="lg"
                      onClick={() => navigate(`/events/${event._id}`)}
                      className="w-full sm:w-auto"
                    >
                      View Details
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvent;
