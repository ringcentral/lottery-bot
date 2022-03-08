/**
 * auto init database after server running
 */

const axios = require('axios')
const port = process.env.SERVER_PORT
const host = process.env.SERVER_HOST
const urls = [
  `http://${host}:${port}/bot-admin/setup-database`,
  `http://${host}:${port}/admin/setup-database`
]

export default () => {
  for (const url of urls) {
    console.log('-> init database...')
    console.log('->', url)
    axios.put(
      url,
      undefined,
      {
        auth: {
          username: process.env.RINGCENTRAL_CHATBOT_ADMIN_USERNAME,
          password: process.env.RINGCENTRAL_CHATBOT_ADMIN_PASSWORD
        }
      }
    )
  }
}
