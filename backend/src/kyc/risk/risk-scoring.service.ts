import { Injectable } from '@nestjs/common';

export interface KycResults {
  gstValid: boolean;
  panValid: boolean;
  bankVerified: boolean;
}

export interface VendorDetails {
  businessName?: string;
  description?: string;
  website?: string;
  socialMedia?: { instagram?: string; facebook?: string };
  businessType?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface RiskScore {
  score: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: Record<string, number>;
}

@Injectable()
export class RiskScoringService {
  calculateScore(vendor: VendorDetails, kycResults: KycResults): RiskScore {
    let score = 0;
    const factors: Record<string, number> = {};

    // Document verification (max 30 points)
    if (kycResults.gstValid) {
      score += 15;
      factors['gst_verified'] = 15;
    }
    if (kycResults.panValid) {
      score += 10;
      factors['pan_verified'] = 10;
    }
    if (kycResults.bankVerified) {
      score += 5;
      factors['bank_verified'] = 5;
    }

    // Business profile completeness (max 20 points)
    if (vendor.businessName && vendor.description) {
      score += 10;
      factors['profile_complete'] = 10;
    }
    if (vendor.website) {
      score += 5;
      factors['has_website'] = 5;
    }
    if (vendor.socialMedia?.instagram || vendor.socialMedia?.facebook) {
      score += 5;
      factors['social_presence'] = 5;
    }

    // Business type (max 15 points)
    if (vendor.businessType === 'company') {
      score += 15;
      factors['registered_company'] = 15;
    } else if (vendor.businessType === 'agency') {
      score += 10;
      factors['registered_agency'] = 10;
    } else {
      score += 5;
      factors['individual'] = 5;
    }

    // Location (max 10 points)
    if (vendor.city && vendor.state && vendor.country) {
      score += 10;
      factors['full_address'] = 10;
    }

    const riskLevel =
      score >= 70
        ? 'low'
        : score >= 50
          ? 'medium'
          : score >= 30
            ? 'high'
            : 'critical';

    return { score, riskLevel, factors };
  }
}
