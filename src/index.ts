import { syncSlackWithOpsgenie, type ScheduleToSlackGroupChannel } from "./syncOpsgenieSlack.js";

const RosterSlackMappings: ScheduleToSlackGroupChannel[] = [
  // Actual Platform squad alerting. Sends message and updates support group
  {
    opsgenieScheduleName: 'Platform_schedule',
    // slackChannelName: 'squad-platform', // Can be provided, but expensive paginated API call. Use Channel ID instead
    // slackChannelId: 'C05MD9Y10P9',
    slackChannelId: 'C084X18A92N', // Sends to #tmp-test-opsgenie-sync,
    slackGroupName: 'Platform Support',
  },
  // // Example Squad1 only update group membership
  // {
  //   opsgenieScheduleName: 'Squad1schedule',
  //   slackGroupName: 'Squad1 Roster',
  // },
  // // Example squad2 only send message to channel
  // {
  //   opsgenieScheduleName: 'Squad2 - Operations Schedule',
  //   slackChannelId: 'C084X18A92N', // Sends to #tmp-test-opsgenie-sync,
  // },
  // // Other squad configs below here
]

// Lambda handler
export const handler = async (event: any) => {
  console.log("Lambda triggered:", event);
  const results = await syncSlackWithOpsgenie(RosterSlackMappings);
  const body = JSON.stringify({ results });
  return {
    statusCode: 200,
    body: body,
  };
};

// Local trigger handler
if (import.meta.url === new URL(import.meta.url).href) {
  const results = await syncSlackWithOpsgenie(RosterSlackMappings);
  console.log({ results });
  const body = JSON.stringify({ results }); // Make sure works for lambda
}