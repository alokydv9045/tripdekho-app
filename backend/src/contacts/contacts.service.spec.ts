import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ContactsService } from './contacts.service';
import { NewsletterSubscriberEntity } from '../entities/newsletter-subscriber.entity';
import { InquiryEntity } from '../entities/inquiry.entity';

describe('ContactsService', () => {
  let service: ContactsService;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService,
        {
          provide: getRepositoryToken(NewsletterSubscriberEntity),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(InquiryEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ContactsService>(ContactsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
