/**
 * handle triggers
 */

// import { triggerSync } from './sync'
import { action } from '../bot/trigger-action'

export default function (event) {
  const {
    app
  } = event
  if (app === 'bot') {
    return action(event)
  }
}
