import TGBot from "node-telegram-bot-api"
import { saveData } from "../handleData"

const bot = {}

const TEST_MODE = process.env.TEST

bot.init = function() {
  const tgBot = new TGBot(process.env.TG_BOT, { polling: true })

  tgBot.onText(/\/start/, ({ chat: { id } }) => {
    tgBot.sendMessage(id, "/start -> shows list of commands")
    tgBot.sendMessage(
      id,
      "/track -> followed by tracking number (/track RP*****12)"
    )
    tgBot.sendMessage(
      id,
      "/untrack -> followed by tracking number (/untrack RP****32)"
    )
  })

  tgBot.onText(/\/track (.+)/, async ({ chat }, match) => {
    const trackingNumber = match[1]
    const rsp = await saveData({ trackingNumber, userId: chat.id })
    if (rsp.error) {
      tgBot.sendMessage(chat.id, JSON.stringify(rsp.error))
    } else {
      tgBot.sendMessage(
        chat.id,
        `Started tracking ${trackingNumber}, will stop if there are no updates in 2 weeks`
      )
      if (!rsp.data) {
        tgBot.sendMessage(
          chat.id,
          "There is no registered data rn for this tracking number"
        )
        return
      }
      const { event, date } = rsp.data.slice(-1)[0]
      tgBot.sendMessage(chat.id, `Last event: ${event} registered on ${date}`)
      if (TEST_MODE) tgBot.sendMessage(chat.id, JSON.stringify(rsp.data))
    }
  })

  if (TEST_MODE) {
    tgBot.on("message", msg => {
      const chatId = msg.chat.id
      console.log(msg)
      console.log("recieved message")
      // send a message to the chat acknowledging receipt of their message
      tgBot.sendMessage(chatId, "Received your message")
    })
  }
}

export default bot
