import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserEntity, UserRole } from './entities/user.entity';
import { VendorEntity } from './entities/vendor.entity';
import {
  TripEntity,
  TripCategory,
  TripDifficulty,
  TripStatus,
} from './entities/trip.entity';
import { TripLocationEntity } from './entities/trip-location.entity';
import { TripPriceEntity, PriceType } from './entities/trip-price.entity';
import { TripDateEntity, DateStatus } from './entities/trip-date.entity';
import { TripItineraryEntity } from './entities/trip-itinerary.entity';
import { TripMediaEntity, MediaType } from './entities/trip-media.entity';
import { GlobalSettingEntity } from './entities/global-setting.entity';
import { RoleEntity } from './entities/role.entity';
import { PermissionEntity } from './entities/permission.entity';
import { RolePermissionEntity } from './entities/role-permission.entity';
import {
  BookingEntity,
  BookingStatus,
  PaymentStatus,
  PaymentMethod,
  RefundStatus,
} from './entities/booking.entity';
import { ReviewEntity } from './reviews/entities/review.entity';
import { PromoCodeEntity } from './entities/promo-code.entity';
import { PayoutEntity } from './entities/payout.entity';
import { PayoutLedgerEntity } from './entities/payout-ledger.entity';
import { VendorBankAccountEntity } from './entities/vendor-bank-account.entity';
import { ReferralCodeEntity } from './entities/referral-code.entity';
import { ReferralEntity } from './entities/referral.entity';
import { LoyaltyPointEntity } from './entities/loyalty-point.entity';
import { PointTransactionEntity } from './entities/point-transaction.entity';
import {
  RewardRuleEntity,
  RewardTrigger,
  RecipientType,
  TargetUserType,
} from './entities/reward-rule.entity';
import { RewardRedemptionEntity } from './entities/reward-redemption.entity';

const DATABASE_URL =
  'postgresql://postgres.waeblcermeghvtcramfa:Tripdekho%40123@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres';

const AppDataSource = new DataSource({
  type: 'postgres',
  url: DATABASE_URL,
  entities: [
    UserEntity,
    VendorEntity,
    TripEntity,
    TripLocationEntity,
    TripPriceEntity,
    TripDateEntity,
    TripItineraryEntity,
    TripMediaEntity,
    GlobalSettingEntity,
    RoleEntity,
    PermissionEntity,
    RolePermissionEntity,
    BookingEntity,
    ReviewEntity,
    PromoCodeEntity,
    PayoutEntity,
    PayoutLedgerEntity,
    VendorBankAccountEntity,
    ReferralCodeEntity,
    ReferralEntity,
    LoyaltyPointEntity,
    PointTransactionEntity,
    RewardRuleEntity,
    RewardRedemptionEntity,
  ],
  synchronize: true,
  ...(process.env.DB_SSL === 'true'
    ? { ssl: { rejectUnauthorized: false } }
    : {}),
});

// ─── Helpers ────────────────────────────────────────────────────
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function futureDate(daysAhead: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d;
}

// ─── Trip Data Arrays ───────────────────────────────────────────
const categories = Object.values(TripCategory);
const difficulties = Object.values(TripDifficulty);

const indianCities = [
  { city: 'Manali', state: 'Himachal Pradesh', lat: 32.24, lng: 77.19 },
  { city: 'Leh', state: 'Ladakh', lat: 34.17, lng: 77.58 },
  { city: 'Rishikesh', state: 'Uttarakhand', lat: 30.09, lng: 78.27 },
  { city: 'Jaipur', state: 'Rajasthan', lat: 26.92, lng: 75.79 },
  { city: 'Goa', state: 'Goa', lat: 15.3, lng: 74.0 },
  { city: 'Varanasi', state: 'Uttar Pradesh', lat: 25.32, lng: 83.01 },
  { city: 'Udaipur', state: 'Rajasthan', lat: 24.59, lng: 73.68 },
  { city: 'Darjeeling', state: 'West Bengal', lat: 27.04, lng: 88.26 },
  { city: 'Munnar', state: 'Kerala', lat: 10.09, lng: 77.06 },
  { city: 'Shimla', state: 'Himachal Pradesh', lat: 31.1, lng: 77.17 },
  { city: 'Jodhpur', state: 'Rajasthan', lat: 26.29, lng: 73.02 },
  { city: 'Kodaikanal', state: 'Tamil Nadu', lat: 10.23, lng: 77.49 },
  { city: 'Agra', state: 'Uttar Pradesh', lat: 27.18, lng: 78.02 },
  { city: 'Kasol', state: 'Himachal Pradesh', lat: 32.01, lng: 77.31 },
  { city: 'Spiti Valley', state: 'Himachal Pradesh', lat: 32.6, lng: 78.03 },
  { city: 'Andaman', state: 'Andaman & Nicobar', lat: 11.74, lng: 92.66 },
  { city: 'Alleppey', state: 'Kerala', lat: 9.49, lng: 76.34 },
  { city: 'Coorg', state: 'Karnataka', lat: 12.42, lng: 75.74 },
  { city: 'Jaisalmer', state: 'Rajasthan', lat: 26.92, lng: 70.9 },
  { city: 'Ooty', state: 'Tamil Nadu', lat: 11.41, lng: 76.69 },
  { city: 'McLeodganj', state: 'Himachal Pradesh', lat: 32.24, lng: 76.32 },
  { city: 'Hampi', state: 'Karnataka', lat: 15.33, lng: 76.46 },
  { city: 'Pushkar', state: 'Rajasthan', lat: 26.49, lng: 74.55 },
  { city: 'Amritsar', state: 'Punjab', lat: 31.63, lng: 74.87 },
  { city: 'Varkala', state: 'Kerala', lat: 8.73, lng: 76.72 },
];

