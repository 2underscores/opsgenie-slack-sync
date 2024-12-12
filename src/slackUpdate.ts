import { SlackService } from './services/slack.js';
import { config } from './config.js';
import * as url from 'url'

async function updateSupport() {
  const slack = new SlackService(config.slack.token);
  
  try {
    // // Send message about new person on support
    // await slack.sendMessage(
    //   config.slack.channelId,
    //   `:rotating_light: ${"Hardocde_jeremy"} is now on support duty!`
    // );

    // Get their Slack user ID (assuming email is available)
    const userId = await slack.getUserIdByEmail('jeremys@cxnpl.com'); // TODO: unhardcode
    console.log({userId});
    if (userId) {
      // Update user group membership
      await slack.updateUserGroupMembers(config.slack.userGroupId, [userId]);
    }
  } catch (error) {
    console.error('Failed to update support info:', error);
  }
}

if (url.fileURLToPath(import.meta.url) === process.argv[1]) {
  // eslint-disable-next-line es-x/no-top-level-await
  await updateSupport()
}