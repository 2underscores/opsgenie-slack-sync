import * as url from "url";
import { getAllSchedules, getOncallUserEmailFromSchedule } from "./opsgenieOncalls.js"
import { SlackService } from './services/slack.js';
import { config } from './config.js';
import { exit } from "process";

interface ScheduleToSlackGroupChannel {
    opsgenieScheduleName: string,
    slackChannelName?: string, // Very inefficient to get channel ID back
    slackChannelId?: string,
    slackGroupName?: string,
}

async function syncSlackWithOpsgenie(rosterSlackMappings: ScheduleToSlackGroupChannel[]) {
    const slack = new SlackService(config.slack.token);

    const allOpsgenieSchedules = await getAllSchedules() // TODO: Move this to cache in class
    // TODO: Parallelise
    for (const scheduleMap of rosterSlackMappings) {
        // Get email of user oncall for schedule TODO: Make a single opsgenie call. Class it.
        console.log({ schedule: scheduleMap.opsgenieScheduleName });
        const schedule = allOpsgenieSchedules.find((sched: any) => sched.name === scheduleMap.opsgenieScheduleName)
        // const oncallEmail = await getOncallUserEmailFromSchedule(schedule.id)
        const oncallEmail = 'jeremys@cxnpl.com' // FIXME: unhardcode 4 prod
        let userId
        if (oncallEmail) {
            console.log({ oncallEmail, schedule: scheduleMap.opsgenieScheduleName });
            userId = await slack.getUserIdByEmail(oncallEmail)
            if (!userId) {
                console.error({ message: `User from Opsgenie is not found in Slack`, oncallEmail, userId });
            }
        } else {
            userId = null
        }
        // Update support channel group if wanted
        if (scheduleMap.slackGroupName && userId) {
            const groupId = await slack.getUserGroupIdByName(scheduleMap.slackGroupName)
            console.log({groupId});
            if (groupId) {
                await slack.setUserGroupMembers(groupId, [userId]);
            } else {
                console.error({ message: `Group ID not found for group name: ${scheduleMap.slackGroupName}`});
            }
        }
        // If Channel Name and no ID given, get ID
        if (!scheduleMap.slackChannelId && scheduleMap.slackChannelName) {
            console.log({ channelName: scheduleMap.slackChannelName });
            scheduleMap.slackChannelId = await slack.getChannelIdByName(scheduleMap.slackChannelName)
            if (!scheduleMap.slackChannelId) {
                console.error({ error: `Could not get channel ID from channel ${scheduleMap.slackChannelName}`});
                continue
            }
        }
        // Send message to channel if provided
        if (scheduleMap.slackChannelId) {
            const userTag = userId ? `<@${userId}>` : `Nobody`
            const message = `${userTag} is on <!subteam^${config.slack.userGroupId}> today`;
            await slack.sendMessage(scheduleMap.slackChannelId, message);
        }
    }
}

if (url.fileURLToPath(import.meta.url) === process.argv[1]) {
    // eslint-disable-next-line es-x/no-top-level-await
    const RosterSlackMappings: ScheduleToSlackGroupChannel[] = [
        // {
        //     opsgenieScheduleName: 'Platform_schedule',
        //     slackChannelName: 'squad-platform',
        //     slackChannelId: 'CXXXXXXXXXX',
        //     slackGroupName: 'Platform Support',
        // },
        {
            opsgenieScheduleName: 'Platform_schedule',
            // slackChannelName: 'tmp-test-opsgenie-sync',
            slackChannelId: 'C084X18A92N',
            slackGroupName: 'Platform Support',
        },
    ]
    await syncSlackWithOpsgenie(RosterSlackMappings);
}