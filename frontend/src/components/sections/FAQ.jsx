import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'How do I book a sports travel package?',
      answer: 'Booking is simple! Browse our events, select your preferred package, and fill out the enquiry form. Our team will contact you within 24 hours to confirm details, discuss customization options, and complete your booking.',
    },
    {
      question: 'What is included in the packages?',
      answer: 'Our packages typically include match tickets, accommodation, airport transfers, and hospitality options. Premium packages may also include VIP lounge access, guided tours, merchandise, and exclusive meet-and-greet opportunities. Each package details are clearly mentioned on the event page.',
    },
    {
      question: 'Can I customize my package?',
      answer: 'Absolutely! We understand every traveler has unique preferences. You can customize your package by upgrading seats, extending your stay, adding city tours, changing accommodation, or including special experiences. Contact our team to discuss your requirements.',
    },
    {
      question: 'What is your cancellation policy?',
      answer: 'Cancellation policies vary based on the event and how far in advance you cancel. Generally, cancellations made 60+ days before the event receive a full refund minus processing fees. 30-60 days: 50% refund. Less than 30 days: No refund. Event-specific policies will be shared during booking.',
    },
    {
      question: 'Do you provide visa assistance?',
      answer: 'Yes! We provide comprehensive visa assistance for international events. Our team will guide you through the documentation process, help with application forms, and provide invitation letters if required. Visa fees are separate from package costs.',
    },
    {
      question: 'Are flights included in the package?',
      answer: 'Flight inclusion varies by package. Some premium packages include round-trip flights, while standard packages focus on accommodation and event tickets. You can always add flight booking to any package - we work with major airlines to get you the best deals.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept multiple payment methods including bank transfers, credit/debit cards, UPI, and digital wallets. For international bookings, we also accept PayPal and wire transfers. Flexible payment plans are available for bookings made in advance.',
    },
    {
      question: 'How early should I book my package?',
      answer: 'We recommend booking as early as possible, ideally 3-6 months before the event. Early bookings ensure better seat selection, hotel availability, and competitive pricing. Popular events like World Cup or Olympics sell out quickly, so early booking is crucial.',
    },
    {
      question: 'Is travel insurance included?',
      answer: 'Basic travel insurance is included in all our packages, covering trip cancellations, medical emergencies, and baggage loss. For comprehensive coverage including adventure sports or higher medical limits, we can arrange premium insurance at an additional cost.',
    },
    {
      question: 'Can I travel solo or do I need a group?',
      answer: 'Both options are available! We cater to solo travelers, couples, families, and groups. Solo travelers can join group tours or opt for private packages. Group bookings (5+ people) often qualify for special discounts and exclusive perks.',
    },
    {
      question: 'What if the event gets postponed or cancelled?',
      answer: 'In case of event postponement, your package will be automatically transferred to the new dates. If the event is cancelled, you will receive a full refund or credit towards another event. We also handle all rebooking of hotels and flights at no extra cost.',
    },
    {
      question: 'Do you provide support during the trip?',
      answer: 'Yes! We provide 24/7 customer support throughout your journey. You will have a dedicated travel coordinator available via phone/WhatsApp for any assistance. For international trips, we also provide local representatives at the destination.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="section-padding bg-gradient-to-br from-gray-50 to-blue-50" id='FAQs'>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="w-10 h-10 text-primary-600" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Got questions? We've got answers! Find everything you need to know about our services.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 text-lg pr-8">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-primary-600 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-2">
                      <p className="text-gray-600 leading-relaxed border-l-4 border-primary-600 pl-4">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12 p-8 bg-white rounded-2xl shadow-lg border-2 border-primary-100"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Our team is here to help! Contact us directly for personalized assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-full font-semibold hover:bg-primary-600 hover:text-white transition-colors"
            >
              WhatsApp Support
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
