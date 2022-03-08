/**
 * bot control apis
 * /api
 */

import { Record } from '../models/record'
import copy from 'json-deep-copy'
import {
  pack,
  FEEDBACK_URL
} from '../common/constants'

const {
  RINGCENTRAL_CHATBOT_SERVER
} = process.env

async function view (req, res) {
  const {
    id
  } = req.params
  const data = {
    version: pack.version,
    title: 'Lottery result',
    server: RINGCENTRAL_CHATBOT_SERVER,
    cdn: RINGCENTRAL_CHATBOT_SERVER,
    feedbackUrl: FEEDBACK_URL,
    id
  }
  data._global = copy(data)
  res.render('app', data)
}

async function data (req, res) {
  const {
    id
  } = req.params
  const rec = await Record.findByPk(id)
  res.send({
    title: rec.title,
    data: rec.data,
    batchId: rec.batchId
  })
}

export default (app) => {
  app.get('/v/:id', view)
  app.get('/a/:id', data)
}
