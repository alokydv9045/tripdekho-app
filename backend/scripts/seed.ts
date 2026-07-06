import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { UserEntity, UserRole } from '../src/entities/user.entity';
import { GlobalSettingEntity } from '../src/entities/global-setting.entity';
import { PromoCodeEntity, DiscountType } from '../src/entities/promo-code.entity';
import { VendorEntity } from '../src/entities/vendor.entity';
import { TripEntity, TripCategory, TripDifficulty, TripStatus } from '../src/entities/trip.entity';
import { TripLocationEntity } from '../src/entities/trip-location.entity';
import { TripPriceEntity, PriceType } from '../src/entities/trip-price.entity';
import { TripDateEntity, DateStatus } from '../src/entities/trip-date.entity';
import { TripItineraryEntity } from '../src/entities/trip-itinerary.entity';
import { TripMediaEntity, MediaType } from '../src/entities/trip-media.entity';
import { BookingEntity, PaymentStatus as BookingPaymentStatus, BookingStatus } from '../src/entities/booking.entity';
import { PaymentEntity, PaymentType, PaymentStatus, PaymentMethod } from '../src/entities/payment.entity';
import { CampaignEntity } from '../src/entities/campaign.entity';
import { InquiryEntity } from '../src/entities/inquiry.entity';
import { NewsletterSubscriberEntity } from '../src/entities/newsletter-subscriber.entity';
import { PayoutEntity, PayoutStatus } from '../src/entities/payout.entity';
import { PayoutLedgerEntity, LedgerEntryType, LedgerStatus, EscrowStatus } from '../src/entities/payout-ledger.entity';
import { VendorBankAccountEntity } from '../src/entities/vendor-bank-account.entity';
import { ReferralCodeEntity } from '../src/entities/referral-code.entity';
import { ReferralEntity } from '../src/entities/referral.entity';
import { LoyaltyPointEntity } from '../src/entities/loyalty-point.entity';
import { PointTransactionEntity } from '../src/entities/point-transaction.entity';
import { RewardRuleEntity, RewardTrigger, RecipientType, TargetUserType } from '../src/entities/reward-rule.entity';
import { RewardRedemptionEntity } from '../src/entities/reward-redemption.entity';

dotenv.config();

