import { motion } from 'framer-motion';
import { Search, Calendar, Plane } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      icon: Search,
      title: 'Choose Your Event',
      description: 'Browse our selection of world-class sporting events and select your dream destination.',
    },
    {
      number: '02',
      icon: Calendar,
      title: 'We Arrange Travel + Tickets',
      description: 'Our team handles everything - flights, hotels, event tickets, and premium hospitality.',
    },
    {
      number: '03',
      icon: Plane,
      title: 'Enjoy Your Experience',
      description: 'Relax and enjoy a seamless sports experience with 24/7 support throughout your journey.',
    },
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-primary-50 to-red-50" id="how-it-works">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Three simple steps to your unforgettable sports adventure
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden md:block absolute top-20 left-0 right-0 h-1 bg-primary-200">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500" />
          </div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all relative z-10">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-primary text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6 mt-4">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
