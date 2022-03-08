
import basicAuth from 'express-basic-auth'
import { Record } from '../models/record'

const {
  RINGCENTRAL_CHATBOT_ADMIN_USERNAME,
  RINGCENTRAL_CHATBOT_ADMIN_PASSWORD
} = process.env

const auth = basicAuth({
  users: {
    [RINGCENTRAL_CHATBOT_ADMIN_USERNAME]: RINGCENTRAL_CHATBOT_ADMIN_PASSWORD
  }
})

// create database tables if not exists
const initDb = async (req, res) => {
  await Record.sync()
  res.send('ok')
}

export default (app) => {
  app.put('/admin/setup-database', auth, initDb)
}
