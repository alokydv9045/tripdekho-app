import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PayrollService } from './payroll.service';
import { PayoutEntity } from '../entities/payout.entity';
import { PayoutLedgerEntity } from '../entities/payout-ledger.entity';
import { BookingEntity } from '../entities/booking.entity';
import { VendorEntity } from '../entities/vendor.entity';

describe('PayrollService', () => {
  let service: PayrollService;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayrollService,
        {
          provide: getRepositoryToken(PayoutEntity),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(PayoutLedgerEntity),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(BookingEntity),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(VendorEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PayrollService>(PayrollService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