const tripTemplates: Array<{ title: string; cat: TripCategory; desc: string }> =
  [
    {
      title: 'Manali Snow Adventure',
      cat: TripCategory.ADVENTURE,
      desc: 'Experience the thrill of snow-capped peaks and adventure sports in Manali.',
    },
    {
      title: 'Leh Ladakh Bike Expedition',
      cat: TripCategory.ADVENTURE,
      desc: 'Ride through the highest motorable roads in the world on this epic journey.',
    },
    {
      title: 'Rishikesh River Rafting Camp',
      cat: TripCategory.ADVENTURE,
      desc: 'White water rafting on the Ganges with camping under the stars.',
    },
    {
      title: 'Spiti Valley Road Trip',
      cat: TripCategory.ADVENTURE,
      desc: 'Traverse the barren moon-like landscapes of Spiti Valley.',
    },
    {
      title: 'Kasol Backpacker Trail',
      cat: TripCategory.ADVENTURE,
      desc: 'Explore the hippie trail of Kasol through forests and riverside camps.',
    },
    {
      title: 'Chadar Frozen River Trek',
      cat: TripCategory.ADVENTURE,
      desc: 'Walk on the frozen Zanskar River in this once-in-a-lifetime winter trek.',
    },
    {
      title: 'Meghalaya Living Root Bridges',
      cat: TripCategory.ADVENTURE,
      desc: "Discover the magical living root bridges deep in Meghalaya's forests.",
    },
    {
      title: 'Jaipur Heritage Walk',
      cat: TripCategory.HERITAGE,
      desc: "Walk through the Pink City's ancient bazaars and majestic forts.",
    },
    {
      title: 'Agra Mughal Heritage Tour',
      cat: TripCategory.HERITAGE,
      desc: 'Experience the grandeur of the Mughal empire at the Taj Mahal and beyond.',
    },
    {
      title: 'Hampi Ruins Explorer',
      cat: TripCategory.HERITAGE,
      desc: 'Explore the UNESCO World Heritage ruins of the Vijayanagara Empire.',
    },
    {
      title: 'Jodhpur Blue City Heritage',
      cat: TripCategory.HERITAGE,
      desc: 'Discover the blue-washed houses and magnificent Mehrangarh Fort.',
    },
    {
      title: 'Lucknow Nawabi Trail',
      cat: TripCategory.HERITAGE,
      desc: 'Relive the Nawabi era through food, architecture, and culture in Lucknow.',
    },
    {
      title: 'Rajasthan Royal Forts Circuit',
      cat: TripCategory.HERITAGE,
      desc: "Tour the majestic forts and palaces of Rajasthan's royal heritage.",
    },
    {
      title: 'Goa Beach Bliss',
      cat: TripCategory.BEACH,
      desc: 'Relax on pristine beaches, enjoy water sports, and savor seafood in Goa.',
    },
    {
      title: 'Andaman Island Paradise',
      cat: TripCategory.BEACH,
      desc: 'Crystal clear waters, coral reefs, and untouched beaches await you.',
    },
    {
      title: 'Varkala Cliff Beach Retreat',
      cat: TripCategory.BEACH,
      desc: 'Spectacular cliff-side beaches with Ayurvedic spa experiences.',
    },
    {
      title: 'Gokarna Beach Hopping',
      cat: TripCategory.BEACH,
      desc: 'Trek between hidden beaches in this peaceful coastal town.',
    },
    {
      title: 'Pondicherry French Quarter & Beach',
      cat: TripCategory.BEACH,
      desc: 'French colonial charm meets pristine Bay of Bengal beaches.',
    },
    {
      title: 'Lakshadweep Islands Expedition',
      cat: TripCategory.BEACH,
      desc: "India's hidden coral paradise with turquoise lagoons.",
    },
    {
      title: 'Varanasi Spiritual Journey',
      cat: TripCategory.SPIRITUAL,
      desc: 'Experience the ancient spiritual heart of India along the sacred Ganges.',
    },
    {
      title: 'Rishikesh Yoga Retreat',
      cat: TripCategory.SPIRITUAL,
      desc: 'Find inner peace with yoga and meditation in the Yoga Capital of the World.',
    },
    {
      title: 'Amritsar Golden Temple Pilgrimage',
      cat: TripCategory.SPIRITUAL,
      desc: 'Visit the magnificent Golden Temple and experience Sikh hospitality.',
    },
    {
      title: 'Bodh Gaya Buddhist Circuit',
      cat: TripCategory.SPIRITUAL,
      desc: 'Walk in the footsteps of Buddha at the site of his enlightenment.',
    },
    {
      title: 'Pushkar Sacred Lake Retreat',
      cat: TripCategory.SPIRITUAL,
      desc: "Immerse in the spiritual aura of Pushkar's holy lake and Brahma temple.",
    },
    {
      title: 'Kedarnath Divine Trek',
      cat: TripCategory.SPIRITUAL,
      desc: 'Trek to one of the holiest Shiva temples nestled in the Himalayas.',
    },
    {
      title: 'Triund Peak Trek',
      cat: TripCategory.HIKE,
      desc: 'A stunning day hike offering panoramic views of the Dhauladhar range.',
    },
    {
      title: 'Kheerganga Hot Springs Trek',
      cat: TripCategory.HIKE,
      desc: 'Trek through lush Parvati Valley to natural hot springs at 3000m.',
    },
    {
      title: 'Hampta Pass Crossing',
      cat: TripCategory.HIKE,
      desc: 'Cross from lush Kullu Valley to barren Lahaul through a dramatic pass.',
    },
    {
      title: 'Valley of Flowers Trek',
      cat: TripCategory.HIKE,
      desc: 'Walk through a UNESCO World Heritage alpine meadow bursting with flowers.',
    },
    {
      title: 'Roopkund Skeleton Lake Trek',
      cat: TripCategory.HIKE,
      desc: 'Trek to the mysterious lake of skeletons at 5029m altitude.',
    },
    {
      title: 'Brahmatal Winter Trek',
      cat: TripCategory.HIKE,
      desc: 'A magical winter trek with frozen lakes and panoramic Himalayan views.',
    },
    {
      title: 'Kedarkantha Summit Trek',
      cat: TripCategory.HIKE,
      desc: 'Summit at 3800m with 360-degree views of snow-covered Himalayan peaks.',
    },
    {
      title: 'Manali Mountain Escape',
      cat: TripCategory.MOUNTAIN,
      desc: 'Escape to the mountains with stunning views of Rohtang and Solang.',
    },
    {
      title: 'Darjeeling Tea Garden Trail',
      cat: TripCategory.MOUNTAIN,
      desc: 'Ride the toy train and explore lush tea gardens with Kanchenjunga views.',
    },
    {
      title: 'Shimla Colonial Hill Station',
      cat: TripCategory.MOUNTAIN,
      desc: 'Explore the Queen of Hills with its colonial architecture and pine forests.',
    },
    {
      title: 'Mussoorie Queen of Hills',
      cat: TripCategory.MOUNTAIN,
      desc: 'Explore waterfalls, nature trails, and panoramic Himalayan vistas.',
    },
    {
      title: 'Auli Ski Adventure',
      cat: TripCategory.MOUNTAIN,
      desc: "Hit the slopes of India's premier ski destination with Nanda Devi views.",
    },
    {
      title: 'Chopta Tungnath Trek',
      cat: TripCategory.MOUNTAIN,
      desc: 'Trek to the highest Shiva temple with views of Chaukhamba peaks.',
    },
    {
      title: 'Munnar Tea Plantation Stay',
      cat: TripCategory.NATURE,
      desc: 'Stay amidst rolling tea plantations with misty mountain mornings.',
    },
    {
      title: 'Coorg Coffee Estate Retreat',
      cat: TripCategory.NATURE,
      desc: 'Explore spice and coffee plantations in the Scotland of India.',
    },
    {
      title: 'Kodaikanal Lake & Forest',
      cat: TripCategory.NATURE,
      desc: 'Boat on the star-shaped lake surrounded by ancient shola forests.',
    },
    {
      title: 'Wayanad Rainforest Expedition',
      cat: TripCategory.NATURE,
      desc: 'Trek through evergreen rainforests and discover ancient caves.',
    },
    {
      title: 'Kaziranga Wildlife Safari',
      cat: TripCategory.WILDLIFE,
      desc: 'Spot the one-horned rhinoceros in this UNESCO World Heritage site.',
    },
    {
      title: 'Jim Corbett Tiger Reserve',
      cat: TripCategory.WILDLIFE,
      desc: "India's oldest national park offering the best tiger sighting chances.",
    },
    {
      title: 'Ranthambore Tiger Safari',
      cat: TripCategory.WILDLIFE,
      desc: 'See Bengal tigers in the wild amidst ancient fort ruins.',
    },
    {
      title: 'Bandhavgarh Tiger Territory',
      cat: TripCategory.WILDLIFE,
      desc: 'Highest density of Bengal tigers in any national park in India.',
    },
    {
      title: 'Udaipur City of Lakes',
      cat: TripCategory.CULTURAL,
      desc: 'Explore the romantic city with floating palaces and lakeside dining.',
    },
    {
      title: 'Jaisalmer Desert Festival',
      cat: TripCategory.CULTURAL,
      desc: 'Experience camel safaris, folk music, and desert camping under the stars.',
    },
    {
      title: 'Kerala Backwater Houseboat',
      cat: TripCategory.CULTURAL,
      desc: 'Cruise through the serene backwaters of Alleppey on a traditional houseboat.',
    },
    {
      title: 'Khajuraho Temple Art Tour',
      cat: TripCategory.CULTURAL,
      desc: 'Marvel at the erotic temple sculptures, a UNESCO masterpiece.',
    },
    {
      title: 'Ooty Nilgiri Mountain Railway',
      cat: TripCategory.NATURE,
      desc: 'Ride the heritage mountain railway through tunnels and tea gardens.',
    },
    {
      title: 'Zanskar Valley Expedition',
      cat: TripCategory.OFFBEAT,
      desc: 'Explore one of the most remote and pristine valleys in the Himalayas.',
    },
    {
      title: 'Tirthan Valley Hidden Gem',
      cat: TripCategory.OFFBEAT,
      desc: 'Discover the lesser-known paradise in the Great Himalayan National Park.',
    },
    {
      title: 'Majuli River Island',
      cat: TripCategory.OFFBEAT,
      desc: "Visit the world's largest river island in the Brahmaputra.",
    },
    {
      title: 'Dhanaulti Pine Forest Retreat',
      cat: TripCategory.OFFBEAT,
      desc: 'A quiet mountain escape amidst dense deodar and rhododendron forests.',
    },
    {
      title: 'Sandakphu Kanchenjunga View',
      cat: TripCategory.OFFBEAT,
      desc: "Trek to West Bengal's highest point with views of four 8000m peaks.",
    },
    {
      title: 'Mechuka Hidden Valley',
      cat: TripCategory.OFFBEAT,
      desc: "Discover Arunachal Pradesh's secret valley near the China border.",
    },
    {
      title: 'Rishikesh Wellness Retreat',
      cat: TripCategory.WELLNESS,
      desc: 'Rejuvenate with yoga, meditation, and Ayurvedic treatments.',
    },
    {
      title: 'Kerala Ayurveda Experience',
      cat: TripCategory.WELLNESS,
      desc: "Traditional Panchakarma treatments in Kerala's Ayurvedic heartland.",
    },
  ];