async function seedDatabase() {
  console.log('Starting Full Database Seeding...');

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
  console.log(`Connected to database of type: ${dbType}`);

  // WIPE DATABASE
  console.log('Wiping existing data for a clean slate...');
  if (dbType === 'better-sqlite3') {
    await dataSource.query(`DELETE FROM "payments";`);
    await dataSource.query(`DELETE FROM "bookings";`);
    await dataSource.query(`DELETE FROM "payout_ledgers";`);
    await dataSource.query(`DELETE FROM "payouts";`);
    await dataSource.query(`DELETE FROM "vendor_bank_accounts";`);
    await dataSource.query(`DELETE FROM "trips";`);
    await dataSource.query(`DELETE FROM "vendors";`);
    await dataSource.query(`DELETE FROM "promo_codes";`);
    await dataSource.query(`DELETE FROM "global_settings";`);
    await dataSource.query(`DELETE FROM "campaigns";`);
    await dataSource.query(`DELETE FROM "inquiries";`);
    await dataSource.query(`DELETE FROM "newsletter_subscribers";`);
    await dataSource.query(`DELETE FROM "reward_redemptions";`);
    await dataSource.query(`DELETE FROM "reward_rules";`);
    await dataSource.query(`DELETE FROM "point_transactions";`);
    await dataSource.query(`DELETE FROM "loyalty_points";`);
    await dataSource.query(`DELETE FROM "referrals";`);
    await dataSource.query(`DELETE FROM "referral_codes";`);
    await dataSource.query(`DELETE FROM "users";`);
  } else {
    await dataSource.query(`TRUNCATE TABLE "tripdekho"."payments" CASCADE;`);
    await dataSource.query(`TRUNCATE TABLE "tripdekho"."bookings" CASCADE;`);
    await dataSource.query(`TRUNCATE TABLE "tripdekho"."payout_ledgers" CASCADE;`);
    await dataSource.query(`TRUNCATE TABLE "tripdekho"."payouts" CASCADE;`);
    await dataSource.query(`TRUNCATE TABLE "tripdekho"."vendor_bank_accounts" CASCADE;`);
    await dataSource.query(`TRUNCATE TABLE "tripdekho"."trips" CASCADE;`);
    await dataSource.query(`TRUNCATE TABLE "tripdekho"."vendors" CASCADE;`);
    await dataSource.query(`TRUNCATE TABLE "tripdekho"."promo_codes" CASCADE;`);
    await dataSource.query(`TRUNCATE TABLE "tripdekho"."global_settings" CASCADE;`);
    await dataSource.query(`TRUNCATE TABLE "tripdekho"."campaigns" CASCADE;`);
    await dataSource.query(`TRUNCATE TABLE "tripdekho"."inquiries" CASCADE;`);
    await dataSource.query(`TRUNCATE TABLE "tripdekho"."newsletter_subscribers" CASCADE;`);
    await dataSource.query(`TRUNCATE TABLE "tripdekho"."reward_redemptions" CASCADE;`);
    await dataSource.query(`TRUNCATE TABLE "tripdekho"."reward_rules" CASCADE;`);
    await dataSource.query(`TRUNCATE TABLE "tripdekho"."point_transactions" CASCADE;`);
    await dataSource.query(`TRUNCATE TABLE "tripdekho"."loyalty_points" CASCADE;`);
    await dataSource.query(`TRUNCATE TABLE "tripdekho"."referrals" CASCADE;`);
    await dataSource.query(`TRUNCATE TABLE "tripdekho"."referral_codes" CASCADE;`);
    await dataSource.query(`TRUNCATE TABLE "tripdekho"."users" CASCADE;`);
  }
  console.log('Database wiped successfully.');

  try {
    const salt = await bcrypt.genSalt(10);
    const commonPasswordHash = await bcrypt.hash('password123', salt);

    // 1. Create Users
    console.log('Seeding Users...');
    const userRepo = dataSource.getRepository(UserEntity);
    
    const adminUser = userRepo.create({
      id: uuidv4(),
      name: 'System Admin',
      email: 'admin@tripdekho.com',
      passwordHash: commonPasswordHash,
      role: UserRole.SUPER_ADMIN,
      isEmailVerified: true,
      isActive: true,
    });

    const vendorUser1 = userRepo.create({
      id: uuidv4(),
      name: 'Himalayan Adventures',
      email: 'vendor@tripdekho.com',
      passwordHash: commonPasswordHash,
      role: UserRole.VENDOR,
      isEmailVerified: true,
      isActive: true,
    });

    const vendorUser2 = userRepo.create({
      id: uuidv4(),
      name: 'Goa Coastal Escapes',
      email: 'vendor2@tripdekho.com',
      passwordHash: commonPasswordHash,
      role: UserRole.VENDOR,
      isEmailVerified: true,
      isActive: true,
    });

    const vendorUser3 = userRepo.create({
      id: uuidv4(),
      name: 'Heritage India Tours',
      email: 'vendor3@tripdekho.com',
      passwordHash: commonPasswordHash,
      role: UserRole.VENDOR,
      isEmailVerified: true,
      isActive: true,
    });

    const customerUser1 = userRepo.create({
      id: uuidv4(),
      name: 'John Doe',
      email: 'customer@tripdekho.com',
      passwordHash: commonPasswordHash,
      role: UserRole.CUSTOMER,
      isEmailVerified: true,
      isActive: true,
      phone: '9876543210'
    });

    const customerUser2 = userRepo.create({
      id: uuidv4(),
      name: 'Jane Smith',
      email: 'customer2@tripdekho.com',
      passwordHash: commonPasswordHash,
      role: UserRole.CUSTOMER,
      isEmailVerified: true,
      isActive: true,
      phone: '9876543211'
    });

    await userRepo.save([adminUser, vendorUser1, vendorUser2, vendorUser3, customerUser1, customerUser2]);

    // 2. Create Global Settings
    console.log('Seeding Global Settings...');
    const settingsRepo = dataSource.getRepository(GlobalSettingEntity);
    await settingsRepo.save(settingsRepo.create({
      id: uuidv4(),
      configName: 'default',
      brandPhone: '+91-9876543210',
      brandEmail: 'support@tripdekho.com',
      brandDescription: 'Your premium, next-generation travel booking and AI custom planning platform.',
      brandAddress: '101 Horizon Tower, Sector 62, Noida, UP, India',
      whatsappNumber: '+91-9876543210',
      commissionRates: { base: 10, vendor: 8 },
      heroStats: { happyTravelers: 12500, tripsCompleted: 3400, activeVendors: 45 },
      socialLinks: { facebook: 'fb.com/tripdekho', instagram: 'ig.com/tripdekho', twitter: 'x.com/tripdekho' },
      isMaintenanceMode: false,
      alertActive: false,
    }));

    // 2.5 Seed Reward Rules
    console.log('Seeding Reward Rules...');
    const rewardRulesRepo = dataSource.getRepository(RewardRuleEntity);
    await rewardRulesRepo.save([
      rewardRulesRepo.create({
        id: uuidv4(),
        name: 'Referral Signup Bonus',
        trigger: RewardTrigger.REFERRAL_SIGNUP,
        userType: TargetUserType.ALL,
        recipientType: RecipientType.REFERRED,
        points: 50,
        isActive: true,
      }),
      rewardRulesRepo.create({
        id: uuidv4(),
        name: 'Referrer Signup Reward',
        trigger: RewardTrigger.REFERRAL_SIGNUP,
        userType: TargetUserType.ALL,
        recipientType: RecipientType.REFERRER,
        points: 100,
        isActive: true,
      })
    ]);

    // 3. Create Vendor Profiles
    console.log('Seeding Vendor Profiles...');
    const vendorProfileRepo = dataSource.getRepository(VendorEntity);
    
    const vendorProfile1 = vendorProfileRepo.create({
      id: uuidv4(),
      user: { id: vendorUser1.id },
      businessName: 'Himalayan Adventures Ltd',
      description: 'Pioneers in high-altitude trekking, mountaineering expeditions, and wilderness camping in Northern India.',
      contactEmail: 'contact@himalayanadventures.com',
      contactPhone: '9988776655',
      verificationStatus: 'verified',
      kycStatus: 'verified',
      verifiedAt: new Date(),
    });

    const vendorProfile2 = vendorProfileRepo.create({
      id: uuidv4(),
      user: { id: vendorUser2.id },
      businessName: 'Goa Coastal Escapes',
      description: 'Luxury retreats, yacht cruises, yoga camps, and bespoke coastal lifestyle holidays in South and North Goa.',
      contactEmail: 'info@goacoastalescapes.com',
      contactPhone: '9988776656',
      verificationStatus: 'verified',
      kycStatus: 'verified',
      verifiedAt: new Date(),
    });

    const vendorProfile3 = vendorProfileRepo.create({
      id: uuidv4(),
      user: { id: vendorUser3.id },
      businessName: 'Heritage India Tours',
      description: 'Curated cultural walks, historical sightseeing, palace stays, and spiritual guides across heritage cities in India.',
      contactEmail: 'booking@heritageindiatours.com',
      contactPhone: '9988776657',
      verificationStatus: 'verified',
      kycStatus: 'verified',
      verifiedAt: new Date(),
    });

    await vendorProfileRepo.save([vendorProfile1, vendorProfile2, vendorProfile3]);

    // 4. Create Vendor Bank Accounts
    console.log('Seeding Vendor Bank Accounts...');
    const bankRepo = dataSource.getRepository(VendorBankAccountEntity);
    await bankRepo.save([
      bankRepo.create({
        id: uuidv4(),
        vendor: vendorProfile1,
        accountHolderName: 'Himalayan Adventures Ltd',
        accountNumberEncrypted: '123456789012',
        ifscCode: 'SBIN0001234',
        bankName: 'State Bank of India',
        branchName: 'Lohajung Base Branch',
        accountType: 'current',
        isVerified: true,
        isPrimary: true,
        verifiedAt: new Date()
      }),
      bankRepo.create({
        id: uuidv4(),
        vendor: vendorProfile2,
        accountHolderName: 'Goa Coastal Escapes LLC',
        accountNumberEncrypted: '987654321098',
        ifscCode: 'HDFC0004321',
        bankName: 'HDFC Bank',
        branchName: 'Panaji Corporate Hub',
        accountType: 'current',
        isVerified: true,
        isPrimary: true,
        verifiedAt: new Date()
      }),
      bankRepo.create({
        id: uuidv4(),
        vendor: vendorProfile3,
        accountHolderName: 'Heritage India Tours',
        accountNumberEncrypted: '556677889900',
        ifscCode: 'ICIC0009876',
        bankName: 'ICICI Bank',
        branchName: 'Varanasi Assi Ghat Branch',
        accountType: 'savings',
        isVerified: true,
        isPrimary: true,
        verifiedAt: new Date()
      })
    ]);

    // 5. Create Promo Codes
    console.log('Seeding Promo Codes...');
    const promoRepo = dataSource.getRepository(PromoCodeEntity);
    await promoRepo.save([
      promoRepo.create({
        id: uuidv4(),
        code: 'WELCOME50',
        description: 'Get flat 50% discount on your first booking',
        discountType: DiscountType.PERCENTAGE,
        discountValue: 50,
        maxDiscount: 2000,
        minPurchaseAmount: 4000,
        usageLimit: 500,
        usedCount: 15,
        isActive: true,
        validFrom: new Date(),
        validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        createdBy: { id: adminUser.id }
      }),
      promoRepo.create({
        id: uuidv4(),
        code: 'WANDERLUST',
        description: 'Get flat ₹1,500 off on mountain expeditions',
        discountType: DiscountType.FIXED,
        discountValue: 1500,
        maxDiscount: 1500,
        minPurchaseAmount: 10000,
        usageLimit: 200,
        usedCount: 8,
        isActive: true,
        validFrom: new Date(),
        validUntil: new Date(new Date().setMonth(new Date().getMonth() + 6)),
        createdBy: { id: adminUser.id }
      })
    ]);

    // 6. Create Campaigns
    console.log('Seeding Marketing Campaigns...');
    const campaignRepo = dataSource.getRepository(CampaignEntity);
    await campaignRepo.save([
      campaignRepo.create({
        id: uuidv4(),
        title: 'Summer Mountain Escape 2026',
        type: 'seasonal_promo',
        budget: 50000.00,
        reach: 25400,
        conversions: 1240,
        status: 'active'
      }),
      campaignRepo.create({
        id: uuidv4(),
        title: 'Monsoon Goa Yoga Launch',
        type: 'social_media',
        budget: 15000.00,
        reach: 8900,
        conversions: 320,
        status: 'active'
      }),
      campaignRepo.create({
        id: uuidv4(),
        title: 'Varanasi Diwali Pilgrimage Drive',
        type: 'email_newsletter',
        budget: 12000.00,
        reach: 12000,
        conversions: 780,
        status: 'completed'
      })
    ]);

    // 7. Create Inquiries
    console.log('Seeding Customer Inquiries...');
    const inquiryRepo = dataSource.getRepository(InquiryEntity);
    await inquiryRepo.save([
      inquiryRepo.create({
        id: uuidv4(),
        name: 'Alice Brown',
        email: 'alice.brown@gmail.com',
        subject: 'Roopkund Trek Fitness Assessment',
        message: 'Hello, I jog 3km regularly but have never done high-altitude trekking. Is the Roopkund trek suitable for beginners like me?',
        status: 'resolved'
      }),
      inquiryRepo.create({
        id: uuidv4(),
        name: 'Bob Miller',
        email: 'bob.miller@yahoo.com',
        subject: 'Custom Dates for Kerala Houseboat',
        message: 'Hi, we are a group of 8 looking to book the Alleppey Houseboat for 6 days. Can we request custom dates starting July 15th?',
        status: 'pending'
      }),
      inquiryRepo.create({
        id: uuidv4(),
        name: 'Clara Oswald',
        email: 'clara@outlook.com',
        subject: 'Goa Wellness retreat group discount',
        message: 'Do you offer any discounts for a group booking of 5 persons for the beach retreat next month?',
        status: 'pending'
      })
    ]);

    // 8. Create Newsletter Subscribers
    console.log('Seeding Newsletter Subscribers...');
    const subRepo = dataSource.getRepository(NewsletterSubscriberEntity);
    await subRepo.save([
      subRepo.create({ id: uuidv4(), email: 'traveler.bob@gmail.com' }),
      subRepo.create({ id: uuidv4(), email: 'adventurer.sara@yahoo.com' }),
      subRepo.create({ id: uuidv4(), email: 'backpacker.sam@outlook.com' }),
      subRepo.create({ id: uuidv4(), email: 'namaste.yoga@gmail.com' })
    ]);

    // 9. Create Trips
    console.log('Seeding Trips & Child Entities...');
    const tripRepo = dataSource.getRepository(TripEntity);

    // -- Trip 1: Roopkund Trek --
    const trip1 = tripRepo.create({
      id: uuidv4(),
      slug: 'roopkund-trek-2024',
      title: 'Roopkund Mystery Skeleton Lake Trek',
      shortDescription: 'Trek through alpine meadows and conquer the mysteries of Roopkund Lake at 16,470 ft.',
      description: 'Roopkund is a high altitude glacial lake in the Uttarakhand state of India. It lies in the lap of Trishul massif and is famous for the hundreds of human skeletons found at its edge. The route climbs through lush oak forests, vast meadows (Ali and Bedni Bugyal), and steep snow climbs, culminating in a jaw-dropping panorama of peaks like Trishul, Nanda Ghunti, and Chaukhamba.',
      vendor: { id: vendorProfile1.id },
      category: [TripCategory.MOUNTAIN],
      difficulty: TripDifficulty.EXTREME,
      durationDays: 8,
      durationNights: 7,
      minGroupSize: 4,
      maxGroupSize: 12,
      highlights: [
        'Conquer a height of 16,470 ft and view the skeleton remains at Roopkund Lake',
        'Walk through Ali & Bedni Bugyal, India\'s largest and most gorgeous high-altitude meadows',
        'Witness majestic views of Mount Trishul (23,360 ft) and Mount Nanda Ghunti (20,700 ft)',
        'Stargaze under crystal clear Himalayan skies at Ghora Lotani campsite'
      ],
      inclusions: [
        'Accommodation in comfortable tents on triple/twin sharing basis',
        'All vegetarian meals during the trek (breakfast, lunch, dinner, tea/snacks)',
        'Experienced certified trek leader, professional guides, and kitchen staff',
        'Trek permits, forest entry fees, and safety equipment (oxygen cylinder, first aid)'
      ],
      exclusions: [
        'Transportation cost to and from the trek base camp (Kathgodam)',
        'Personal trekking gear (trekking poles, shoes, jackets)',
        'Porters/mules to carry personal luggage',
        'Travel insurance and medical emergencies coverage'
      ],
      requirements: [
        'Excellent physical fitness: Ability to jog 5km in under 35 minutes',
        'Acclimatization compliance and medical certificate signed by a physician',
        'Minimum age: 15 years, maximum age: 60 years'
      ],
      thingsToCarry: [
        'Trekking shoes with high ankle support and good grip',
        'Warm layers: Fleece, down jacket, thermal inner-wear',
        'Waterproof backpack (50-60 Litres) with rain cover',
        'Sunscreen, UV protection sunglasses, and headlamp'
      ],
      tags: ['Trekking', 'Himalayas', 'Glacial Lake', 'Adventure'],
      status: TripStatus.PUBLISHED,
      isActive: true,
      isFeatured: true,
    });

    trip1.location = dataSource.getRepository(TripLocationEntity).create({
      trip: trip1,
      city: 'Lohajung',
      state: 'Uttarakhand',
      country: 'India',
      address: 'Chamoli District, Lohajung Base Camp',
      lat: 30.1348,
      lng: 79.5786,
      startLocation: 'Kathgodam Railway Station',
      endLocation: 'Kathgodam Railway Station',
      pickupLocations: ['Kathgodam', 'Haldwani', 'Rishikesh']
    });

    trip1.price = dataSource.getRepository(TripPriceEntity).create({
      trip: trip1,
      amount: 14500.00,
      originalPrice: 18000.00,
      priceType: PriceType.PER_PERSON,
      currency: 'INR'
    });

    trip1.dates = [
      dataSource.getRepository(TripDateEntity).create({
        trip: trip1,
        startDate: new Date(new Date().setDate(new Date().getDate() + 15)),
        endDate: new Date(new Date().setDate(new Date().getDate() + 23)),
        price: 14500.00,
        totalSeats: 12,
        availableSeats: 10,
        bookedSeats: 2,
        status: DateStatus.AVAILABLE
      }),
      dataSource.getRepository(TripDateEntity).create({
        trip: trip1,
        startDate: new Date(new Date().setDate(new Date().getDate() + 45)),
        endDate: new Date(new Date().setDate(new Date().getDate() + 53)),
        price: 14500.00,
        totalSeats: 12,
        availableSeats: 12,
        bookedSeats: 0,
        status: DateStatus.AVAILABLE
      })
    ];

    trip1.itinerary = [
      dataSource.getRepository(TripItineraryEntity).create({
        trip: trip1,
        dayNumber: 1,
        title: 'Drive from Kathgodam to Lohajung Base Camp',
        description: 'An 8-hour drive along the beautiful mountain roads of Kumaon region. Pass through scenic Almora and Kausani, running beside the Kosi River before arriving at Lohajung (7,660 ft) for dinner and overnight stay.',
        accommodation: 'Guest House in Lohajung',
        meals: { breakfast: false, lunch: true, dinner: true },
        activities: [{ title: 'Evening briefing & gear check', location: 'Lohajung base house' }]
      }),
      dataSource.getRepository(TripItineraryEntity).create({
        trip: trip1,
        dayNumber: 2,
        title: 'Trek from Lohajung to Didina Village',
        description: 'Trek through dense forests of oak and rhododendron. Descend to the Neel Ganga river for a brief rest, then make a moderate climb up to the pristine Didina village (8,300 ft). Check into the homestay and experience local hospitality.',
        accommodation: 'Homestay in Didina',
        meals: { breakfast: true, lunch: true, dinner: true },
        activities: [{ title: 'Trek alongside Neel Ganga River', time: '5 hours' }]
      })
    ];

    trip1.media = [
      dataSource.getRepository(TripMediaEntity).create({
        trip: trip1,
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        publicId: 'tripdekho/roopkund_primary',
        caption: 'Ali Bugyal Meadows overlooking Mount Trishul',
        isPrimary: true,
        type: MediaType.IMAGE
      })
    ];


    // -- Trip 2: Goa Beach & Yoga Retreat --
    const trip2 = tripRepo.create({
      id: uuidv4(),
      slug: 'goa-yoga-wellness-retreat',
      title: 'South Goa Beach & Yoga Wellness Retreat',
      shortDescription: 'Unplug and restore your mind, body, and spirit in the quiet beach paradise of South Goa.',
      description: 'Escaping the bustling party crowds, this 4-day wellness retreat takes you to the serene beachfronts of Patnem and Agonda in South Goa. Led by experienced Kundalini and Ashtanga yoga instructors, enjoy sunrise meditation, clean organic meals, therapeutic Ayurvedic massages, and quiet sunset beach strolls.',
      vendor: { id: vendorProfile2.id },
      category: [TripCategory.WELLNESS],
      difficulty: TripDifficulty.EASY,
      durationDays: 4,
      durationNights: 3,
      minGroupSize: 2,
      maxGroupSize: 20,
      highlights: [
        'Daily morning Ashtanga and evening Yin yoga sessions on ocean-facing decks',
        'Delicious organic plant-based, farm-to-table organic meals included',
        'One relaxing 60-minute Ayurvedic full-body Abhyanga oil massage'
      ],
      inclusions: [
        '3 nights accommodation in eco-beach huts on twin or single occupancy',
        'All healthy detox juices and organic meals daily',
        'All yoga props, mats, and instructional workshops'
      ],
      exclusions: [
        'Flights or train tickets to Goa (Dabolim or Mopa Airports)'
      ],
      requirements: [
        'No prior yoga experience needed. All levels are welcome.'
      ],
      thingsToCarry: [
        'Personal yoga mat (if preferred; otherwise provided)',
        'Loose cotton clothing, swimwear, and beach slippers'
      ],
      tags: ['Yoga', 'Retreat', 'Goa', 'Wellness', 'Beach'],
      status: TripStatus.PUBLISHED,
      isActive: true,
      isFeatured: true,
    });

    trip2.location = dataSource.getRepository(TripLocationEntity).create({
      trip: trip2,
      city: 'Canacona',
      state: 'Goa',
      country: 'India',
      address: 'Patnem Beachfront Wellness Centre',
      lat: 14.9818,
      lng: 74.0326,
      startLocation: 'Goa International Airport (GOI)',
      endLocation: 'Goa International Airport (GOI)',
      pickupLocations: ['Dabolim Airport', 'Margao Railway Station']
    });

    trip2.price = dataSource.getRepository(TripPriceEntity).create({
      trip: trip2,
      amount: 18500.00,
      originalPrice: 22000.00,
      priceType: PriceType.PER_PERSON,
      currency: 'INR'
    });

    trip2.dates = [
      dataSource.getRepository(TripDateEntity).create({
        trip: trip2,
        startDate: new Date(new Date().setDate(new Date().getDate() + 10)),
        endDate: new Date(new Date().setDate(new Date().getDate() + 14)),
        price: 18500.00,
        totalSeats: 20,
        availableSeats: 15,
        bookedSeats: 5,
        status: DateStatus.AVAILABLE
      })
    ];

    trip2.itinerary = [
      dataSource.getRepository(TripItineraryEntity).create({
        trip: trip2,
        dayNumber: 1,
        title: 'Check-in, Welcome Drink, & Ocean Sunset Meditation',
        description: 'Arrive at the retreat center, check into your beach villa, and unpack. Gather at 5 PM on the ocean deck for a soothing welcome circle, sound healing session, and sunset mindfulness meditation.',
        accommodation: 'Eco-Luxury Beach Villa',
        meals: { breakfast: false, lunch: false, dinner: true },
        activities: [{ title: 'Welcome circle & sound bath', time: '5:00 PM' }]
      }),
      dataSource.getRepository(TripItineraryEntity).create({
        trip: trip2,
        dayNumber: 2,
        title: 'Sunrise Flow, Ayurvedic Session & Beach Walks',
        description: 'Start the day with a dynamic Hatha Flow yoga class. After a nutritious brunch, indulge in a personal Ayurvedic consultation and a rejuvenating Abhyanga body massage.',
        accommodation: 'Eco-Luxury Beach Villa',
        meals: { breakfast: true, lunch: true, dinner: true },
        activities: [{ title: 'Abhyanga Ayurvedic Massage', time: '1 hour' }]
      })
    ];

    trip2.media = [
      dataSource.getRepository(TripMediaEntity).create({
        trip: trip2,
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        publicId: 'tripdekho/goa_primary',
        caption: 'Serene beach huts during sunset in Patnem',
        isPrimary: true,
        type: MediaType.IMAGE
      })
    ];


    // -- Trip 3: Spiritual Varanasi Ghats --
    const trip3 = tripRepo.create({
      id: uuidv4(),
      slug: 'varanasi-spiritual-tour',
      title: 'Varanasi Spiritual & Cultural Ghats Tour',
      shortDescription: 'Witness the ancient ritual fires, Ganga Aarti, and sacred heritage of Varanasi.',
      description: 'Varanasi, the spiritual capital of India, is one of the oldest continuously inhabited cities in the world. This 3-day guided tour takes you on a deep journey through the historic narrow alleys, old temples, and sacred ghats. Experience the magical Ganga Aarti by boat, visit Sarnath where Lord Buddha gave his first sermon, and explore local weavers and food stalls.',
      vendor: { id: vendorProfile3.id },
      category: [TripCategory.SPIRITUAL],
      difficulty: TripDifficulty.EASY,
      durationDays: 3,
      durationNights: 2,
      highlights: [
        'Private boat ride during sunrise and Ganga Aarti on the Ganges River',
        'Guided heritage walks through ancient alleys (Gallis) of Kashi'
      ],
      inclusions: [
        '2 nights stay in a luxury heritage haveli near Dashashwamedh Ghat',
        'Traditional Banarasi breakfast and satvik dinners daily'
      ],
      exclusions: [
        'Personal spiritual donations/offerings at temples'
      ],
      requirements: [
        'Moderate walking through narrow crowded streets is required.'
      ],
      thingsToCarry: [
        'Very comfortable walking shoes (easy to slip off/on for temples)'
      ],
      tags: ['Spiritual', 'Heritage', 'Varanasi', 'Culture', 'Ganges'],
      status: TripStatus.PUBLISHED,
      isActive: true,
      isFeatured: false,
    });

    trip3.location = dataSource.getRepository(TripLocationEntity).create({
      trip: trip3,
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      country: 'India',
      address: 'Assi Ghat Heritage Enclave',
      lat: 25.3176,
      lng: 82.9739,
      startLocation: 'Varanasi Airport / Junction',
      endLocation: 'Varanasi Airport / Junction',
      pickupLocations: ['Lal Bahadur Shastri Airport', 'Varanasi Junction Station']
    });

    trip3.price = dataSource.getRepository(TripPriceEntity).create({
      trip: trip3,
      amount: 8900.00,
      originalPrice: 11000.00,
      priceType: PriceType.PER_PERSON,
      currency: 'INR'
    });

    trip3.dates = [
      dataSource.getRepository(TripDateEntity).create({
        trip: trip3,
        startDate: new Date(new Date().setDate(new Date().getDate() + 20)),
        endDate: new Date(new Date().setDate(new Date().getDate() + 23)),
        price: 8900.00,
        totalSeats: 15,
        availableSeats: 11,
        bookedSeats: 4,
        status: DateStatus.AVAILABLE
      })
    ];

    trip3.itinerary = [
      dataSource.getRepository(TripItineraryEntity).create({
        trip: trip3,
        dayNumber: 1,
        title: 'Arrival & Evening Aarti Boat Ride',
        description: 'Upon arrival, transfer to your heritage hotel. In the evening, walk down to the river for a private bajra boat cruise to witness the world-famous Ganga Aarti ritual from the water as oil lamps float by.',
        accommodation: 'Heritage Haveli Hotel',
        meals: { breakfast: false, lunch: false, dinner: true },
        activities: [{ title: 'Ganga Aarti Boat Cruise', time: '6:00 PM' }]
      })
    ];

    trip3.media = [
      dataSource.getRepository(TripMediaEntity).create({
        trip: trip3,
        url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=800&q=80',
        publicId: 'tripdekho/varanasi_primary',
        caption: 'Sacred lights at Dashashwamedh Ghat during Aarti',
        isPrimary: true,
        type: MediaType.IMAGE
      })
    ];

    await tripRepo.save([trip1, trip2, trip3]);

    // 10. Create Bookings & Payments
    console.log('Seeding Bookings & Payments...');
    const bookingRepo = dataSource.getRepository(BookingEntity);
    const paymentRepo = dataSource.getRepository(PaymentEntity);

    // Booking 1: John Doe bookings Roopkund Trek (Himalayan Adventures)
    const booking1 = bookingRepo.create({
      id: uuidv4(),
      bookingNumber: 'BKG-ROOP-4029',
      trip: { id: trip1.id },
      user: { id: customerUser1.id },
      vendor: { id: vendorProfile1.id },
      totalGuests: 2,
      guestDetails: { leadGuest: { name: 'John Doe', email: 'customer@tripdekho.com', phone: '9876543210' } },
      basePrice: 14500.00,
      totalPrice: 29000.00,
      vendorAmount: 26100.00, 
      paymentStatus: BookingPaymentStatus.PAID,
      status: BookingStatus.CONFIRMED,
    });
    await bookingRepo.save(booking1);

    const payment1 = paymentRepo.create({
      id: uuidv4(),
      booking: { id: booking1.id },
      customer: { id: customerUser1.id },
      vendor: { id: vendorProfile1.id },
      amount: 29000.00,
      currency: 'INR',
      paymentMethod: PaymentMethod.CARD,
      status: PaymentStatus.SUCCEEDED,
      type: PaymentType.FULL_PAYMENT,
      razorpayOrderId: 'order_rp_order_1001',
      razorpayPaymentId: 'pay_rp_pay_1001',
    });
    await paymentRepo.save(payment1);

    // Booking 2: Jane Smith bookings Goa Yoga Retreat (Goa Coastal Escapes)
    const booking2 = bookingRepo.create({
      id: uuidv4(),
      bookingNumber: 'BKG-YOGA-5082',
      trip: { id: trip2.id },
      user: { id: customerUser2.id },
      vendor: { id: vendorProfile2.id },
      totalGuests: 1,
      guestDetails: { leadGuest: { name: 'Jane Smith', email: 'customer2@tripdekho.com', phone: '9876543211' } },
      basePrice: 18500.00,
      totalPrice: 18500.00,
      vendorAmount: 16650.00,
      paymentStatus: BookingPaymentStatus.PAID,
      status: BookingStatus.CONFIRMED,
    });
    await bookingRepo.save(booking2);

    const payment2 = paymentRepo.create({
      id: uuidv4(),
      booking: { id: booking2.id },
      customer: { id: customerUser2.id },
      vendor: { id: vendorProfile2.id },
      amount: 18500.00,
      currency: 'INR',
      paymentMethod: PaymentMethod.UPI,
      status: PaymentStatus.SUCCEEDED,
      type: PaymentType.FULL_PAYMENT,
      razorpayOrderId: 'order_rp_order_1002',
      razorpayPaymentId: 'pay_rp_pay_1002',
    });
    await paymentRepo.save(payment2);

    // Booking 3: John Doe bookings Varanasi Tour (Heritage India)
    const booking3 = bookingRepo.create({
      id: uuidv4(),
      bookingNumber: 'BKG-VNS-9041',
      trip: { id: trip3.id },
      user: { id: customerUser1.id },
      vendor: { id: vendorProfile3.id },
      totalGuests: 3,
      guestDetails: { leadGuest: { name: 'John Doe', email: 'customer@tripdekho.com', phone: '9876543210' } },
      basePrice: 8900.00,
      totalPrice: 26700.00,
      vendorAmount: 24030.00,
      paymentStatus: BookingPaymentStatus.PAID,
      status: BookingStatus.CONFIRMED,
    });
    await bookingRepo.save(booking3);

    const payment3 = paymentRepo.create({
      id: uuidv4(),
      booking: { id: booking3.id },
      customer: { id: customerUser1.id },
      vendor: { id: vendorProfile3.id },
      amount: 26700.00,
      currency: 'INR',
      paymentMethod: PaymentMethod.NETBANKING,
      status: PaymentStatus.SUCCEEDED,
      type: PaymentType.FULL_PAYMENT,
      razorpayOrderId: 'order_rp_order_1003',
      razorpayPaymentId: 'pay_rp_pay_1003',
    });
    await paymentRepo.save(payment3);

    // 11. Create Payouts
    console.log('Seeding Payout Transactions...');
    const payoutRepo = dataSource.getRepository(PayoutEntity);
    const payout1 = payoutRepo.create({
      id: uuidv4(),
      vendor: vendorProfile1,
      amount: 15000.00,
      status: PayoutStatus.PAID,
      method: 'bank_transfer',
      razorpayTransferId: 'tr_rp_transfer_2001',
      note: 'Settlement for BKG-ROOP-4029 lead guest John Doe.',
      processedAt: new Date()
    });
    const payout2 = payoutRepo.create({
      id: uuidv4(),
      vendor: vendorProfile2,
      amount: 10000.00,
      status: PayoutStatus.READY,
      method: 'bank_transfer',
      note: 'Escrow release scheduled for Goa Yoga retreat.',
    });
    await payoutRepo.save([payout1, payout2]);

    // 12. Create Payout Ledgers
    console.log('Seeding Payout Ledgers...');
    const ledgerRepo = dataSource.getRepository(PayoutLedgerEntity);
    await ledgerRepo.save([
      ledgerRepo.create({
        id: uuidv4(),
        vendor: vendorProfile1,
        booking: booking1,
        type: LedgerEntryType.BOOKING_PAYMENT,
        grossAmount: 29000.00,
        commissionRate: 10.00,
        commissionAmount: 2900.00,
        netAmount: 26100.00,
        status: LedgerStatus.COMPLETED,
        escrowStatus: EscrowStatus.RELEASED,
        escrowReleaseDate: new Date(),
        description: 'Payment collection for Roopkund Mystery Lake Trek'
      }),
      ledgerRepo.create({
        id: uuidv4(),
        vendor: vendorProfile1,
        payout: payout1,
        type: LedgerEntryType.PAYOUT,
        grossAmount: -15000.00,
        netAmount: -15000.00,
        status: LedgerStatus.COMPLETED,
        escrowStatus: EscrowStatus.RELEASED,
        description: 'Bank transfer payout reference tr_rp_transfer_2001'
      }),
      ledgerRepo.create({
        id: uuidv4(),
        vendor: vendorProfile2,
        booking: booking2,
        type: LedgerEntryType.BOOKING_PAYMENT,
        grossAmount: 18500.00,
        commissionRate: 10.00,
        commissionAmount: 1850.00,
        netAmount: 16650.00,
        status: LedgerStatus.PENDING,
        escrowStatus: EscrowStatus.HELD,
        escrowReleaseDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        description: 'Escrow hold for South Goa Wellness Retreat'
      })
    ]);

    console.log('✅ Full Database seeded successfully!');
    console.log('----------------------------------------------------');
    console.log('Login Details:');
    console.log('Admin: admin@tripdekho.com / password123');
    console.log('Vendor 1 (Himalayan): vendor@tripdekho.com / password123');
    console.log('Vendor 2 (Goa Coastal): vendor2@tripdekho.com / password123');
    console.log('Vendor 3 (Heritage India): vendor3@tripdekho.com / password123');
    console.log('Customer 1: customer@tripdekho.com / password123');
    console.log('Customer 2: customer2@tripdekho.com / password123');
    console.log('----------------------------------------------------');

  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await dataSource.destroy();
  }
}

seedDatabase().catch(console.error);
