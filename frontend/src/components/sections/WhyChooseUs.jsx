import { motion } from 'framer-motion';
import { Users, Award, Globe, Shield } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: Users,
      stat: '12,000+',
      label: 'Happy Travelers',
      description: 'Join thousands of satisfied customers'
    },
    {
      icon: Award,
      stat: '68%',
      label: 'Free Transfers',
      description: 'Complimentary airport transfers'
    },
    {
      icon: Globe,
      stat: '50+',
      label: 'Global Events',
      description: 'Access to worldwide sporting events'
    },
    {
      icon: Shield,
      stat: '4.9/5',
      label: 'Customer Rating',
      description: 'Trusted by sports enthusiasts'
    },
  ];

  return (
    <section className="section-padding bg-white" id="why-us">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Us
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We make sports travel simple, memorable, and hassle-free
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-all"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <Icon className="w-8 h-8 text-primary-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{feature.stat}</div>
                <div className="text-lg font-semibold text-gray-900 mb-2">{feature.label}</div>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