const unsplashImages = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
  'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
  'https://images.unsplash.com/photo-1502003148287-a82ef80a6abc?w=800',
  'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800',
  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
  'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800',
  'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
  'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
];

const vendorNames = [
  'Himalayan Treks Co.',
  'Desert Nomads Travel',
  'Coastal Adventures India',
  'Sacred Journeys Pvt Ltd',
  'Mountain High Expeditions',
  'Backpack India Tours',
  'Royal Rajasthan Travels',
  'Kerala Green Tours',
  'Northeast Explorer',
  'South India Trails',
  'Ganga Spiritual Tours',
  'Wild India Safari',
  'Snow Peak Expeditions',
  'Wanderlust Adventures',
  'Blue Ocean Travels',
  'Golden Triangle Tours',
  'Zen Wellness Retreats',
  'Heritage Walk India',
  'Trek India Adventures',
  'Spice Route Travels',
  'Valley View Expeditions',
  'Pilgrim Path Tours',
  'Offbeat India Co.',
  'Nature Nest Tours',
  'India Untamed Safaris',
  'Peak Performance Treks',
  'Sunset Beach Tours',
  'Ancient Steps Heritage',
  'Pure Yoga Retreats',
  'Monsoon Magic Tours',
  'Forest Trail Adventures',
  'Temple Run Pilgrimages',
  'Dune Rider Safaris',
  'Cloud Nine Treks',
  'River Rush Rafting',
  'Palm Shade Retreats',
  'Eagle Eye Expeditions',
  'Caravan Culture Tours',
  'Island Hop Adventures',
  'Footprint Eco Tours',
  'Tranquil Trails India',
  'Summit Seekers Co.',
  'Coral Coast Travels',
  'Peace Path Journeys',
  'Nomad Nation Tours',
  'Chai & Trail Co.',
  'Hidden India Travels',
  'Bamboo Bridge Tours',
  'Lotus Petal Retreats',
  'Wind Song Expeditions',
];

