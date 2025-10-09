// prisma/seed.ts
import { PrismaClient, Role, QuotationStatus, ServiceType } from '../src/generated/prisma';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  console.log('🗑️ Clearing existing data...');
  await prisma.verificationToken.deleteMany();
  await prisma.loginHistory.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.quotationActivity.deleteMany();
  await prisma.quotationMeal.deleteMany();
  await prisma.quotationTransport.deleteMany();
  await prisma.quotationHotel.deleteMany();
  await prisma.quotationItem.deleteMany();
  await prisma.itinerary.deleteMany();
  await prisma.quotation.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.meal.deleteMany();
  await prisma.quotationTransport.deleteMany();
  await prisma.transport.deleteMany();
  await prisma.roomType.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();
  await prisma.agency.deleteMany();

  const agency = await prisma.agency.upsert({
    where: { id: 'AGC1' },
    update: {},
    create: {
      id: 'AGC1',
      name: 'Travel Master Agency',
      logo: 'https://example.com/logo.png',
      settings: {},
    },
  })
  console.log('✅ Agency created:', agency.name)

  // Create Sample Hotel with Rooms, Meals, and Activities
  const hotel = await prisma.hotel.create({
    data: {
      name: 'Grand Plaza Hotel',
      city: 'New Delhi',
      starCategory: 5,
      cancellation: 'Free cancellation up to 24 hours before check-in',
      inclusions: JSON.stringify(['Free WiFi', 'Swimming Pool', 'Fitness Center', 'Spa']),
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'
      ]),
      agencyId: 'AGC1',
      roomTypes: {
        create: [
          {
            type: 'Deluxe Room',
            price: 4500,
            maxAdults: 2,
            maxChildren: 1,
            bedType: 'King Bed',
            amenities: JSON.stringify(['Free WiFi', 'AC', 'TV', 'Mini Bar', 'Room Service']),
            description: 'Spacious room with city view and modern amenities',
            image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=250&fit=crop',
          },
          {
            type: 'Executive Suite',
            price: 7500,
            maxAdults: 3,
            maxChildren: 2,
            bedType: 'King Bed + Sofa Bed',
            amenities: JSON.stringify(['Free WiFi', 'AC', 'TV', 'Mini Bar', 'Room Service', 'Living Area']),
            description: 'Luxurious suite with separate living area and premium amenities',
            image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=250&fit=crop',
          }
        ],
      },
      meals: {
        create: [
          {
            name: 'Continental Breakfast',
            type: 'breakfast',
            category: 'veg',
            vegOption: true,
            nonVegOption: false,
            price: 450,
            image: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400&h=300&fit=crop',
            agencyId: 'AGC1',
          },
          {
            name: 'Gourmet Dinner Buffet',
            type: 'dinner',
            category: 'non-veg',
            vegOption: false,
            nonVegOption: true,
            price: 1200,
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
            agencyId: 'AGC1',
          }
        ],
      },
      activities: {
        create: [
          {
            name: 'Swimming Pool Access',
            description: 'Unlimited access to our temperature-controlled swimming pool',
            price: 500,
            duration: 'All day',
            photos: JSON.stringify([
              'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=400&h=300&fit=crop'
            ]),
            image: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=400&h=300&fit=crop',
            agencyId: 'AGC1',
          },
          {
            name: 'Spa Therapy Session',
            description: 'Relaxing 60-minute spa therapy with professional therapists',
            price: 2500,
            duration: '60 minutes',
            photos: JSON.stringify([
              'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop'
            ]),
            image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop',
            agencyId: 'AGC1',
          }
        ],
      },
    },
  })
  console.log('✅ Hotel created:', hotel.name)

  // Create Standalone Meals (not associated with any hotel)
  const standaloneMeals = await prisma.meal.createMany({
    data: [
      {
        name: 'Airport Lunch Box',
        type: 'lunch',
        category: 'veg',
        vegOption: true,
        nonVegOption: false,
        price: 350,
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
        agencyId: 'AGC1',
      },
      {
        name: 'Special Welcome Drink',
        type: 'beverage',
        category: 'veg',
        vegOption: true,
        nonVegOption: false,
        price: 150,
        image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=300&fit=crop',
        agencyId: 'AGC1',
      }
    ],
  })
  console.log('✅ Standalone meals created')

  // Create Standalone Activities (not associated with any hotel)
  const standaloneActivities = await prisma.activity.createMany({
    data: [
      {
        name: 'City Tour',
        description: 'Guided tour of the city with experienced local guide',
        price: 1500,
        duration: '4 hours',
        photos: JSON.stringify([
          'https://images.unsplash.com/photo-1519996529932-47fb0dd54b75?w=400&h=300&fit=crop'
        ]),
        image: 'https://images.unsplash.com/photo-1519996529932-47fb0dd54b75?w=400&h=300&fit=crop',
        agencyId: 'AGC1',
      },
      {
        name: 'Adventure Trekking',
        description: 'Exciting mountain trekking experience with safety gear',
        price: 2000,
        duration: '6 hours',
        photos: JSON.stringify([
          'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop'
        ]),
        image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop',
        agencyId: 'AGC1',
      }
    ],
  })
  console.log('✅ Standalone activities created')

  console.log('🌱 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })