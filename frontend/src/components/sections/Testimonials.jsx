import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import Card from '../ui/Card';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Rajesh Kumar',
      location: 'Mumbai, India',
      event: 'FIFA World Cup 2022',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      review: 'The entire experience was flawless! From booking to the event day, everything was perfectly organized. Watching the World Cup live was a dream come true. The hospitality packages exceeded all my expectations.',
    },
    {
      name: 'Priya Sharma',
      location: 'Delhi, India',
      event: 'Wimbledon 2023',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
      review: 'An unforgettable experience! The VIP access and premium seating made Wimbledon even more special. The team handled all arrangements professionally. Worth every penny!',
    },
    {
      name: 'Arjun Patel',
      location: 'Bangalore, India',
      event: 'IPL Finals 2024',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
      review: 'Absolutely brilliant service! The package included everything - premium seats, pre-match hospitality, and even a meet-and-greet. This is the only way to experience live sports!',
    },
    {
      name: 'Sneha Reddy',
      location: 'Hyderabad, India',
      event: 'French Open 2023',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
      review: 'The trip to Paris for French Open was magical. Every detail was taken care of - flights, hotels, match tickets, and even local tours. Highly recommend their services!',
    },
    {
      name: 'Vikram Singh',
      location: 'Pune, India',
      event: 'NBA Finals 2024',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
      review: 'First time in the US and it was perfect! Court-side seats, luxury hotel, and excellent customer support throughout. Made memories that will last a lifetime.',
    },
    {
      name: 'Ananya Gupta',
      location: 'Chennai, India',
      event: 'Australian Open 2024',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
      review: 'Best sports travel company! Everything was seamless from start to finish. The hospitality suite access and guided tours of Melbourne were amazing bonuses.',
    },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real experiences from sports enthusiasts who traveled with us
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <div className="p-6 flex flex-col h-full">
                  {/* Quote Icon */}
                  <Quote className="w-10 h-10 text-primary-600 mb-4 opacity-50" />
                  
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Review */}
                  <p className="text-gray-600 mb-6 flex-1 italic">
                    "{testimonial.review}"
                  </p>

                  {/* User Info */}
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                      <p className="text-xs text-primary-600 font-medium mt-1">
                        {testimonial.event}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
