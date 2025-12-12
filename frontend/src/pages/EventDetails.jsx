import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import WhatsAppFloat from '../components/layout/WhatsAppFloat';
import LeadModal from '../components/forms/LeadModal';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { 
  Calendar, 
  MapPin, 
  ArrowLeft, 
  Check,
  Star,
  Users,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getById(id);
      
      if (response.success) {
        setEvent(response.data.event);
        setPackages(response.data.packages || []);
      }
    } catch (err) {
      console.error('Error fetching event details:', err);
      setError(err.message || 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (pkg) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-red border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'Unable to load event details'}</p>
          <Button onClick={() => navigate('/')} variant="primary">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="EventDetails">
      <Navbar onContactClick={() => setIsModalOpen(true)} />
      
      <main className="">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-navy via-dark-navy/60 to-transparent"></div>
          </div>
          
          <div className="relative container-custom h-full flex flex-col justify-end pb-12">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white hover:text-primary-red transition-colors mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Events</span>
            </button>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {event.featured && (
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-yellow-400 font-semibold">Featured Event</span>
                </div>
              )}
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                {event.name}
              </h1>
              <div className="flex flex-wrap gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span className="text-lg">{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span className="text-lg">
                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Event Description */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-dark-navy mb-6">About This Event</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>
        </section>

        {/* Packages Section */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-dark-navy mb-4">
                Available Packages
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose the perfect package for your {event.name} experience
              </p>
            </div>

            {packages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No packages available for this event</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {packages.map((pkg, index) => (
                  <motion.div
                    key={pkg._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full flex flex-col overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                      {/* Package Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={pkg.image || event.image}
                          alt={pkg.name}
                          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4 bg-primary-red text-white px-3 py-1 rounded-full text-sm font-semibold">
                          ₹{pkg.basePrice.toLocaleString()}
                        </div>
                      </div>

                      {/* Package Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-2xl font-bold text-dark-navy mb-3">
                          {pkg.name}
                        </h3>
                        <p className="text-gray-600 mb-6 flex-1">
                          {pkg.description}
                        </p>

                        {/* Inclusions */}
                        <div className="mb-6">
                          <h4 className="font-semibold text-dark-navy mb-3 flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-600" />
                            Package Includes:
                          </h4>
                          <ul className="space-y-2">
                            {pkg.inclusions.slice(0, 4).map((inclusion, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-gray-700">
                                <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                <span className="text-sm">{inclusion}</span>
                              </li>
                            ))}
                            {pkg.inclusions.length > 4 && (
                              <li className="text-sm text-gray-500 pl-6">
                                +{pkg.inclusions.length - 4} more inclusions
                              </li>
                            )}
                          </ul>
                        </div>

                        {/* Price Info */}
                        <div className="border-t border-gray-200 pt-4 mb-4">
                          <div className="flex items-baseline justify-between">
                            <span className="text-gray-600">Starting from</span>
                            <div>
                              <span className="text-3xl font-bold text-primary-red">
                                ₹{pkg.basePrice.toLocaleString()}
                              </span>
                              <span className="text-gray-500 text-sm ml-1">per person</span>
                            </div>
                          </div>
                        </div>

                        {/* Book Button */}
                        <Button
                          variant="primary"
                          className="w-full"
                          onClick={() => handleBookNow(pkg)}
                        >
                          Book Now
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Event Info Cards */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-primary-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary-red" />
                </div>
                <h3 className="text-xl font-bold text-dark-navy mb-2">Group Discounts</h3>
                <p className="text-gray-600">
                  Save up to 10% when booking for groups of 5 or more
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-primary-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-primary-red" />
                </div>
                <h3 className="text-xl font-bold text-dark-navy mb-2">Early Bird Offers</h3>
                <p className="text-gray-600">
                  Book 60+ days in advance and get 10% off
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-primary-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-primary-red" />
                </div>
                <h3 className="text-xl font-bold text-dark-navy mb-2">Best Price Guarantee</h3>
                <p className="text-gray-600">
                  We guarantee the best prices for all our packages
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloat />
      
      <LeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        events={[event]}
        selectedEvent={event}
        selectedPackage={selectedPackage}
      />
    </div>
  );
};

export default EventDetails;
