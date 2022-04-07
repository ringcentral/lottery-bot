
import { Record } from '../models/record'
import Bot from 'ringcentral-chatbot-core/dist/models/Bot'
import multipartMixedParser from 'multipart-mixed-parser'
import _ from 'lodash'

async function batchGet (bot, url, ids, batchSize, config = {}) {
  const cache = {}
  const result = []
  for (let i = 0; i < ids.length; i += batchSize) {
    let someIds = ids.slice(i, i + batchSize)
    if (someIds.length <= 1) {
      someIds = [...someIds, ids[0]] // turn single record fetch to batch fetch
    }
    const r = await bot.rc.get(`${url}/${someIds.join(',')}`, config)
    for (const item of multipartMixedParser.parse(r.data).slice(1).filter(p => 'id' in p)) {
      if (!cache[item.id]) {
        cache[item.id] = true
        result.push(item)
      }
    }
  }
  return result
}

async function getMembers (bot, groupId, botId) {
  const r = await bot.rc.get(`/restapi/v1.0/glip/groups/${groupId}`)
    .then(d => d.data)
  const url = '/restapi/v1.0/glip/persons'
  const batchSize = 30
  return batchGet(
    bot,
    url,
    r.members,
    batchSize
  ).then(r => {
    return r
      .filter(d => {
        return d.id !== botId && !(d.email || '').includes('bot.glip.net')
      })
      .map(d => {
        return _.pick(d, [
          'id', 'firstName', 'lastName', 'email'
        ])
      })
  })
}

function pickWinner (membersList, data, count, title) {
  const tree = data.reduce((p, k) => {
    return {
      ...p,
      [k.id]: 1
    }
  }, {})
  const rest = membersList.filter(f => {
    return !tree[f.id]
  })
  const winners = []
  const createTime = Date.now()
  let allPicked = !rest.length
  for (let i = 0; i < count; i++) {
    const len = rest.length
    const r = Math.floor(Math.random() * len)
    const ext = rest[r]
    if (ext) {
      const obj = {
        ...ext,
        title,
        createTime
      }
      winners.push(obj)
      rest.splice(r, 1)
    } else {
      allPicked = true
      i = count
    }
  }
  allPicked = winners.length === rest.length
  return {
    winners, allPicked
  }
}

async function updateWinners (id, winners) {
  const rec = await Record.findByPk(id)
  await Record.update({
    data: [
      ...rec.data,
      ...winners
    ]
  }, {
    where: {
      id
    }
  })
}

async function notifyWinners (bot, winners, title, id, batchId, groupId, allPicked) {
  const names = winners.map(w => {
    return `![:Person](${w.id})`
  }).join(' ') || 'No one picked this time.'
  const url = process.env.RINGCENTRAL_CHATBOT_SERVER + `/v/${id}`
  const pre = winners.length
    ? ':tada: :tada: Congratulations :tada: :tada: '
    : ''
  const after = allPicked
    ? '\n(Every team member picked already)'
    : ''
  const msg = `${pre}${title}:
${names}${after}
---------
batch ID: ${batchId} | [Detail](${url})
  `
  await bot.sendMessage(groupId, {
    text: msg
  })
}

export async function action (event) {
  const {
    count,
    refId,
    title
  } = event
  const rec = await Record.findByPk(refId)
  if (!rec) {
    return console.log('refId', refId, 'not found')
  }
  const {
    id,
    botId,
    groupId,
    batchId,
    data,
    members
  } = rec
  const bot = await Bot.findByPk(botId)
  const membersList = members && members.length
    ? members
    : await getMembers(bot, groupId, botId)
  const {
    winners, allPicked
  } = await pickWinner(membersList, data, count, title)
  if (winners && winners.length) {
    await updateWinners(id, winners)
  }
  await notifyWinners(bot, winners, title, id, batchId, groupId, allPicked)
}
