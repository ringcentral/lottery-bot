
import { botJoinTemp } from './bot/bot-join'
import { actionsTemp } from './parts/actions'
import { feedbackTemp } from './parts/feedback'
import { textTemp } from './parts/text'

import temp from 'handlebars'

const opts = { noEscape: true }

export const botJoinTempRender = temp.compile(botJoinTemp, opts)
export const feedbackTempRender = temp.compile(feedbackTemp, opts)
export const actionsTempRender = temp.compile(actionsTemp, opts)
export const textTempRender = temp.compile(textTemp, opts)
