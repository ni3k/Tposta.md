import * as cheerio from "cheerio"
import Axios from "axios"
import DB from "../../db"

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
  const sql = `CASE EXISTS ( select * from TRACKS )`
  console.log(sql)
  DB.run(sql, err => {
    console.log(err)
  })
}

export const lastEntries = async () => {
  DB.all("select * from TRACKS where user_id='1' AND trackingNumber='RP877761813CN'", [], (err, rows) => {
    console.log(rows)
  })
}
