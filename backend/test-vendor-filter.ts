import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { AdminVendorsController } from './src/admin/controllers/admin-vendors.controller';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const controller = app.get(AdminVendorsController);
  
  console.log("--- ALL VENDORS ---");
  const all = await controller.getAllVendors({});
  console.log(all.data.vendors.map(v => ({ id: v.id, status: v.verificationStatus })));
  
  console.log("\n--- PENDING VENDORS ---");
  const pending = await controller.getAllVendors({ status: 'pending' });
  console.log(pending.data.vendors.map(v => ({ id: v.id, status: v.verificationStatus })));

  console.log("\n--- APPROVED VENDORS ---");
  const approved = await controller.getAllVendors({ status: 'approved' });
  console.log(approved.data.vendors.map(v => ({ id: v.id, status: v.verificationStatus })));

  await app.close();
}
bootstrap();
