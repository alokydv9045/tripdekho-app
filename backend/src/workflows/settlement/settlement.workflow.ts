import { proxyActivities } from '@temporalio/workflow';
import type * as activities from './settlement.activities';

const { calculateAmounts, deductTDS, createRazorpayTransfer } = proxyActivities<
  typeof activities
>({
  startToCloseTimeout: '1 minute',
});

export async function settlementWorkflow(
  vendorId: string,
  grossAmount: number,
  bankAccountId: string,
): Promise<string> {
  // Step 1: Calculate commission
  const { netAmount } = await calculateAmounts(grossAmount);

  // Step 2: Deduct TDS
  const finalPayout = await deductTDS(netAmount);

  // Step 3: Create Razorpay Route Transfer
  const transferId = await createRazorpayTransfer(
    vendorId,
    finalPayout,
    bankAccountId,
  );

  return `SETTLEMENT_COMPLETED_${transferId}`;
}
