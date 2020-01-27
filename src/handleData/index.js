/* eslint-disable max-len */
import * as cheerio from 'cheerio';
import Axios from 'axios';
import Track from '../../db/models/tracks';

export const getTrackInfo = async (trackNumber) => {
  const { data } = await Axios.get(
    `http://posta.md/ro/tracking?id=${trackNumber}`,
  );
  const $ = cheerio.load(data);
  const dataRows = $('.row');
  const events = [];

  dataRows.each(function () {
    const date = $(this)
      .children('.tracking-result-header-date')
      .text();
    const event = $(this)
      .children('.tracking-result-header-event')
      .text();

    events.push({ date, event });
  });

  return events;
};

// export const addOrUpdateData = async ({
//   data,
//   userId,
//   trackingNumber,
//   ...rest
// }) => {
//   return Track.updateOne(
//     { userId, trackingNumber },
//     {
//       trackingNumber,
//       userId,
//       trackInfo: JSON.stringify(data),
//       ...rest,
//     },
//     { upsert: true, setDefaultsOnInsert: true },
//   );
// };

export const deleteData = async ({ userId, trackingNumber }) => Track.deleteOne({ userId, trackingNumber });

// export const saveData = async ({ userId, trackingNumber, parsedEvent = null, ...rest }) => {
//   const data = await getTrackInfo(trackingNumber);

//   const lastEvent = parsedEvent || data.length ? data.slice(-1)[0].event : null;

//   try {
//     await addOrUpdateData({
//       data,
//       userId,
//       trackingNumber,
//       lastUpdated: new Date(),
//       lastEvent,
//       ...rest,
//     });
//     return { data, error: null };
//   } catch (error) {
//     return { data: null, error };
//   }
// };
