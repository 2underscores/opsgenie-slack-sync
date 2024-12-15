import { syncSlackWithOpsgenie } from "./syncOpsgenieSlack.js";
const RosterSlackMappings = [
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
];
// Lambda handler
export const handler = async (event, context) => {
    try {
        const results = await syncSlackWithOpsgenie(RosterSlackMappings);
        console.log({ results });
        return {
            statusCode: 200,
            body: JSON.stringify({ results }),
        };
    }
    catch (error) {
        console.error('Error in Lambda execution:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' }),
        };
    }
};
// Local trigger handler
if (import.meta.url === new URL(import.meta.url).href) {
    const results = await syncSlackWithOpsgenie(RosterSlackMappings);
    console.log({ results });
    const body = JSON.stringify({ results }); // Make sure works for lambda
}
