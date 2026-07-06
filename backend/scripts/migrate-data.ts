import { MongoClient, ObjectId } from 'mongodb';
import { DataSource } from 'typeorm';
import { v5 as uuidv5 } from 'uuid';
import * as dotenv from 'dotenv';
import { UserEntity, UserRole } from '../src/entities/user.entity';
import { GlobalSettingEntity } from '../src/entities/global-setting.entity';
import { PromoCodeEntity, DiscountType } from '../src/entities/promo-code.entity';
import { VendorEntity } from '../src/entities/vendor.entity';
import { TripEntity, TripCategory, TripDifficulty, TripStatus } from '../src/entities/trip.entity';
import { BookingEntity, PaymentStatus as BookingPaymentStatus, BookingStatus, RefundStatus, PaymentMethod as BookingPaymentMethod } from '../src/entities/booking.entity';
import { PaymentEntity, PaymentType, PaymentStatus, PaymentMethod } from '../src/entities/payment.entity';

dotenv.config();

const TRIPDEKHO_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'; // Arbitrary fixed namespace

function toUUID(objectId: ObjectId | string | undefined | null): string | null {
  if (!objectId) return null;
  return uuidv5(objectId.toString(), TRIPDEKHO_NAMESPACE);
}

async function migrateData() {
  console.log('Starting ETL Data Migration...');

  // 1. Connect to MongoDB
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tripdekho';
  const mongoClient = new MongoClient(mongoUri);
  await mongoClient.connect();
  const db = mongoClient.db();
  console.log('Connected to MongoDB');

  // 2. Connect to PostgreSQL
  const pgDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/tripdekho_v2',
    entities: [UserEntity, GlobalSettingEntity, PromoCodeEntity, VendorEntity, TripEntity, BookingEntity, PaymentEntity],
    synchronize: true, // Auto-create tables for now
  });
  await pgDataSource.initialize();
  console.log('Connected to PostgreSQL');

  try {
    // --- Phase 1: Foundation Data ---
    
    // 1a. Users
    console.log('Migrating Users...');
    const usersCollection = db.collection('users');
    const users = await usersCollection.find({}).toArray();
    const userRepo = pgDataSource.getRepository(UserEntity);
    
    const mappedUsers = users.map(u => {
      let role = UserRole.CUSTOMER;
      if (u.role === 'vendor') role = UserRole.VENDOR;
      else if (u.role === 'admin' || u.role === 'super_admin') role = UserRole.SUPER_ADMIN;
      
      return userRepo.create({
        id: toUUID(u._id)!,
        name: u.name || 'Unknown User',
        email: u.email,
        passwordHash: u.password || 'MIGRATED_NO_PASSWORD',
        role: role,
        phone: u.phone || null,
        isEmailVerified: u.isEmailVerified || false,
        isActive: u.isActive !== false,
        isDeleted: false,
        createdAt: u.createdAt || new Date(),
        updatedAt: u.updatedAt || new Date(),
      });
    });
    
    // Insert in batches to avoid overwhelming memory
    await userRepo.save(mappedUsers, { chunk: 100 });
    console.log(`Migrated ${mappedUsers.length} Users`);

    // 1b. Global Settings
    console.log('Migrating Global Settings...');
    const settingsCollection = db.collection('globalsettings');
    const settings = await settingsCollection.find({}).toArray();
    const settingsRepo = pgDataSource.getRepository(GlobalSettingEntity);
    
    if (settings.length > 0) {
      const s = settings[0];
      const mappedSetting = settingsRepo.create({
        id: toUUID(s._id)!,
        configName: 'default',
        brandPhone: s.brandPhone,
        brandEmail: s.brandEmail,
        brandDescription: s.brandDescription,
        brandAddress: s.brandAddress,
        whatsappNumber: s.whatsappNumber,
        operationTiming: s.operationTiming,
        socialLinks: s.socialLinks,
        heroStats: s.heroStats,
        isMaintenanceMode: s.isMaintenanceMode || false,
        maintenanceMessage: s.maintenanceMessage,
        alertActive: s.alertActive || false,
        alertMessage: s.alertMessage,
        alertType: s.alertType || 'info',
        commissionRates: s.commissionRates,
        adminModulePermissions: s.adminModulePermissions,
      });
      await settingsRepo.save(mappedSetting);
      console.log('Migrated Global Settings');
    }

    // 1c. Promo Codes
    console.log('Migrating Promo Codes...');
    const promosCollection = db.collection('promocodes');
    const promos = await promosCollection.find({}).toArray();
    const promoRepo = pgDataSource.getRepository(PromoCodeEntity);
    
    const mappedPromos = promos.map(p => {
      let dType = DiscountType.PERCENTAGE;
      if (p.discountType === 'fixed') dType = DiscountType.FIXED;

      return promoRepo.create({
        id: toUUID(p._id)!,
        code: p.code,
        description: p.description,
        discountType: dType,
        discountValue: p.discountValue,
        maxDiscount: p.maxDiscount,
        minPurchaseAmount: p.minPurchaseAmount || 0,
        usageLimit: p.usageLimit,
        usagePerUser: p.usagePerUser || 1,
        validFrom: p.validFrom,
        validUntil: p.validUntil,
        usedCount: p.usedCount || 0,
        isActive: p.isActive !== false,
        createdBy: p.createdBy ? { id: toUUID(p.createdBy)! } : undefined,
        createdAt: p.createdAt || new Date(),
        updatedAt: p.updatedAt || new Date(),
      });
    });
    
    await promoRepo.save(mappedPromos, { chunk: 100 });
    console.log(`Migrated ${mappedPromos.length} Promo Codes`);

    // --- Phase 2: Vendors ---
    console.log('Migrating Vendors...');
    const vendorsCollection = db.collection('vendors');
    const vendors = await vendorsCollection.find({}).toArray();
    const vendorRepo = pgDataSource.getRepository(VendorEntity);

    const mappedVendors = vendors.map(v => vendorRepo.create({
      id: toUUID(v._id)!,
      user: { id: toUUID(v.user)! }, // FK back to User
      businessName: v.businessName || 'Unknown Vendor',
      description: v.description,
      contactEmail: v.contactEmail || 'unknown@example.com',
      contactPhone: v.contactPhone || '0000000000',
      verificationStatus: v.verificationStatus || 'pending',
      kycStatus: v.kycStatus || 'pending',
      verifiedAt: v.verifiedAt,
      isDeleted: v.isDeleted || false,
      createdAt: v.createdAt || new Date(),
      updatedAt: v.updatedAt || new Date(),
    }));
    await vendorRepo.save(mappedVendors, { chunk: 100 });
    console.log(`Migrated ${mappedVendors.length} Vendors`);

    // --- Phase 3: Trips ---
    console.log('Migrating Trips...');
    const tripsCollection = db.collection('trips');
    const trips = await tripsCollection.find({}).toArray();
    const tripRepo = pgDataSource.getRepository(TripEntity);

    const mappedTrips = trips.map(t => tripRepo.create({
      id: toUUID(t._id)!,
      slug: t.slug || toUUID(t._id),
      title: t.title || 'Untitled Trip',
      shortDescription: t.shortDescription,
      description: t.description,
      vendor: { id: toUUID(t.vendor)! },
      category: Object.values(TripCategory).includes(t.category) ? t.category as TripCategory : TripCategory.OTHER,
      difficulty: Object.values(TripDifficulty).includes(t.difficulty) ? t.difficulty as TripDifficulty : TripDifficulty.MODERATE,
      durationDays: t.durationDays || 1,
      durationNights: t.durationNights || 0,
      minGroupSize: t.minGroupSize || 1,
      maxGroupSize: t.maxGroupSize || 20,
      highlights: t.highlights || [],
      status: Object.values(TripStatus).includes(t.status) ? t.status as TripStatus : TripStatus.DRAFT,
      isActive: t.isActive !== false,
      isFeatured: t.isFeatured || false,
      isDeleted: t.isDeleted || false,
      createdAt: t.createdAt || new Date(),
      updatedAt: t.updatedAt || new Date(),
    }));
    await tripRepo.save(mappedTrips, { chunk: 50 });
    console.log(`Migrated ${mappedTrips.length} Trips`);

    // --- Phase 4: Bookings & Payments ---
    console.log('Migrating Bookings...');
    const bookingsCollection = db.collection('bookings');
    const bookings = await bookingsCollection.find({}).toArray();
    const bookingRepo = pgDataSource.getRepository(BookingEntity);

    const mappedBookings = bookings.map(b => bookingRepo.create({
      id: toUUID(b._id)!,
      bookingNumber: b.bookingNumber || `BKG-${toUUID(b._id)!.substring(0,8).toUpperCase()}`,
      trip: { id: toUUID(b.trip)! },
      user: { id: toUUID(b.user)! },
      vendor: { id: toUUID(b.vendor)! },
      totalGuests: b.totalGuests || 1,
      guestDetails: b.guestDetails || { leadGuest: { firstName: 'Unknown', lastName: 'Unknown', email: 'unknown@example.com', phone: '0000' } },
      basePrice: b.basePrice || 0,
      totalPrice: b.totalPrice || 0,
      vendorAmount: b.vendorAmount || 0,
      paymentStatus: Object.values(BookingPaymentStatus).includes(b.paymentStatus) ? b.paymentStatus as BookingPaymentStatus : BookingPaymentStatus.PENDING,
      status: Object.values(BookingStatus).includes(b.status) ? b.status as BookingStatus : BookingStatus.PENDING,
      createdAt: b.createdAt || new Date(),
      updatedAt: b.updatedAt || new Date(),
    }));
    await bookingRepo.save(mappedBookings, { chunk: 50 });
    console.log(`Migrated ${mappedBookings.length} Bookings`);

    console.log('Migration Complete!');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await mongoClient.close();
    await pgDataSource.destroy();
  }
}

migrateData().catch(console.error);
