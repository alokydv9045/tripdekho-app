import { proxyActivities, sleep } from '@temporalio/workflow';
import type * as activities from './vendor.activities';

const { validateGST, calculateRiskScore, notifyAdmin } = proxyActivities<
  typeof activities
>({
  startToCloseTimeout: '1 minute',
});

export async function vendorOnboardingWorkflow(
  vendorId: string,
  gstNumber: string,
  vendorData: any,
): Promise<string> {
  // Step 1: Validate GST
  const kycResults = await validateGST(gstNumber);

  if (!kycResults.gstValid) {
    await notifyAdmin(vendorId, 'GST Validation Failed');
    return 'REJECTED_GST_INVALID';
  }

  // Step 2: Calculate Risk Score
  const riskScore = await calculateRiskScore(vendorData, kycResults);

  if (riskScore.score >= 70) {
    // Step 3: Auto Approve
    await notifyAdmin(vendorId, 'Vendor Auto-Approved based on Risk Score');
    return 'APPROVED';
  } else if (riskScore.score >= 50) {
    // Step 3: Manual Review Required
    await notifyAdmin(
      vendorId,
      'Vendor requires manual review due to medium risk',
    );

    // In a real workflow, we would use a signal here to wait for admin approval
    // For now we simulate waiting 2 days, then timing out
    await sleep('2 days');
    return 'TIMEOUT_PENDING_REVIEW';
  } else {
    // Step 3: High Risk Rejection
    await notifyAdmin(vendorId, 'Vendor rejected due to high risk score');
    return 'REJECTED_HIGH_RISK';
  }
}
