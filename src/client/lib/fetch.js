// the final fetch wrapper
import axios from 'axios'
import { notification } from 'antd'

function getToken () {
  return window.localStorage.getItem(
    window.rc.jwtPrefix + ':rcpf-jwt-token'
  ) || ''
}

function getHeader (headers = {}) {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + getToken(),
    ...headers
  }
}

function parseResponse (data) {
  return data
}

export async function handleErr (error) {
  let msg = 'Error'
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    msg = error.response.data
    console.log(error.response.data)
    console.log(error.response.status)
    console.log(error.response.headers)
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    msg = error.message
    console.log(error.request)
  } else {
    // Something happened in setting up the request that triggered an Error
    msg = error.message
    console.log('Error', error.message)
  }
  console.log(error.config)
  notification.error({
    message: msg,
    duration: 10
  })
}

export default class Fetch {
  static get (url, options) {
    return Fetch.connect(url, 'get', null, options)
  }

  static post (url, data, options) {
    return Fetch.connect(url, 'post', data, options)
  }

  static delete (url, options) {
    return Fetch.connect(url, 'delete', null, options)
  }

  static put (url, data, options) {
    return Fetch.connect(url, 'put', data, options)
  }

  static patch (url, data, options) {
    return Fetch.connect(url, 'patch', data, options)
  }

  // todo jsonp if needed
  static connect (url, method, data, options = {}) {
    const body = {
      url,
      method,
      data,
      headers: getHeader(options.headers),
      ...options
    }
    return axios(body)
      .then(r => r.data)
      .then(options.handleResponse || parseResponse)
      .catch(options.handleErr || handleErr)
  }
}
