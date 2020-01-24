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

Daemon.checkPeriodically = async () => {
  await Daemon.checkTracks();
//   setInterval(async () => await Daemon.checkTracks, 10000);
};

Daemon.init = function () {
  Daemon.checkTracks();
//   Bot.sendMessage(367250529, 'sent from daemon');
};

export default Daemon;
