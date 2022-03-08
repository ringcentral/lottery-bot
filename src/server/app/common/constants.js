import { resolve } from 'path'

const cwd = process.cwd()

export const pack = require(resolve(cwd, 'package.json'))

export const FEEDBACK_URL = 'https://github.com/ringcentral/lottery-bot/issues/new'

const baseURL = (name) => {
  return `https://raw.githubusercontent.com/ringcentral/github-notification-app/main/icons_v2/${name}.png`
}
export const icons = {
  feedback: baseURL('feedback')
}
