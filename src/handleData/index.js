import * as cheerio from "cheerio"
import Axios from "axios"
import Track from '../../db/models/tracks';

export const getTrackInfo = async trackNumber => {
  const { data } = await Axios.get(
    `http://posta.md/ro/tracking?id=${trackNumber}`
  )
  const $ = cheerio.load(data)
  const dataRows = $(".row")
  const events = []

  dataRows.each(function() {
    const date = $(this)
      .children(".tracking-result-header-date")
      .text()
    const event = $(this)
      .children(".tracking-result-header-event")
      .text()

    events.push({ date, event })
  })

  return events
}

export const addOrUpdateData = async ({ data, userId, trackingNumber }) => {
  await Track.updateOne({ userId, trackingNumber }, { trackingNumber, userId, trackInfo: JSON.stringify(data) }, { upsert: true, setDefaultsOnInsert: true})
}

