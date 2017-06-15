const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const parser = bodyParser.json()

function reject (res) {
  res.set('WWW-Authenticate', 'Basic realm="Ambassador Realm"')
  res.status(401).end()
}

app.post('/post', parser, function (req, res) {
  // Headers we look at to figure out auth
  const headers = req.body
  console.log('\nNew request with ' + Object.keys(headers).length + ' headers.')

  console.log('My Headers >>>')
  console.log(req.headers)
  console.log('Headers for auth >>>')
  console.log(headers)
  console.log('----')

  // Does this call need auth?
  const path = headers[':path']
  console.log('Got :path [' + path + ']')
  if (!path || !path.startsWith('/service')) {
    console.log('OK, not /service')
    res.send('OK')
    return
  }

  // FUTURE: Check for and validate JWT in some header

  // Does this call have a basic auth header?
  const auth = headers['authorization']
  console.log('Got auth [' + auth + ']')
  if (!auth || !auth.startsWith('Basic ')) {
    console.log('reject, not Basic Auth')
    return reject(res)
  }

  // Does the header contain a username and password?
  const userpass = Buffer.from(auth.slice(6), 'base64').toString()
  const splitIdx = userpass.search(':')
  console.log('Auth decodes to [' + userpass + ']')
  if (splitIdx < 1) {
    // No colon or empty username
    console.log('reject, bad format')
    return reject(res)
  }

  // Is the username and password pair valid?
  // TODO(ark3): Validate properly!
  const username = userpass.slice(0, splitIdx)
  const password = userpass.slice(splitIdx + 1)
  if (username !== 'username' || password !== 'password') {
    console.log('reject, invalid user')
    return reject(res)
  }

  console.log('OK, good user')
  res.send('OK')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
