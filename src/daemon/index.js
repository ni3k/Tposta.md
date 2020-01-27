import cron from 'node-cron';
import Bot from '../tgBot';
import Track from '../../db/models/tracks';
import { getTrackInfo } from '../handleData';

const Daemon = {};


Daemon.checkTracks = async () => {
  const allTracks = await Track.find({}, 'trackingNumber userId lastEvent');
  await Promise.all(allTracks.map(async ({ trackingNumber, userId, lastEvent }) => {
    const data = await getTrackInfo(trackingNumber);
    const dataLastEvent = data.length ? data.slice(-1)[0].event : null;
    if (lastEvent === dataLastEvent) {
      return null;
    }
    Bot.sendMessage(userId, `New event registered for ${trackingNumber}: ${dataLastEvent}, \n see /getData {trackingNumber} to get last retrieved Data`);
    return Track.updateOne(
      { userId, trackingNumber },
      {
        trackingNumber,
        userId,
        trackInfo: JSON.stringify(data),
        lastEvent: dataLastEvent,
      },
    );
  }));
};

Daemon.checkPeriodically = () => {
  cron.schedule('* * * * *', async () => {
    await Daemon.checkTracks();
  });
};

Daemon.init = function () {
  Daemon.checkPeriodically();
};

export default Daemon;
