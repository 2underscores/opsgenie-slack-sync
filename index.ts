import opsgenie from 'opsgenie-sdk';

async function getOnCallUserForSchedule() {
  opsgenie.configure({
    api_key: process.env.OPSGENIE_API_KEY as string,
  });

  try {
    const response = await opsgenie.scheduleV2.getOnCall({
      identifier: 'YOUR_SCHEDULE_ID_HERE',
      identifierType: 'id',
      params: {
        expand: 'rotation',
      }
    });

    const onCallParticipants = response.data?.onCallParticipants || [];
    if (onCallParticipants.length === 0) {
      console.log('No one is currently on-call.');
      return;
    }

    const primaryOnCall = onCallParticipants[0];
    console.log('Currently on-call:', primaryOnCall);
  } catch (error) {
    console.error('Error fetching on-call user:', error);
  }
}

getOnCallUserForSchedule();