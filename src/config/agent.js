import commonStore from '../stores/commonStore'

const headers = new Headers({
  'Content-Type': 'application/json',
  // 'Content-Length': content.length.toString(),
  'X-Custom-Header': 'ProcessThisImmediately'
})

// const API_ROOT = 'https://conduit.productionready.io/api', 在 package.json 中使用 `proxy` 设置即可
const initHeaders = params => {
  headers.append('Content-Length', JSON.stringify(params).length.toString())
  if (commonStore.token) {
    headers.set('authorization', `Token ${commonStore.token}`)
  }
}
const responseBody = data => data

const requests = {
  get: url => fetchRequest(`${url}`).then(responseBody),
  post: (url, body) => fetchRequest(`${url}`, 'POST', body).then(responseBody)
}

function fetchRequest (url, method = 'GET', params = {}, timeout = 15000) {
  initHeaders(params)
  let myInit = {
    method: method,
    headers: headers,
    mode: 'cors',
    cache: 'default'
  }
  if (
    method.toLocaleLowerCase() === 'post' ||
    method.toLocaleLowerCase() === 'put' ||
    params.length > 0
  ) {
    myInit.set('body', JSON.stringify(params))
  }

  let isTimeout = false
  return new Promise(function (resolve, reject) {
    const timer = setTimeout(function () {
      isTimeout = true
      reject(new Error('Fetch timeout'))
    }, timeout)
		let request = new Request(url, myInit)
    console.log(request)
    fetch(request)
      .then(res => {
        return res.json()
      })
      .then(data => {
        clearTimeout(timer)
        if (!isTimeout) {
          resolve(data)
        }
      })
      .catch(e => {
        if (isTimeout) {
          return
        }
        console.log(e)
        // 需要统一的处理错误方式，避免每次都catch
        reject(e)
      })
  })
}

const Tags = {
  getAll: () => requests.get('/tags')
}

export default {
  Tags
}
