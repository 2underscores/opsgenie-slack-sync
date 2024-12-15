import { syncSlackWithOpsgenie, type ScheduleToSlackGroupChannel } from "./syncOpsgenieSlack.js";

const RosterSlackMappings: ScheduleToSlackGroupChannel[] = [
  {
    opsgenieScheduleName: 'Platform_schedule',
    slackChannelId: 'C084X18A92N', // #tmp-test-opsgenie-sync
    slackGroupName: 'Platform Support',
  },
  {
    opsgenieScheduleName: 'Platform_schedule',
    slackChannelId: 'C05MD9Y10P9', 
    slackGroupName: 'Platform Support',
  },
];

export const handler = async (event: any) => {
  console.log('Handler started');
  try {
    console.log('About to sync');
    const results = await syncSlackWithOpsgenie(RosterSlackMappings);
    console.log('Sync completed:', results);
    return {
      statusCode: 200,
      body: JSON.stringify({ results })
    };
  } catch (error) {
    console.error('Error in handler:', error);
    throw error;
  }
};