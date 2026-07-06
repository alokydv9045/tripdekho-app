const { DataSource } = require('typeorm');
const path = require('path');

const AppDataSource = new DataSource({
  type: 'postgres',
  url: 'postgresql://postgres.waeblcermeghvtcramfa:Tripdekho%40123@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres',
  schema: 'tripdekho',
  entities: [path.join(__dirname, 'src/**/*.entity{.ts,.js}')],
  synchronize: false,
});

AppDataSource.initialize().then(async () => {
  try {
    const tripRepo = AppDataSource.getRepository('TripEntity');
    const trips = await tripRepo.find({
      relations: {
        location: true,
        price: true,
        dates: true,
        media: true,
        vendor: true,
      },
      order: { createdAt: 'DESC' }
    });
    console.log('SUCCESS:', trips.length);
  } catch (err) {
    console.error('ERROR:', err.message);
  } finally {
    await AppDataSource.destroy();
  }
}).catch(err => console.error(err));
