import {
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromoCodeEntity } from '../../entities/promo-code.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';
import {
  CreatePromoCodeDto,
  UpdatePromoCodeDto,
} from '../dto/admin-promo-codes.dto';

@Roles(UserRole.SUPER_ADMIN, UserRole.GROWTH_ADMIN)
@Controller('admin/promo-codes')
export class AdminPromoCodesController {
  constructor(
    @InjectRepository(PromoCodeEntity)
    private readonly promoRepo: Repository<PromoCodeEntity>,
  ) {}

  @Get()
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

  @Get(':id')
  async getPromoCode(@Param('id') id: string) {
    const promo = await this.promoRepo.findOne({ where: { id } });
    if (!promo) throw new NotFoundException('Promo code not found');
    return { success: true, data: { promo } };
  }

  @Post()
  async createPromoCode(@Body() data: CreatePromoCodeDto) {
    const promo = this.promoRepo.create(data);
    await this.promoRepo.save(promo);
    return { success: true, data: { promo } };
  }

  @Patch(':id')
  async updatePromoCode(
    @Param('id') id: string,
    @Body() data: UpdatePromoCodeDto,
  ) {
    await this.promoRepo.update(id, data);
    const promo = await this.promoRepo.findOne({ where: { id } });
    return { success: true, data: { promo } };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deletePromoCode(@Param('id') id: string) {
    await this.promoRepo.delete(id);
    return { success: true, data: { success: true } };
  }
}
