/* eslint-disable max-len */
import * as cheerio from 'cheerio';
import Axios from 'axios';

export default async (trackNumber) => {
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
