import { proxyActivities, sleep } from '@temporalio/workflow';
import type * as activities from './booking.activities';

const {
  holdPayment,
  capturePayment,
  releasePayment,
  sendBookingConfirmationEmail,
} = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

export async function executeBookingLifecycle(
  bookingId: string,
  userEmail: string,
): Promise<string> {
  // Step 1: Hold Payment
  const isHeld = await holdPayment(bookingId);
  if (!isHeld) {
    throw new Error(`Failed to hold payment for booking ${bookingId}`);
  }

  // Step 2: Wait up to 48 hours for vendor approval
  // For demo purposes, we'll sleep for 2 minutes
  await sleep('2 minutes');

  // Simulated vendor approval condition
  // In a real system, you'd wait for a Signal from the vendor API
  const isApproved = true;

  if (isApproved) {
    // Step 3a: Capture Payment & Email
    await capturePayment(bookingId);
    await sendBookingConfirmationEmail(bookingId, userEmail);
    return 'CONFIRMED';
  } else {
    // Step 3b: Release Payment
    await releasePayment(bookingId);
    return 'REJECTED';
  }
}