const customerNames = [
  'Rahul Sharma',
  'Priya Patel',
  'Arjun Singh',
  'Ananya Gupta',
  'Vikram Reddy',
  'Sneha Nair',
  'Amit Joshi',
  'Kavita Deshmukh',
  'Rohan Mehta',
  'Ishika Verma',
  'Dev Kapoor',
  'Meera Iyer',
  'Karan Malhotra',
  'Nisha Agarwal',
  'Siddharth Das',
  'Pooja Kulkarni',
  'Aarav Choudhary',
  'Divya Menon',
  'Nikhil Banerjee',
  'Riya Saxena',
];

const highlights = [
  'Breathtaking mountain views',
  'Local cultural immersion',
  'Professional guides',
  'All meals included',
  'Comfortable camping',
  'Photography opportunities',
  'Group bonfire nights',
  'Wildlife spotting',
  'Waterfall visits',
  'Sunrise/sunset points',
  'River crossing',
  'Cave exploration',
  'Village homestay',
  'Traditional cooking class',
  'Star gazing sessions',
];

const inclusions = [
  'Accommodation',
  'Meals (Breakfast, Lunch, Dinner)',
  'Transport from pickup point',
  'Professional trek leader',
  'First aid kit',
  'Permits and entry fees',
  'Camping equipment',
  'Welcome drink',
  'Drinking water',
];

