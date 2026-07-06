import { Worker } from '@temporalio/worker';
import * as bookingActivities from './workflows/booking-lifecycle/booking.activities';
import * as vendorActivities from './workflows/vendor-onboarding/vendor.activities';
import * as settlementActivities from './workflows/settlement/settlement.activities';

async function run() {
  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows/index'),
    activities: {
      ...bookingActivities,
      ...vendorActivities,
      ...settlementActivities,
    },
    taskQueue: 'tripdekho-tasks',
  });

  console.log(
    'Temporal Worker started. Listening to taskQueue: tripdekho-tasks',
  );
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
