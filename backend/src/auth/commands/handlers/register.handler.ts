import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterUserCommand } from '../register.command';
import { IUserRepository } from '../../ports/user.repository.interface';
import { Inject, ConflictException } from '@nestjs/common';
import { UserRole } from '../../../entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventConstants } from '../../../events/constants/events.constant';
import { UserRegisteredEvent } from '../../../events/dtos/user-registered.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VendorEntity } from '../../../entities/vendor.entity';
import * as crypto from 'crypto';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(VendorEntity)
    private readonly vendorRepo: Repository<VendorEntity>,
  ) {}

  async execute(command: RegisterUserCommand) {
    const { email, password, name, phone, referralCode } = command.registerDto;
    const businessName = (command.registerDto as any).businessName;
    const description = (command.registerDto as any).description;
    const requestedRole = (command.registerDto as any).role;
    const isVendorRegistration = requestedRole === 'vendor';

    let finalPassword = password;
    let generatedPassword = undefined;

    if (isVendorRegistration || !finalPassword) {
      generatedPassword = crypto.randomBytes(8).toString('hex') + '!A1';
      finalPassword = generatedPassword;
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    if (phone) {
      const existingPhone = await this.userRepository.findByPhone(phone);
      if (existingPhone) {
        throw new ConflictException('Phone number already in use');
      }
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(finalPassword, salt);

    const user = await this.userRepository.create({
      email,
      passwordHash,
      plainTextPassword: finalPassword,
      name,
      phone,
      role: isVendorRegistration ? UserRole.VENDOR : UserRole.CUSTOMER,
      isActive: true,
      mustChangePassword: isVendorRegistration,
    });

    // If registering as vendor, auto-create a linked VendorEntity with pending KYC
    if (isVendorRegistration) {
      const newVendor = this.vendorRepo.create({
        user: user,
        businessName: businessName || name,
        description: description || null,
        contactEmail: email,
        contactPhone: phone || '',
        verificationStatus: 'pending',
        kycStatus: 'pending',
      });
      await this.vendorRepo.save(newVendor);
    }

    const { passwordHash: _unused, ...result } = user;

    this.eventEmitter.emit(
      EventConstants.USER_REGISTERED,
      new UserRegisteredEvent(
        user.id,
        user.email,
        user.name,
        referralCode,
        generatedPassword,
        user.phone,
      ),
    );

    return { ...result, tempPassword: generatedPassword };
  }
}
