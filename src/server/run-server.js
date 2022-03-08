import app from './app/app'
import initDb from './app/common/init-db'
import botConfig from './app/bot/bot-config'

const {
  SERVER_PORT: port,
  SERVER_HOST: host,
  RINGCENTRAL_CHATBOT_SERVER: server,
  APP_HOME = '/'
} = process.env

app.listen(port, host, () => {
  console.log(`-> server running at: http://${host}:${port}${APP_HOME}`)
  console.log(`bot oauth uri: ${server}${botConfig.botRoute}/oauth`)
  console.log(`card interactive message uri: ${server}${botConfig.cardRoute}`)
  initDb()
})
