
/**
 * lambda file
 */
import serverlessHTTP from 'serverless-http'
import app1 from './app/app'
// import axios from 'axios'
import triggerFunc from './app/handlers/trigger'

export const app = serverlessHTTP(app1)

export const trigger = async (event) => {
  return triggerFunc(event)
}
