
import botApi from './bot/bot-api'
import { resolve } from 'path'
import staticRoute from './routes/static'
import admin from './routes/admin'
import botConfig from './bot/bot-config'
import eventHandler from './bot/event-handler'
import express from 'express'
import {
  extendApp
} from 'ringcentral-chatbot-core'
import logger from 'morgan'

let app = express()
const skills = []
app.use(logger('tiny'))
app = extendApp(app, skills, eventHandler, botConfig)
staticRoute(app)
app.set('views', resolve(__dirname, '../views'))
app.set('view engine', 'pug')
botApi(app)
admin(app)

export default app
