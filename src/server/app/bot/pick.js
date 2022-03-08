import { Record } from '../models/record'
import trigger from '../handlers/trigger'
import uid from '../common/uid'

export async function sendMsg (bot, group, userId, text) {
  console.log('msg', text)
  await bot.sendMessage(group.id, {
    text: `![:Person](${userId}) ${text}`
  })
}

export async function pick (bot, group, userId, config) {
  const {
    cmd,
    count,
    id,
    title
  } = config
  const batchId = id || uid()
  const refId = `${userId}-${batchId}`
  const rec = await Record.findByPk(refId)
  if (!rec) {
    await Record.create({
      id: refId,
      batchId,
      data: [],
      botId: bot.id,
      groupId: group.id,
      userId,
      onPicking: 1
    })
  } else {
    await Record.update({
      onPicking: 1
    }, {
      where: {
        id: refId
      }
    })
  }
  const text = `Picking ${count} ${title}, please wait...`
  console.log('fff', text)
  await sendMsg(
    bot,
    group,
    userId,
    text
  )
  await trigger({
    cmd,
    count,
    refId,
    title,
    app: 'bot'
  })
}
