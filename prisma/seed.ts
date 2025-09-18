import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  // Create an Agency
  const agency = await prisma.agency.create({
    data: {
      name: "Dream Travels",
      logo: "https://example.com/logo.png",
      settings: {
        defaultMarkup: 10,
        gstEnabled: true,
        roundingRules: "nearest",
      },
    },
  });

  // Create Users
  const user1 = await prisma.user.create({
    data: {
      name: "Alice Johnson",
      email: "amankumar51462@gmail.com",
      password: "password123",
      role: "SUPERADMIN",
      agencyId: agency.id,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Bob Smith",
      email: "bob@example.com",
      role: "EXECUTIVE",
      agencyId: agency.id,
    },
  });

  // Create a Client
  const client = await prisma.client.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      city: "Mumbai",
      agencyId: agency.id,
    },
  });

  // Create Services
  const hotel = await prisma.hotel.create({
    data: {
      name: "Sunrise Hotel",
      city: "Goa",
      starCategory: 4,
      roomTypes: [
        { type: "Deluxe", price: 5000 },
        { type: "Suite", price: 8000 },
      ],
      inclusions: "Breakfast included",
      agencyId: agency.id,
    },
  });

  const car = await prisma.car.create({
    data: {
      vehicleType: "Sedan",
      pricingModel: "Per Day",
      maxCapacity: 4,
      agencyId: agency.id,
    },
  });

  const meal = await prisma.meal.create({
    data: {
      type: "Lunch",
      vegOption: true,
      price: 500,
      agencyId: agency.id,
    },
  });

  const activity = await prisma.activity.create({
    data: {
      name: "City Tour",
      description: "Explore the city attractions",
      duration: "Half-day",
      price: 1500,
      agencyId: agency.id,
    },
  });

  // Create a Quotation
  const quotation = await prisma.quotation.create({
    data: {
      clientId: client.id,
      agencyId: agency.id,
      destination: "Goa",
      startDate: new Date("2025-10-01"),
      endDate: new Date("2025-10-05"),
      adults: 2,
      children: 1,
      infants: 0,
      totalAmount: 20000,
      items: {
        create: [
          { serviceType: "HOTEL", serviceId: hotel.id, price: 13000 },
          { serviceType: "CAR", serviceId: car.id, price: 2000 },
          { serviceType: "MEAL", serviceId: meal.id, price: 1500 },
          { serviceType: "ACTIVITY", serviceId: activity.id, price: 1500 },
        ],
      },
      itineraries: {
        create: [
          {
            dayNumber: 1,
            headline: "Arrival & Check-in",
            description: "Reach Goa airport and check in at Sunrise Hotel",
          },
          {
            dayNumber: 2,
            headline: "City Tour",
            description: "Half-day city tour with sightseeing",
          },
        ],
      },
    },
  });

  console.log("Sample data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
