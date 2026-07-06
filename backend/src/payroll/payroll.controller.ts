import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { AuthGuard } from '@nestjs/passport';
import { ProcessPayrollDto } from './dto/payroll.dto';

@Controller('payroll')
@UseGuards(AuthGuard('jwt'))
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get('payouts')
  async getVendorPayouts(@Request() req: any, @Query() query: any) {
    // Assuming req.user contains the user and req.user.vendorId or we fetch vendor by user id
    // In our seed, vendorProfile has a user. Let's assume req.user.id can map to vendorProfile.id in service,
    // but for simplicity here we just pass req.user.id and assume service handles it or req.user.vendorId is set
    // Wait, let's just pass req.user.id for now. In a real app we'd get vendor.id.
    const vendorId = req.user.vendorId || req.user.id;
    return this.payrollService.getVendorPayouts(vendorId, query);
  }

  @Get('payouts/:id')
  async getPayoutDetails(@Param('id') id: string) {
    return this.payrollService.getPayoutDetails(id);
  }

  @Get('ledger')
  async getLedger(@Request() req: any, @Query() query: any) {
    const vendorId = req.user.vendorId || req.user.id;
    return this.payrollService.getLedger(vendorId, query);
  }

  @Post('request-payout')
  async requestPayout(@Request() req: any, @Body() body: ProcessPayrollDto) {
    const vendorId = req.user.vendorId || req.user.id;
    return this.payrollService.requestPayout(vendorId, body);
  }

  @Get('summary')
  async getSummary(@Request() req: any, @Query('period') period: string) {
    const vendorId = req.user.vendorId || req.user.id;
    return this.payrollService.getSummary(vendorId, period || 'month');
  }

  @Get('admin/payouts')
  async getAllPayouts(@Query() query: any) {
    return this.payrollService.getAllPayouts(query);
  }

  @Post('process/:id')
  async processPayout(@Param('id') id: string) {
    return this.payrollService.processPayout(id);
  }
}
