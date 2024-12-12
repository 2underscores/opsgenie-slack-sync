import { SlackService } from './services/slack';
import { config } from './config';

async function updateSupport() {
  const slack = new SlackService(config.slack.token);
  
  try {
    // Send message about new person on support
    await slack.sendMessage(
      config.slack.channelId,
      `:rotating_light: ${"Hardocde_jeremy"} is now on support duty!`
    );

    // // Get their Slack user ID (assuming email is available)
    // const userId = await slack.getUserIdByEmail('user@company.com');
    // if (userId) {
    //   // Update user group membership
    //   await slack.updateUserGroupMembers(config.slack.userGroupId, [userId]);
    // }
  } catch (error) {
    console.error('Failed to update support info:', error);
  }
}

updateSupport()