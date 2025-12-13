import { motion } from 'framer-motion';
import { Star, Camera, Wine, Gift } from 'lucide-react';
import Card from '../ui/Card';

const AddOnsSection = () => {
  const addOns = [
    {
      icon: Star,
      title: 'VIP Lounge Access',
      description: 'Exclusive access to premium lounges with complimentary food and beverages',
      image: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&q=80',
    },
    {
      icon: Camera,
      title: 'Photo Opportunities',
      description: 'Professional photo sessions with athletes and exclusive behind-the-scenes access',
      image: 'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=400&q=80',
    },
    {
      icon: Wine,
      title: 'Gourmet Dining',
      description: 'World-class dining experiences at premium restaurants near the venue',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
    },
    {
      icon: Gift,
      title: 'Exclusive Merchandise',
      description: 'Limited edition official merchandise and memorabilia included in your package',
      image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&q=80',
    },
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ADD-ONS & VIP EXPERIENCES
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enhance your experience with premium add-ons and exclusive perks
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {addOns.map((addOn, index) => {
            const Icon = addOn.icon;
            return (
              <Card key={index}>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={addOn.image}
                    alt={addOn.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{addOn.title}</h3>
                  <p className="text-gray-600 text-sm">{addOn.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AddOnsSection;
