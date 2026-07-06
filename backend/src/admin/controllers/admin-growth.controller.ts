import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromoCodeEntity } from '../../entities/promo-code.entity';
import { CampaignEntity } from '../../entities/campaign.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';
import {
  CreateCampaignDto,
  UpdateCampaignDto,
  FeatureTripDto,
} from '../dto/admin-growth.dto';
import { CreatePromoCodeDto } from '../dto/admin-promo-codes.dto';

@Roles(UserRole.SUPER_ADMIN, UserRole.GROWTH_ADMIN)
@Controller('admin/growth')
export class AdminGrowthController {
  constructor(
    @InjectRepository(PromoCodeEntity)
    private readonly promoRepo: Repository<PromoCodeEntity>,
    @InjectRepository(CampaignEntity)
    private readonly campaignRepo: Repository<CampaignEntity>,
  ) {}

  @Get('campaigns')
  async getCampaigns(@Query() query: Record<string, unknown>) {
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;
    const [campaigns, total] = await this.campaignRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return {
      success: true,
      data: {
        campaigns,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  @Post('campaigns')
  async createCampaign(@Body() data: CreateCampaignDto) {
    const campaign = this.campaignRepo.create({
      title: data.title || 'New Campaign',
      type: data.type || 'seasonal_promo',
      budget: Number(data.budget) || 10000,
      status: 'active',
    });
    const saved = await this.campaignRepo.save(campaign);
    return { success: true, data: saved };
  }

  @Patch('campaigns/:id')
  async updateCampaign(
    @Param('id') id: string,
    @Body() data: UpdateCampaignDto,
  ) {
    const campaign = await this.campaignRepo.findOne({ where: { id } });
    if (!campaign) throw new NotFoundException('Campaign not found');
    await this.campaignRepo.update(id, data);
    const updated = await this.campaignRepo.findOne({ where: { id } });
    return { success: true, data: updated };
  }

  @Get('promos')
  async getPromoCodes(@Query() query: Record<string, unknown>) {
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;
    const [promos, total] = await this.promoRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return {
      success: true,
      data: { promos, total, totalPages: Math.ceil(total / limit), page },
    };
  }

  @Post('promos')
  async createPromoCode(@Body() data: CreatePromoCodeDto) {
    const promo = this.promoRepo.create(data);
    await this.promoRepo.save(promo);
    return { success: true, data: { promo } };
  }

  @Patch('trips/:id/feature')
  featureTripPriority(@Param('id') _id: string, @Body() _data: FeatureTripDto) {
    return { success: true, data: { success: true } };
  }
}
