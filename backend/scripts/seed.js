import mongoose from 'mongoose';
import { config } from 'dotenv';
import Event from '../models/event.model.js';
import Package from '../models/package.model.js';

config();

// Sample data
const events = [
  {
    name: 'Wimbledon 2026',
    description: 'Experience the most prestigious tennis tournament in the world at the All England Lawn Tennis Club.',
    location: 'London, England',
    startDate: new Date('2026-06-29'),
    endDate: new Date('2026-07-12'),
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800',
    featured: false,
    active: true
  },
  {
    name: 'NBA Finals 2026',
    description: 'Witness basketball history at the NBA Finals. Premium seats and exclusive hospitality packages available.',
    location: 'USA',
    startDate: new Date('2026-06-04'),
    endDate: new Date('2026-06-21'),
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
    featured: false,
    active: true
  },
  {
    name: 'F1 Japan Grand Prix',
    description: 'Feel the adrenaline rush at the legendary Suzuka Circuit. Watch F1 racing at its finest with world-class hospitality.',
    location: 'Suzuka, Japan',
    startDate: new Date('2026-04-05'),
    endDate: new Date('2026-04-07'),
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800',
    featured: true,
    active: true
  }
];

const packages = [
  // Wimbledon packages
  {
    name: 'Centre Court Premium',
    description: 'Premium seats at Centre Court with hospitality lounge access, gourmet meals, and meet & greet opportunities.',
    basePrice: 178500,
    inclusions: [
      'Centre Court tickets (Finals)',
      'Hospitality lounge access',
      'Gourmet lunch & afternoon tea',
      '5-star hotel accommodation (3 nights)',
      'Airport transfers',
      'Tour guide'
    ],
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600',
    active: true
  },
  {
    name: 'Wimbledon Classic',
    description: 'Enjoy the tradition of Wimbledon with excellent court views and classic British hospitality.',
    basePrice: 89250,
    inclusions: [
      'Court 1 tickets',
      'Standard hospitality',
      '4-star hotel (2 nights)',
      'Breakfast included',
      'City tour'
    ],
    image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600',
    active: true
  },
  // NBA Finals packages
  {
    name: 'Courtside Experience',
    description: 'Get closer to the action with courtside seats. Includes VIP lounge access and exclusive merchandise.',
    basePrice: 245000,
    inclusions: [
      'Courtside seats (2 games)',
      'VIP lounge access',
      'Pre-game meet & greet',
      'Luxury hotel (4 nights)',
      'Official NBA jersey',
      'Airport transfers'
    ],
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600',
    active: true
  },
  {
    name: 'NBA Finals Standard',
    description: 'Experience the excitement of NBA Finals with great seats and comfortable accommodations.',
    basePrice: 122500,
    inclusions: [
      'Lower bowl seats (1 game)',
      '3-star hotel (3 nights)',
      'Breakfast included',
      'City tour',
      'Team merchandise'
    ],
    image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=600',
    active: true
  },
  // F1 Japan packages
  {
    name: 'Paddock Club Premium',
    description: 'Ultimate F1 experience with Paddock Club access, pit lane walks, and driver meet & greets.',
    basePrice: 298000,
    inclusions: [
      'Paddock Club access (3 days)',
      'Pit lane walk',
      'Driver meet & greet',
      'Gourmet dining',
      '5-star hotel (4 nights)',
      'Airport transfers',
      'English-speaking guide'
    ],
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600',
    active: true
  },
  {
    name: 'Grandstand Experience',
    description: 'Enjoy panoramic views of Suzuka Circuit from premium grandstand seats with great amenities.',
    basePrice: 149000,
    inclusions: [
      'Grandstand seats (Race day)',
      'Practice & Qualifying access',
      '4-star hotel (3 nights)',
      'Meals included',
      'Circuit tour',
      'F1 merchandise'
    ],
    image: 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?w=600',
    active: true
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Event.deleteMany({});
    await Package.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert events
    const createdEvents = await Event.insertMany(events);
    console.log(`✅ Created ${createdEvents.length} events`);

    // Map packages to events
    const packagesWithEvents = [
      { ...packages[0], event: createdEvents[0]._id }, // Wimbledon 1
      { ...packages[1], event: createdEvents[0]._id }, // Wimbledon 2
      { ...packages[2], event: createdEvents[1]._id }, // NBA 1
      { ...packages[3], event: createdEvents[1]._id }, // NBA 2
      { ...packages[4], event: createdEvents[2]._id }, // F1 1
      { ...packages[5], event: createdEvents[2]._id }, // F1 2
    ];

    // Insert packages
    const createdPackages = await Package.insertMany(packagesWithEvents);
    console.log(`✅ Created ${createdPackages.length} packages`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Events: ${createdEvents.length}`);
    console.log(`   Packages: ${createdPackages.length}`);
    console.log('\n📋 Events:');
    createdEvents.forEach(event => {
      console.log(`   - ${event.name} (${event.location})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
