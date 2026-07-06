import { GstValidator } from '../../kyc/providers/gst-validator.service';
import {
  RiskScoringService,
  KycResults,
  RiskScore,
  VendorDetails,
} from '../../kyc/risk/risk-scoring.service';
import { HttpService } from '@nestjs/axios';

// Instantiating dependencies directly for activities (Temporal activities are functions)
const httpService = new HttpService();
const gstValidator = new GstValidator(httpService);
const riskScoringService = new RiskScoringService();

export async function validateGST(gstNumber: string): Promise<KycResults> {
  const result = await gstValidator.validate(gstNumber);

  return {
    gstValid: result.isValid,
    panValid: true, // Mocked
    bankVerified: true, // Mocked
  };
}

export async function calculateRiskScore(
  vendorData: VendorDetails,
  kycResults: KycResults,
): Promise<RiskScore> {
  return await riskScoringService.calculateScore(vendorData, kycResults);
}

import { Logger } from '@nestjs/common';

const logger = new Logger('VendorActivities');

export async function notifyAdmin(
  vendorId: string,
  message: string,
): Promise<void> {
  logger.log(`[ADMIN NOTIFICATION] Vendor: ${vendorId} - ${message}`);
  // In a real app, this might publish to RabbitMQ or use an email service
  await Promise.resolve();
}
