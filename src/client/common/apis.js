import fetch from '../lib/fetch'

const {
  server
} = window.rc

export async function getData (id = window.rc.id) {
  const url = `${server}/a/${id}`
  return fetch.get(url)
}
