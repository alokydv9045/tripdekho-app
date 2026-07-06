import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { PromocodesService } from '../services/promocodes.service';
import { ApplyPromoCodeDto } from '../dto/promocodes.dto';

@Controller('promo-codes')
export class PromocodesController {
  constructor(private readonly promocodesService: PromocodesService) {}

  @Get(':code')
  async getPromoCodeEndpoint(@Param('code') code: string) {
    return this.getPromoCode(code);
  }

  private async getPromoCode(code: string) {
    let promo = await this.promocodesService.findByCode(code);
    if (!promo) {
      try {
        promo = await this.promocodesService.findOne(code);
      } catch (e) {}
    }
    if (!promo) throw new NotFoundException('Promo code not found');
    return promo;
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validatePromoCodeEndpoint(
    @Body() body: ApplyPromoCodeDto,
  ) {
    return this.validatePromoCode(body);
  }

  private async validatePromoCode(body: ApplyPromoCodeDto) {
    const amount =
      body.purchaseAmount !== undefined ? body.purchaseAmount : body.amount;
    const promo = await this.promocodesService.validateCode(
      body.code,
      amount || 0,
    );
    return { valid: true, promo };
  }
}
