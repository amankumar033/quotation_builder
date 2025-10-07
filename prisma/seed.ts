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

  // Create Agency
  console.log('🏢 Creating agency...');
  const agency = await prisma.agency.create({
    data: {
      name: 'Elite Travel Agency',
      logo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop&crop=center',
      settings: {
        companyName: 'Elite Travel Agency',
        contactEmail: 'info@elitetravel.com',
        contactPhone: '+1-555-0123',
        address: '123 Travel Street, New York, NY 10001',
        currency: 'USD',
        taxRate: 5.0,
        defaultMarkup: 15.0,
        paymentTerms: 'Net 30',
        termsAndConditions: `• Payment due within 30 days of invoice date
• 50% advance required for project commencement
• Late payments subject to 1.5% monthly interest
• Client approves all work before final delivery
• Revisions limited to 3 rounds per deliverable`
      }
    }
  });

  // Create Users
  console.log('👥 Creating users...');
  const hashedPassword = await hash('password123', 12);

  const superAdmin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'superadmin@elitetravel.com',
      password: hashedPassword,
      role: Role.SUPERADMIN,
      agencyId: agency.id,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    }
  });

  const agencyAdmin = await prisma.user.create({
    data: {
      name: 'Agency Manager',
      email: 'manager@elitetravel.com',
      password: hashedPassword,
      role: Role.AGENCYADMIN,
      agencyId: agency.id,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    }
  });

  const executive = await prisma.user.create({
    data: {
      name: 'Travel Executive',
      email: 'executive@elitetravel.com',
      password: hashedPassword,
      role: Role.EXECUTIVE,
      agencyId: agency.id,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    }
  });

  // Create Clients
  console.log('🤝 Creating clients...');
  const clients = await prisma.client.createMany({
    data: [
      {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1-555-0101',
        city: 'New York',
        notes: 'Corporate client, prefers luxury accommodations',
        agencyId: agency.id
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        phone: '+1-555-0102',
        city: 'Los Angeles',
        notes: 'Family traveler, interested in adventure activities',
        agencyId: agency.id
      },
      {
        name: 'Michael Brown',
        email: 'm.brown@example.com',
        phone: '+1-555-0103',
        city: 'Chicago',
        notes: 'Business traveler, frequent trips to Europe',
        agencyId: agency.id
      },
      {
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        phone: '+1-555-0104',
        city: 'Miami',
        notes: 'Honeymoon planner, luxury preferences',
        agencyId: agency.id
      }
    ]
  });

  // Create Hotels with Room Types
  console.log('🏨 Creating hotels...');
  
  // Hotel 1: Luxury Beach Resort
  const hotel1 = await prisma.hotel.create({
    data: {
      name: 'Grand Paradise Resort & Spa',
      city: 'Bali',
      starCategory: 5,
      inclusions: 'Free WiFi, Swimming Pool, Spa, Fitness Center, Breakfast Included',
      cancellation: 'Free cancellation up to 7 days before check-in',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop'
      ]),
      agencyId: agency.id,
      roomTypes: {
        create: [
          {
            type: 'Deluxe Ocean View Room',
            price: 350.00
          },
          {
            type: 'Premium Suite with Private Pool',
            price: 650.00
          },
          {
            type: 'Luxury Villa',
            price: 1200.00
          }
        ]
      }
    }
  });

  // Hotel 2: City Business Hotel
  const hotel2 = await prisma.hotel.create({
    data: {
      name: 'Metropolitan Grand Hotel',
      city: 'New York',
      starCategory: 4,
      inclusions: 'Free WiFi, Business Center, Gym, Restaurant, Airport Shuttle',
      cancellation: 'Free cancellation up to 24 hours before check-in',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop'
      ]),
      agencyId: agency.id,
      roomTypes: {
        create: [
          {
            type: 'Standard King Room',
            price: 280.00
          },
          {
            type: 'Executive Suite',
            price: 450.00
          },
          {
            type: 'Presidential Suite',
            price: 850.00
          }
        ]
      }
    }
  });

  // Hotel 3: Mountain Retreat
  const hotel3 = await prisma.hotel.create({
    data: {
      name: 'Alpine Mountain Lodge',
      city: 'Swiss Alps',
      starCategory: 4,
      inclusions: 'Free WiFi, Hot Tub, Sauna, Ski Storage, Breakfast & Dinner Included',
      cancellation: 'Free cancellation up to 14 days before check-in',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop'
      ]),
      agencyId: agency.id,
      roomTypes: {
        create: [
          {
            type: 'Mountain View Room',
            price: 320.00
          },
          {
            type: 'Deluxe Chalet',
            price: 550.00
          },
          {
            type: 'Family Suite',
            price: 780.00
          }
        ]
      }
    }
  });

  // Create Transport Options
  console.log('🚗 Creating transport options...');
  const transports = await prisma.transport.createMany({
    data: [
      {
        vehicleType: 'Economy Sedan',
        perDay: 80.00,
        perKm: 0.50,
        maxCapacity: 3,
        notes: 'Toyota Corolla or similar',
        photos: JSON.stringify(['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop']),
        agencyId: agency.id
      },
      {
        vehicleType: 'Luxury SUV',
        perDay: 150.00,
        perKm: 0.80,
        maxCapacity: 6,
        notes: 'Mercedes GLE or similar',
        photos: JSON.stringify(['https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop']),
        agencyId: agency.id
      },
      {
        vehicleType: 'Executive Van',
        perDay: 200.00,
        perKm: 1.00,
        maxCapacity: 12,
        notes: 'Mercedes Sprinter or similar',
        photos: JSON.stringify(['https://images.unsplash.com/photo-1563720223485-208bcedf5d79?w=400&h=300&fit=crop']),
        agencyId: agency.id
      },
      {
        vehicleType: 'Luxury Coach',
        perDay: 450.00,
        perKm: 2.50,
        maxCapacity: 40,
        notes: '45-seater luxury coach with AC',
        photos: JSON.stringify(['https://images.unsplash.com/photo-1544620127-51c433f7db35?w=400&h=300&fit=crop']),
        agencyId: agency.id
      }
    ]
  });

  // Create Meal Options
  console.log('🍽️ Creating meal options...');
  const meals = await prisma.meal.createMany({
    data: [
      {
        type: 'Continental Breakfast',
        vegOption: true,
        nonVegOption: true,
        price: 25.00,
        agencyId: agency.id
      },
      {
        type: 'Buffet Lunch',
        vegOption: true,
        nonVegOption: true,
        price: 35.00,
        agencyId: agency.id
      },
      {
        type: 'Fine Dining Dinner',
        vegOption: true,
        nonVegOption: true,
        price: 65.00,
        agencyId: agency.id
      },
      {
        type: 'Picnic Lunch Box',
        vegOption: true,
        nonVegOption: true,
        price: 20.00,
        agencyId: agency.id
      },
      {
        type: 'Special Diet Meal',
        vegOption: true,
        nonVegOption: false,
        price: 30.00,
        agencyId: agency.id
      }
    ]
  });

  // Create Activities
  console.log('🎯 Creating activities...');
  const activities = await prisma.activity.createMany({
    data: [
      {
        name: 'City Sightseeing Tour',
        description: 'Guided tour of major city attractions with professional guide',
        duration: '4 hours',
        price: 75.00,
        photos: JSON.stringify(['https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop']),
        agencyId: agency.id
      },
      {
        name: 'Sunset Cruise',
        description: 'Evening cruise with dinner and live music',
        duration: '3 hours',
        price: 120.00,
        photos: JSON.stringify(['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop']),
        agencyId: agency.id
      },
      {
        name: 'Mountain Hiking Adventure',
        description: 'Guided hiking tour with experienced mountain guides',
        duration: '6 hours',
        price: 95.00,
        photos: JSON.stringify(['https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop']),
        agencyId: agency.id
      },
      {
        name: 'Spa & Wellness Package',
        description: 'Full day spa treatment with massage and wellness activities',
        duration: '5 hours',
        price: 180.00,
        photos: JSON.stringify(['https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop']),
        agencyId: agency.id
      },
      {
        name: 'Cultural Cooking Class',
        description: 'Learn to cook local cuisine with master chefs',
        duration: '3 hours',
        price: 85.00,
        photos: JSON.stringify(['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop']),
        agencyId: agency.id
      }
    ]
  });

  // Create Sample Quotations
  console.log('📄 Creating sample quotations...');
  
  // Get room types for quotations
  const roomTypes = await prisma.roomType.findMany();
  const transportOptions = await prisma.transport.findMany();
  const mealOptions = await prisma.meal.findMany();
  const activityOptions = await prisma.activity.findMany();
  const clientList = await prisma.client.findMany();

  // Quotation 1: Bali Luxury Trip
  const quotation1 = await prisma.quotation.create({
    data: {
      clientId: clientList[0].id,
      agencyId: agency.id,
      clientName: 'John Smith',
      phoneNumber: 1555010101,
      emailAddress: 'john.smith@example.com',
      status: QuotationStatus.SENT,
      destination: {
        city: 'Bali',
        country: 'Indonesia',
        duration: '7 days',
        highlights: ['Beaches', 'Temples', 'Cultural Shows']
      },
      startDate: new Date('2024-06-15'),
      endDate: new Date('2024-06-22'),
      adults: 2,
      children: 0,
      infants: 0,
      totalAmount: 3850.00,
      items: {
        create: [
          {
            serviceType: ServiceType.HOTEL,
            serviceId: hotel1.id,
            description: 'Deluxe Ocean View Room for 7 nights',
            price: 2450.00
          },
          {
            serviceType: ServiceType.CAR,
            serviceId: transportOptions[1].id,
            description: 'Luxury SUV for 7 days',
            price: 1050.00
          },
          {
            serviceType: ServiceType.ACTIVITY,
            serviceId: activityOptions[1].id,
            description: 'Sunset Cruise for 2 persons',
            price: 240.00
          },
          {
            serviceType: ServiceType.ACTIVITY,
            serviceId: activityOptions[4].id,
            description: 'Cultural Cooking Class for 2 persons',
            price: 170.00
          }
        ]
      },
      itineraries: {
        create: [
          {
            dayNumber: 1,
            headline: 'Arrival in Bali',
            description: 'Airport pickup and transfer to Grand Paradise Resort. Evening at leisure to relax and enjoy resort amenities.',
            duration: 'Full day',
            notes: 'Flight arrival at 14:30'
          },
          {
            dayNumber: 2,
            headline: 'Beach Day & Sunset Cruise',
            description: 'Morning at private beach. Evening sunset cruise with dinner and traditional dance performance.',
            duration: 'Full day',
            notes: 'Sunset cruise departs at 17:00'
          },
          {
            dayNumber: 3,
            headline: 'Cultural Temple Tour',
            description: 'Visit to ancient temples and traditional Balinese villages. Learn about local customs and traditions.',
            duration: '6 hours',
            notes: 'Wear modest clothing for temple visits'
          }
        ]
      },
      hotels: {
        create: [
          {
            hotelId: hotel1.id,
            roomTypeId: roomTypes[0].id, // Deluxe Ocean View Room
            price: 350.00
          }
        ]
      },
      transports: {
        create: [
          {
            transportId: transportOptions[1].id, // Luxury SUV
            pricePerDay: 150.00,
            pricePerKm: 0.80
          }
        ]
      },
      meals: {
        create: [
          {
            mealId: mealOptions[0].id, // Continental Breakfast
            price: 25.00
          }
        ]
      },
      activities: {
        create: [
          {
            activityId: activityOptions[1].id, // Sunset Cruise
            price: 120.00
          },
          {
            activityId: activityOptions[4].id, // Cooking Class
            price: 85.00
          }
        ]
      }
    }
  });

  // Quotation 2: New York Business Trip
  const quotation2 = await prisma.quotation.create({
    data: {
      clientId: clientList[2].id,
      agencyId: agency.id,
      clientName: 'Michael Brown',
      phoneNumber: 1555010303,
      emailAddress: 'm.brown@example.com',
      status: QuotationStatus.PENDING,
      destination: {
        city: 'New York',
        country: 'USA',
        duration: '4 days',
        highlights: ['Business Meetings', 'City Tour', 'Broadway Show']
      },
      startDate: new Date('2024-05-10'),
      endDate: new Date('2024-05-14'),
      adults: 1,
      children: 0,
      infants: 0,
      totalAmount: 1850.00,
      items: {
        create: [
          {
            serviceType: ServiceType.HOTEL,
            serviceId: hotel2.id,
            description: 'Executive Suite for 4 nights',
            price: 1800.00
          },
          {
            serviceType: ServiceType.CAR,
            serviceId: transportOptions[0].id,
            description: 'Airport transfers and city transportation',
            price: 320.00
          },
          {
            serviceType: ServiceType.MEAL,
            serviceId: mealOptions[2].id,
            description: 'Daily breakfast included',
            price: 100.00
          }
        ]
      },
      itineraries: {
        create: [
          {
            dayNumber: 1,
            headline: 'Arrival & Business Dinner',
            description: 'Airport transfer to Metropolitan Grand Hotel. Evening business dinner with clients.',
            duration: 'Evening',
            notes: 'Flight arrives at JFK at 16:00'
          },
          {
            dayNumber: 2,
            headline: 'Business Meetings',
            description: 'Full day of business meetings in Manhattan. Lunch meeting at upscale restaurant.',
            duration: 'Full day',
            notes: 'Meetings scheduled from 9:00 to 17:00'
          }
        ]
      },
      hotels: {
        create: [
          {
            hotelId: hotel2.id,
            roomTypeId: roomTypes[4].id, // Executive Suite
            price: 450.00
          }
        ]
      },
      transports: {
        create: [
          {
            transportId: transportOptions[0].id, // Economy Sedan
            pricePerDay: 80.00,
            pricePerKm: 0.50
          }
        ]
      }
    }
  });

  // Create Login History
  console.log('📊 Creating login history...');
  await prisma.loginHistory.createMany({
    data: [
      {
        userId: superAdmin.id,
        ip: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
      {
        userId: agencyAdmin.id,
        ip: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      {
        userId: executive.id,
        ip: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
      }
    ]
  });

  console.log('✅ Database seeding completed successfully!');
  console.log('📊 Summary:');
  console.log(`   - Agency: 1`);
  console.log(`   - Users: 3`);
  console.log(`   - Clients: 4`);
  console.log(`   - Hotels: 3 (with ${roomTypes.length} room types)`);
  console.log(`   - Transport Options: 4`);
  console.log(`   - Meal Options: 5`);
  console.log(`   - Activities: 5`);
  console.log(`   - Quotations: 2`);
  console.log(`   - Login History: 3 entries`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });