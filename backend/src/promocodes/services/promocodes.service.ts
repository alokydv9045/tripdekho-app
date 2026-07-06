import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PromoCodeEntity } from '../../entities/promo-code.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PromocodesService {
  constructor(
    @InjectRepository(PromoCodeEntity)
    private readonly promoRepo: Repository<PromoCodeEntity>,
  ) {}

  async findAll() {
    return this.promoRepo.find();
  }

  async findOne(id: string) {
    const promo = await this.promoRepo.findOne({ where: { id } });
    if (!promo) throw new NotFoundException('Promo code not found');
    return promo;
  }

  async findByCode(code: string) {
    return this.promoRepo.findOne({ where: { code } });
  }

  async create(data: Partial<PromoCodeEntity>) {
    const promo = this.promoRepo.create(data);
    return this.promoRepo.save(promo);
  }

  async update(id: string, data: Partial<PromoCodeEntity>) {
    await this.promoRepo.update(id, data);
    return this.findOne(id);
  }

  async delete(id: string) {
    await this.promoRepo.delete(id);
    return { success: true };
  }

  async validateCode(code: string, purchaseAmount: number) {
    const promo = await this.promoRepo.findOne({ where: { code } });
    if (!promo) throw new NotFoundException('Promo code not found');

    if (!promo.isActive)
      throw new BadRequestException('Promo code is not active');

    const now = new Date();
    if (now < promo.validFrom)
      throw new BadRequestException('Promo code is not yet valid');
    if (now > promo.validUntil)
      throw new BadRequestException('Promo code has expired');

    if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
      throw new BadRequestException('Promo code usage limit exceeded');
    }

    if (purchaseAmount < promo.minPurchaseAmount) {
      throw new BadRequestException(
        `Minimum purchase amount of ${promo.minPurchaseAmount} required`,
      );
    }

    return promo;
  }
}
