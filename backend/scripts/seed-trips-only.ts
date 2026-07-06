import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { UserEntity, UserRole } from '../src/entities/user.entity';
import { VendorEntity } from '../src/entities/vendor.entity';
import { TripEntity, TripCategory, TripDifficulty, TripStatus } from '../src/entities/trip.entity';
import { TripLocationEntity } from '../src/entities/trip-location.entity';
import { TripPriceEntity, PriceType } from '../src/entities/trip-price.entity';
import { TripDateEntity, DateStatus } from '../src/entities/trip-date.entity';
import { TripItineraryEntity } from '../src/entities/trip-itinerary.entity';
import { TripMediaEntity, MediaType } from '../src/entities/trip-media.entity';

dotenv.config();

async function seedDatabase() {
  console.log('Starting Extended Trips-Only Seeding...');

  const dbType = process.env.DB_TYPE || 'postgres';
  const dataSourceConfig: any = {
    entities: [__dirname + '/../src/entities/*.entity{.ts,.js}'],
    synchronize: false,
    logging: false,
  };

  if (dbType === 'better-sqlite3') {
    dataSourceConfig.type = 'better-sqlite3';
    dataSourceConfig.database = './dev.db';
  } else {
    dataSourceConfig.type = 'postgres';
    dataSourceConfig.url = process.env.DATABASE_URL;
    dataSourceConfig.schema = 'tripdekho';
  }

  const dataSource = new DataSource(dataSourceConfig);
  await dataSource.initialize();
  console.log(`Connected to database...`);

  try {
    const userRepo = dataSource.getRepository(UserEntity);
    const vendorProfileRepo = dataSource.getRepository(VendorEntity);
    const tripRepo = dataSource.getRepository(TripEntity);

    let defaultVendor = await vendorProfileRepo.findOne({ where: { businessName: 'TripDekho Official Partner' } });

    if (!defaultVendor) {
      let defaultUser = await userRepo.findOne({ where: { email: 'partner@tripdekho.com' } });
      if (!defaultUser) {
        const salt = await bcrypt.genSalt(10);
        const commonPasswordHash = await bcrypt.hash('password123', salt);
        defaultUser = userRepo.create({
          id: uuidv4(),
          name: 'Official Partner',
          email: 'partner@tripdekho.com',
          passwordHash: commonPasswordHash,
          role: UserRole.VENDOR,
          isEmailVerified: true,
          isActive: true,
        });
        await userRepo.save(defaultUser);
      }

      defaultVendor = vendorProfileRepo.create({
        id: uuidv4(),
        user: { id: defaultUser.id },
        businessName: 'TripDekho Official Partner',
        description: 'Verified partner for premium trips.',
        contactEmail: 'partner@tripdekho.com',
        contactPhone: '9988776655',
        verificationStatus: 'verified',
        kycStatus: 'verified',
        verifiedAt: new Date(),
      });
      await vendorProfileRepo.save(defaultVendor);
    }

    const tripsToCreate = [
      {
        slugPrefix: 'hike-valley',
        title: 'Flower Valley Nature Hike',
        category: TripCategory.HIKE,
        tags: ['weekend-escape', 'Nature', 'Hike'],
        imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80'
      },
      {
        slugPrefix: 'offbeat-village',
        title: 'Hidden Himalayan Village Homestay',
        category: TripCategory.OFFBEAT,
        tags: ['budget-stay', 'Culture', 'Offbeat'],
        imageUrl: 'https://images.unsplash.com/photo-1542640244-7e672d6cb466?auto=format&fit=crop&w=800&q=80'
      },
      {
        slugPrefix: 'beach-paradise',
        title: 'Andaman Crystal Waters',
        category: TripCategory.BEACH,
        tags: ['weekend-escape', 'Beach', 'Luxury'],
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
      },
      {
        slugPrefix: 'heritage-forts',
        title: 'Rajasthan Royal Forts Tour',
        category: TripCategory.HERITAGE,
        tags: ['Culture', 'Heritage', 'History'],
        imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80'
      },
      {
        slugPrefix: 'spiritual-ganges',
        title: 'Varanasi Spiritual Journey',
        category: TripCategory.SPIRITUAL,
        tags: ['budget-stay', 'Spiritual', 'Yoga'],
        imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=800&q=80'
      },
      {
        slugPrefix: 'mountain-expedition',
        title: 'Everest Base Camp Expedition',
        category: TripCategory.MOUNTAIN,
        tags: ['Trekking', 'Himalayas', 'Mountain'],
        imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
      }
    ];

    const trips = [];
    for (const tripData of tripsToCreate) {
      const tripId = uuidv4();
      const trip = tripRepo.create({
        id: tripId,
        slug: `${tripData.slugPrefix}-${tripId.substring(0,6)}`,
        title: tripData.title,
        shortDescription: `Experience the best of ${tripData.category} travel with this exclusive trip.`,
        description: `Join us on an unforgettable journey. Perfect for those looking for ${tripData.tags.join(', ')}.`,
        vendor: { id: defaultVendor.id },
        category: [tripData.category],
        difficulty: TripDifficulty.MODERATE,
        durationDays: 5,
        durationNights: 4,
        minGroupSize: 2,
        maxGroupSize: 15,
        highlights: ['Expert Guides', 'Premium Accommodation'],
        inclusions: ['Meals', 'Stay', 'Transport'],
        exclusions: ['Flights', 'Personal Expenses'],
        requirements: ['Basic fitness'],
        thingsToCarry: ['Comfortable clothes', 'Water bottle'],
        tags: tripData.tags,
        status: TripStatus.PUBLISHED,
        isActive: true,
        isFeatured: true,
      });

      trip.location = dataSource.getRepository(TripLocationEntity).create({
        trip: trip,
        city: 'Destination City',
        state: 'Destination State',
        country: 'India',
        address: 'Main Hub',
        lat: 20.0,
        lng: 78.0,
        startLocation: 'Airport',
        endLocation: 'Airport',
        pickupLocations: ['Airport', 'Hotel']
      });

      trip.price = dataSource.getRepository(TripPriceEntity).create({
        trip: trip,
        amount: Math.floor(Math.random() * 10000) + 5000,
        originalPrice: Math.floor(Math.random() * 10000) + 15000,
        priceType: PriceType.PER_PERSON,
        currency: 'INR'
      });

      trip.media = [
        dataSource.getRepository(TripMediaEntity).create({
          trip: trip,
          url: tripData.imageUrl,
          publicId: `tripdekho/${tripData.slugPrefix}`,
          caption: 'Beautiful scenery',
          isPrimary: true,
          type: MediaType.IMAGE
        })
      ];

      trips.push(trip);
    }

    await tripRepo.save(trips);

    console.log(`✅ Successfully injected ${trips.length} new trips covering all empty categories and tags!`);
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await dataSource.destroy();
  }
}

seedDatabase();
