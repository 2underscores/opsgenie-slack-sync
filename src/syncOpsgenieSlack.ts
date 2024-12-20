import { OpsgenieService } from "./services/opsgenie.js"
import { SlackService } from './services/slack.js';
import { config } from './config.js';

export interface ScheduleToSlackGroupChannel {
    opsgenieScheduleName: string, /** Schedule to pull oncall user from */
    slackGroupName?: string,
    slackChannelName?: string, // Very inefficient to get channel ID back
    slackChannelId?: string,
}

export async function syncSlackWithOpsgenie(rosterSlackMappings: ScheduleToSlackGroupChannel[]) {
    const slack = new SlackService(config.slackKey);
    const opsgenie = new OpsgenieService(config.opsgenieKey)
    // For each schedule given, update slack group (if provided) and send message to channel (if provided)
    const results = []
    for (const scheduleMap of rosterSlackMappings) {
        console.log({ schedule: scheduleMap.opsgenieScheduleName });
        // Get email of user oncall for schedule
        const schedule = await opsgenie.getScheduleFromName(scheduleMap.opsgenieScheduleName)
        const oncallCallPersons = await opsgenie.getOncallFromSchedule(schedule.id)
        const oncallEmail: string | undefined = oncallCallPersons[0]?.name // ? if blank list
        console.log({ schedule: scheduleMap.opsgenieScheduleName, oncallCallPersons, oncallEmail });
        // Set user ID, and have as null if Nobody on call at the moment.
        let userId
        if (oncallEmail) {
            userId = await slack.getUserIdByEmail(oncallEmail)
            if (!userId) {
                console.error({ message: `User found in Opsgenie (${oncallEmail}) but not found in Slack`, oncallEmail, userId });
            }
        } else {
            userId = null
        }
        // Update support user group if supplied and user found. Otherwise leave blank
        let groupId = null
        let groupUpdateResponse = null
        if (scheduleMap.slackGroupName) {
            groupId = await slack.getUserGroupIdByName(scheduleMap.slackGroupName)
            if (!groupId) {
                console.error({ message: `Group ID not found for group name: ${scheduleMap.slackGroupName}` });
            }
            if (groupId && userId) {
                groupUpdateResponse = await slack.setUserGroupMembers(groupId, [userId]);
            }
        }
        // If Channel Name and no ID given, Map name to ID
        if (!scheduleMap.slackChannelId && scheduleMap.slackChannelName) {
            console.log({ channelName: scheduleMap.slackChannelName });
            scheduleMap.slackChannelId = await slack.getChannelIdByName(scheduleMap.slackChannelName)
            if (!scheduleMap.slackChannelId) {
                console.error({ error: `Could not get channel ID from channel name: ${scheduleMap.slackChannelName}` });
                continue
            }
        }
        // Send message to slack channel if provided
        let messageSendResponse
        if (scheduleMap.slackChannelId) {
            const userTag = userId ? `<@${userId}>` : `Nobody`
            const scheduleLink = `https://constantinople.app.opsgenie.com/settings/schedule/detail/${schedule.id}`
            const supportGroupTag = groupId ?
                `<!subteam^${groupId}> (<${scheduleLink}|schedule>)` :
                `<${scheduleLink}|${scheduleMap.opsgenieScheduleName}>`
            const message = `${userTag} is on ${supportGroupTag} today`;
            messageSendResponse = await slack.sendMessage(scheduleMap.slackChannelId, message);
        }
        const result = { schedule, messageSendResponse, groupUpdateResponse }
        console.log({ ...result });
        results.push(result)
    }
    return results
}