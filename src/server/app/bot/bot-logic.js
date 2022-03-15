/**
 * handle message for bot
 */

import {
  botJoinTempRender,
  feedbackTempRender,
  actionsTempRender,
  textTempRender
} from '../templates'
import {
  FEEDBACK_URL,
  icons
} from '../common/constants'
import parser from '../handlers/string-parser'
import { pick, sendMsg } from './pick'

const addCommands = [
  'add',
  'new',
  'create',
  'pick'
]

function buildWelcomeMessage (bot, group) {
  const feedback = feedbackTempRender({
    title: 'Feedback',
    actions: false,
    url: FEEDBACK_URL,
    icon: icons.feedback
  })
  // const groupId = group.id
  const title = textTempRender({
    text: '**Hi team!**'
  })
  const desc = parser(
  `I am **Lottery bot**, I will post this message again if you **AT** me.

You can randomly pick some team members from this team as lottery winners by command: eg: \`@LotteryBot pick 2\`, more bot commands and features please check [lottery bot command](https://github.com/ringcentral/lottery-bot/blob/master/doc/command.md)`
  )
  // const url = RINGCENTRAL_CHATBOT_SERVER +
  //   `/polls?groupId=${groupId}&botId=${bot.id}`
  // const acts = [{
  //   type: 'Action.OpenUrl',
  //   title: 'Create/Manage Polls',
  //   url
  // }]
  const actions = actionsTempRender({
    actions: '',
    hasActions: false
  })
  const r = botJoinTempRender({
    fallbackText: 'Hi Team, I am Lottery bot!',
    title,
    desc,
    feedback,
    actions
  })
  // console.log(r)
  return JSON.parse(r)
}

function parseCommand (text) {
  let arr = text.trim().split(/ +/)
  const cmd = arr[0]
  const idReg = /id="([A-Za-z0-9_-]{7,20})"/
  const matchArr = text.match(idReg)
  let id = ''
  if (matchArr) {
    const idStr = matchArr[0]
    id = matchArr[1]
    arr = arr.filter(d => d !== idStr)
  }
  const n = arr[1]
  const count = n ? parseInt(n, 10) : 1
  const start = 2
  const title = arr.slice(start).join(' ') || 'team lottery winners'
  if (!addCommands.includes(cmd)) {
    return false
  }
  return {
    cmd,
    count,
    id,
    title
  }
}

export async function handleMessage (
  bot,
  group,
  text,
  userId,
  message
) {
  const conf = parseCommand(text)
  if (conf && conf.error) {
    await sendMsg(bot, group, userId, conf.error)
  } else if (conf && conf.title) {
    await pick(bot, group, userId, conf)
  } else {
    const msg = buildWelcomeMessage(bot, group)
    await bot.sendAdaptiveCard(group.id, msg)
  }
}

export async function botJoin (bot, group) {
  const msg1 = buildWelcomeMessage(bot, group)
  await bot.sendAdaptiveCard(group.id, msg1)
}