const exclusions = [
  'Personal expenses',
  'Travel insurance',
  'Tips and gratuities',
  'Personal medication',
  'Camera fees at monuments',
  'Alcoholic beverages',
  'Any item not mentioned in inclusions',
];

// ─── Main seed function ─────────────────────────────────────────
async function seed() {
  console.log('🌱 Connecting to database...');
  await AppDataSource.initialize();
  console.log('✅ Connected to database');

  // ─── Clear existing data (in correct order for FK constraints) ───
  console.log('🗑️  Clearing existing data...');
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  const tablesToClear = [
    'reviews',
    'bookings',
    'trip_media',
    'trip_itineraries',
    'trip_dates',
    'trip_prices',
    'trip_locations',
    'trips',
    'vendor_bank_accounts',
    'payout_ledger',
    'payouts',
    'promo_codes',
    'vendors',
    'role_permissions',
    'permissions',
    'users',
    'roles',
    'global_settings',
    'reward_redemptions',
    'reward_rules',
    'point_transactions',
    'loyalty_points',
    'referrals',
    'referral_codes',
  ];
  for (const table of tablesToClear) {
    try {
      await queryRunner.query(`TRUNCATE TABLE ${table} CASCADE`);
    } catch (e: any) {
      console.log(`⚠️  Could not truncate ${table}: ${e.message}`);
    }
  }
  await queryRunner.release();
  console.log('✅ Cleared existing data');

  // ─── 1. Seed Roles & Permissions ──────────────────────────────
  console.log('📝 Seeding roles...');
  const roleRepo = AppDataSource.getRepository(RoleEntity);
  const roles = await roleRepo.save([
    { name: 'SUPER_ADMIN', description: 'Full system access', isActive: true },
    { name: 'ADMIN', description: 'Administrative access', isActive: true },
    {
      name: 'VENDOR',
      description: 'Vendor/tour operator access',
      isActive: true,
    },
    {
      name: 'CUSTOMER',
      description: 'Regular customer access',
      isActive: true,
    },
  ]);
  console.log(`✅ Created ${roles.length} roles`);

  // ─── 2. Seed Global Settings ──────────────────────────────────
  console.log('⚙️  Seeding global settings...');
  const settingsRepo = AppDataSource.getRepository(GlobalSettingEntity);
  await settingsRepo.save({
    configName: 'default',
    brandPhone: '+91 1800-TRIP-DEKHO',
    brandEmail: 'support@tripdekho.com',
    brandDescription:
      "India's premium trip booking platform. Discover curated travel experiences across India.",
    brandAddress: '42, MG Road, Sector 14, Gurugram, Haryana 122001',
    whatsappNumber: '919876543210',
    operationTiming: '10:00 AM - 12:00 AM',
    socialLinks: {
      instagram: 'https://instagram.com/tripdekho',
      facebook: 'https://facebook.com/tripdekho',
      twitter: 'https://twitter.com/tripdekho',
      youtube: 'https://youtube.com/tripdekho',
      linkedin: 'https://linkedin.com/company/tripdekho',
    },
    heroStats: {
      totalTrips: 150,
      happyTravelers: 25000,
      destinations: 50,
      vendorPartners: 50,
    },
    isMaintenanceMode: false,
    alertActive: false,
    commissionRates: { default: 15, premium: 12, adventure: 18, wellness: 10 },
  });
  console.log('✅ Seeded global settings');

  // ─── 2.5. Seed Reward Rules ──────────────────────────────────
  console.log('🎁 Seeding reward rules...');
  const rewardRulesRepo = AppDataSource.getRepository(RewardRuleEntity);
  await rewardRulesRepo.save([
    {
      name: 'Referral Signup Bonus',
      trigger: RewardTrigger.REFERRAL_SIGNUP,
      userType: TargetUserType.ALL,
      recipientType: RecipientType.REFERRED,
      points: 50,
      isActive: true,
    },
    {
      name: 'Referrer Signup Reward',
      trigger: RewardTrigger.REFERRAL_SIGNUP,
      userType: TargetUserType.ALL,
      recipientType: RecipientType.REFERRER,
      points: 100,
      isActive: true,
    },
  ]);
  console.log('✅ Created initial reward rules');

  // ─── 3. Seed Admin + Customers (20) ───────────────────────────
  console.log('👤 Seeding users...');
  const userRepo = AppDataSource.getRepository(UserEntity);
  const passwordHash = await bcrypt.hash('password123', 10);

  // Admin user
  const adminUser = await userRepo.save({
    name: 'Super Admin',
    email: 'admin@tripdekho.com',
    passwordHash,
    role: UserRole.SUPER_ADMIN,
    phone: '+919999999999',
    isEmailVerified: true,
    isActive: true,
    roleEntity: roles[0],
  });

  // 20 customer users
  const customerUsers: UserEntity[] = [];
  for (let i = 0; i < 20; i++) {
    const user = await userRepo.save({
      name: customerNames[i],
      email: `${customerNames[i].toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      passwordHash,
      role: UserRole.CUSTOMER,
      phone: `+91${9000000000 + i}`,
      isEmailVerified: true,
      isActive: true,
      roleEntity: roles[3],
    });
    customerUsers.push(user);
  }
  console.log(`✅ Created 1 admin + ${customerUsers.length} customers`);

  // ─── 4. Seed 50 Vendors ───────────────────────────────────────
  console.log('🏢 Seeding vendors...');
  const vendorRepo = AppDataSource.getRepository(VendorEntity);
  const vendors: VendorEntity[] = [];

  for (let i = 0; i < 50; i++) {
    const vendorUser = await userRepo.save({
      name: `${vendorNames[i]} Owner`,
      email: `vendor${i + 1}@tripdekho.com`,
      passwordHash,
      role: UserRole.VENDOR,
      phone: `+91${8000000000 + i}`,
      isEmailVerified: true,
      isActive: true,
      roleEntity: roles[2],
    });

    const vendor = await vendorRepo.save({
      user: vendorUser,
      businessName: vendorNames[i],
      description: `${vendorNames[i]} is a leading travel company specializing in curated travel experiences across India. With years of experience and passionate local guides, we ensure every trip is memorable.`,
      contactEmail: `info@${vendorNames[i].toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      contactPhone: `+91${7000000000 + i}`,
      verificationStatus: rand(['verified', 'verified', 'verified', 'pending']),
      kycStatus: rand(['verified', 'verified', 'verified', 'pending']),
    });
    vendors.push(vendor);
  }
  console.log(`✅ Created ${vendors.length} vendors`);

  // ─── 5. Seed 150 Trips with all relations ─────────────────────
  console.log('🗺️  Seeding 150 trips...');
  const tripRepo = AppDataSource.getRepository(TripEntity);
  const locationRepo = AppDataSource.getRepository(TripLocationEntity);
  const priceRepo = AppDataSource.getRepository(TripPriceEntity);
  const dateRepo = AppDataSource.getRepository(TripDateEntity);
  const itineraryRepo = AppDataSource.getRepository(TripItineraryEntity);
  const mediaRepo = AppDataSource.getRepository(TripMediaEntity);

  const allTrips: TripEntity[] = [];

  const shuffledTemplates = [...tripTemplates].sort(() => Math.random() - 0.5);
  for (let i = 0; i < 150; i++) {
    const template = shuffledTemplates[i % shuffledTemplates.length];
    const city = indianCities[i % indianCities.length];
    const vendor = vendors[i % vendors.length];
    const days = randInt(2, 8);
    const nights = days - 1;
    const basePrice = randInt(3000, 25000);
    const uniqueSlug =
      i < tripTemplates.length
        ? slugify(template.title)
        : `${slugify(template.title)}-${i}`;

    // Create trip
    const trip = await tripRepo.save({
      slug: uniqueSlug,
      title:
        i < tripTemplates.length
          ? template.title
          : `${template.title} (Edition ${Math.ceil(i / tripTemplates.length) + 1})`,
      shortDescription: template.desc,
      description: `${template.desc}\n\nThis is a ${days}-day, ${nights}-night experience starting from ${city.city}, ${city.state}. Our expert local guides will take you through the best-kept secrets of the region. Perfect for travelers seeking authentic experiences.\n\nJoin us for an unforgettable journey filled with adventure, culture, and breathtaking landscapes. All logistics are handled by our experienced team.`,
      vendor,
      category: [template.cat],
      difficulty: rand(difficulties),
      durationDays: days,
      durationNights: nights,
      minGroupSize: randInt(2, 4),
      maxGroupSize: randInt(12, 30),
      highlights: highlights
        .sort(() => Math.random() - 0.5)
        .slice(0, randInt(4, 7)),
      inclusions: inclusions
        .sort(() => Math.random() - 0.5)
        .slice(0, randInt(5, 8)),
      exclusions: exclusions
        .sort(() => Math.random() - 0.5)
        .slice(0, randInt(3, 5)),
      requirements: [
        'Valid photo ID',
        'Good physical fitness',
        'Comfortable walking shoes',
      ],
      thingsToCarry: [
        'Sunscreen',
        'Water bottle',
        'First aid kit',
        'Rain jacket',
        'Warm clothes',
      ],
      tags: [
        template.cat,
        city.city.toLowerCase(),
        city.state.toLowerCase(),
        'india',
        rand(['trending', 'popular', 'new', 'bestseller']),
        rand(['budget-stay', 'premium', 'luxury']),
        rand(['weekend-escape', 'long-trip', 'day-trip']),
      ],
      status: TripStatus.PUBLISHED,
      isActive: true,
      isFeatured: i < 20,
      publishedAt: new Date(),
    });

    // Promise.all for relations to speed up seeding
    const datesToSave = [];
    const numDates = randInt(2, 4);
    for (let d = 0; d < numDates; d++) {
      const startDate = futureDate(randInt(7 + d * 15, 20 + d * 20));
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + days);
      const totalSeats = randInt(15, 30);
      const bookedSeats = randInt(0, Math.floor(totalSeats * 0.7));
      datesToSave.push({
        trip,
        startDate,
        endDate,
        price: basePrice + randInt(-500, 500),
        totalSeats,
        availableSeats: totalSeats - bookedSeats,
        bookedSeats,
        status: DateStatus.AVAILABLE,
      });
    }

    const itinerariesToSave = [];
    for (let day = 1; day <= days; day++) {
      itinerariesToSave.push({
        trip,
        dayNumber: day,
        title:
          day === 1
            ? `Arrival & Welcome at ${city.city}`
            : day === days
              ? 'Departure Day'
              : `Day ${day} – Exploration & Activities`,
        description:
          day === 1
            ? `Arrive at ${city.city}. Check-in and welcome briefing. Evening orientation walk.`
            : day === days
              ? `Post breakfast checkout and departure. Transfer to ${city.city} bus stand/railway station.`
              : `Full day of activities including sightseeing, local cuisine tasting, and cultural experiences around ${city.city}.`,
        accommodation:
          day < days
            ? rand(['Hotel', 'Camp', 'Homestay', 'Resort', 'Guest House'])
            : null,
        meals: { breakfast: true, lunch: day !== days, dinner: day !== days },
        activities: [
          {
            title: day === 1 ? 'Check-in' : 'Morning Activity',
            time: '09:00 AM',
            description: 'Start your day with an energizing activity',
          },
          {
            title: 'Lunch Break',
            time: '01:00 PM',
            description: 'Enjoy local cuisine',
          },
          ...(day !== days
            ? [
                {
                  title: 'Evening Activity',
                  time: '04:00 PM',
                  description: 'Explore the surroundings',
                },
              ]
            : []),
        ],
      });
    }

    const mediaToSave = [];
    const numImages = randInt(2, 3);
    for (let m = 0; m < numImages; m++) {
      mediaToSave.push({
        trip,
        url: unsplashImages[(i * 3 + m) % unsplashImages.length],
        publicId: `trip_${i}_img_${m}`,
        caption: m === 0 ? template.title : `${city.city} scenic view`,
        isPrimary: m === 0,
        type: MediaType.IMAGE,
      });
    }

    await Promise.all([
      locationRepo.save({
        trip,
        city: city.city,
        state: city.state,
        country: 'India',
        address: `${city.city}, ${city.state}, India`,
        lat: city.lat + (Math.random() - 0.5) * 0.1,
        lng: city.lng + (Math.random() - 0.5) * 0.1,
        startLocation: `${city.city} Bus Stand`,
        endLocation: `${city.city} Bus Stand`,
        pickupLocations: [
          `${city.city} Railway Station`,
          `${city.city} Bus Stand`,
          `${city.city} Airport`,
        ],
      }),
      priceRepo.save({
        trip,
        amount: basePrice,
        currency: 'INR',
        originalPrice: Math.round(basePrice * 1.25),
        priceType: PriceType.PER_PERSON,
      }),
      dateRepo.save(datesToSave),
      itineraryRepo.save(itinerariesToSave),
      mediaRepo.save(mediaToSave),
    ]);

    allTrips.push(trip);

    if ((i + 1) % 25 === 0) console.log(`  ... ${i + 1}/150 trips created`);
  }
  console.log(
    `✅ Created ${allTrips.length} trips with locations, prices, dates, itineraries, and media`,
  );

  // ─── 6. Seed Reviews ──────────────────────────────────────────
  console.log('⭐ Seeding reviews...');
  const reviewRepo = AppDataSource.getRepository(ReviewEntity);
  const reviewComments = [
    'Absolutely amazing experience! The guides were fantastic and the views were breathtaking.',
    'Great trip, well organized. Would definitely recommend to friends and family.',
    'One of the best trips I have ever been on. Everything was perfectly planned.',
    'The accommodation was comfortable and the food was delicious. Loved every moment.',
    'Stunning landscapes and wonderful local experiences. Worth every penny.',
    'The trek was challenging but rewarding. Our guide was very supportive.',
    'Perfect getaway from the city. The camping experience was surreal.',
    'Excellent value for money. The itinerary covered all the highlights.',
    'Beautiful destination, great company, and memories to last a lifetime.',
    'The sunrise view from the summit was indescribable. Highly recommended!',
  ];

  let reviewCount = 0;
  for (let i = 0; i < Math.min(80, allTrips.length); i++) {
    const numReviews = randInt(1, 3);
    for (let r = 0; r < numReviews; r++) {
      await reviewRepo.save({
        rating: randInt(3, 5),
        comment: rand(reviewComments),
        status: 'approved',
        user: customerUsers[randInt(0, customerUsers.length - 1)],
        trip: allTrips[i],
      });
      reviewCount++;
    }
  }
  console.log(`✅ Created ${reviewCount} reviews`);

  // ─── 7. Seed Promo Codes ──────────────────────────────────────
  console.log('🎟️  Seeding promo codes...');
  const promoRepo = AppDataSource.getRepository(PromoCodeEntity);
  await promoRepo.save([
    {
      code: 'WELCOME10',
      discountValue: 10,
      discountType: 'percentage' as any,
      isActive: true,
      usageLimit: 1000,
      usedCount: 234,
      validFrom: new Date(),
      validUntil: futureDate(90),
      description: 'Welcome discount for new users',
      minPurchaseAmount: 0,
    },
    {
      code: 'SUMMER25',
      discountValue: 25,
      discountType: 'percentage' as any,
      isActive: true,
      usageLimit: 500,
      usedCount: 89,
      validFrom: new Date(),
      validUntil: futureDate(60),
      description: 'Summer special offer',
      minPurchaseAmount: 5000,
    },
    {
      code: 'FLAT500',
      discountValue: 500,
      discountType: 'fixed' as any,
      isActive: true,
      usageLimit: 200,
      usedCount: 45,
      validFrom: new Date(),
      validUntil: futureDate(30),
      description: 'Flat ₹500 off on all trips',
      minPurchaseAmount: 3000,
    },
    {
      code: 'ADVENTURE20',
      discountValue: 20,
      discountType: 'percentage' as any,
      isActive: true,
      usageLimit: 300,
      usedCount: 122,
      validFrom: new Date(),
      validUntil: futureDate(45),
      description: '20% off on adventure trips',
      minPurchaseAmount: 0,
    },
    {
      code: 'WEEKEND15',
      discountValue: 15,
      discountType: 'percentage' as any,
      isActive: true,
      usageLimit: 250,
      usedCount: 67,
      validFrom: new Date(),
      validUntil: futureDate(30),
      description: 'Weekend trip special',
      minPurchaseAmount: 0,
    },
  ]);
  console.log('✅ Created 5 promo codes');

  // ─── 8. Seed Bookings ─────────────────────────────────────────
  console.log('📋 Seeding bookings...');
  const bookingRepo = AppDataSource.getRepository(BookingEntity);
  let bookingCount = 0;
  for (let i = 0; i < 30; i++) {
    const trip = allTrips[i];
    const customer = customerUsers[i % customerUsers.length];
    const vendor = vendors[i % vendors.length];
    const baseP = randInt(5000, 20000);
    const guests = randInt(1, 4);
    const platformFee = Math.round(baseP * 0.05);
    const serviceFee = Math.round(baseP * 0.03);
    const taxes = Math.round(baseP * 0.18);
    const total = baseP + platformFee + serviceFee + taxes;
    const vendorAmount = Math.round(total * 0.85);

    await bookingRepo.save({
      bookingNumber: `TD-${Date.now()}-${1000 + i}`,
      trip,
      user: customer,
      vendor,
      totalGuests: guests,
      guestDetails: {
        leadGuest: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        },
      },
      tripSnapshot: {
        title: trip.title,
        slug: trip.slug,
        duration: { days: trip.durationDays, nights: trip.durationNights },
        location: {
          city: indianCities[i % indianCities.length].city,
          country: 'India',
        },
        image: unsplashImages[i % unsplashImages.length],
      },
      basePrice: baseP,
      platformFee,
      serviceFee,
      taxes,
      discount: 0,
      totalPrice: total,
      vendorAmount,
      paymentStatus: rand([
        PaymentStatus.PAID,
        PaymentStatus.PAID,
        PaymentStatus.PENDING,
      ]),
      paymentMethod: rand([
        PaymentMethod.UPI,
        PaymentMethod.CARD,
        PaymentMethod.RAZORPAY,
      ]),
      status: rand([
        BookingStatus.CONFIRMED,
        BookingStatus.CONFIRMED,
        BookingStatus.COMPLETED,
        BookingStatus.PENDING,
      ]),
      refundStatus: RefundStatus.NONE,
    });
    bookingCount++;
  }
  console.log(`✅ Created ${bookingCount} bookings`);

  // ─── Done! ────────────────────────────────────────────────────
  console.log('\n🎉 ═══════════════════════════════════════');
  console.log('🎉  SEED COMPLETE!');
  console.log('🎉  • 4 Roles');
  console.log('🎉  • 1 Admin + 20 Customers + 50 Vendor Users');
  console.log('🎉  • 50 Vendors');
  console.log(
    '🎉  • 150 Trips (with locations, prices, dates, itineraries, media)',
  );
  console.log(`🎉  • ${reviewCount} Reviews`);
  console.log('🎉  • 5 Promo Codes');
  console.log(`🎉  • ${bookingCount} Bookings`);
  console.log('🎉  • 1 Global Settings');
  console.log('🎉 ═══════════════════════════════════════\n');

  await AppDataSource.destroy();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
