import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, BadRequestException, Logger } from '@nestjs/common';
import { CreateVendorCommand } from '../create-vendor.command';
import { IVendorRepository } from '../../ports/vendor.repository.interface';
import { VendorEntity } from '../../../entities/vendor.entity';
import { Connection, Client } from '@temporalio/client';
import { vendorOnboardingWorkflow } from '../../../workflows/vendor-onboarding/vendor.workflow';

@CommandHandler(CreateVendorCommand)
export class CreateVendorHandler implements ICommandHandler<CreateVendorCommand> {
  private readonly logger = new Logger(CreateVendorHandler.name);

  constructor(
    @Inject(IVendorRepository)
    private readonly vendorRepository: IVendorRepository,
  ) {}

  async execute(command: CreateVendorCommand): Promise<VendorEntity> {
    const { userId, createVendorDto } = command;

    const existingVendor = await this.vendorRepository.findByUserId(userId);
    if (existingVendor) {
      throw new BadRequestException(
        'Vendor profile already exists for this user',
      );
    }

    const vendor = await this.vendorRepository.create(userId, createVendorDto);

    // Trigger Temporal Workflow
    try {
      const connection = await Connection.connect({
        address: process.env.TEMPORAL_ADDRESS || 'temporal:7233',
      });
      const client = new Client({
        connection,
      });

      await client.workflow.start(vendorOnboardingWorkflow, {
        args: [
          vendor.id,
          (createVendorDto as any).businessRegistrationNumber || 'UNKNOWN',
          createVendorDto,
        ],
        taskQueue: 'vendor-onboarding',
        workflowId: `vendor-onboarding-${vendor.id}`,
      });

      this.logger.log(`Started vendor onboarding workflow for ${vendor.id}`);
    } catch (e) {
      this.logger.error(
        `Failed to start Temporal workflow: ${e.message}. Vendor was still created.`,
      );
    }

    return vendor;
  }
}
