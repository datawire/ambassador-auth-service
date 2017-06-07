const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const parser = bodyParser.json()

app.post('/post', parser, function (req, res) {
  // Headers we look at to figure out auth
  const headers = req.body

  // Does this call need auth?
  const path = headers[':path']
  console.log('Got :path [' + path + ']')
  if (!path || !path.startsWith('/service')) {
    res.send('OK')
    return
  }

  const auth = headers['authorization']
  console.log('Got auth [' + auth + ']')
  if (!auth || !auth.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="Ambassador Realm"')
    res.status(401).end()
    return
  }

  // FUTURE: Check for JWT in some header
  // FUTURE:   Pass, then return 200

  res.send('OK')

  /*
  console.log('My Headers >>>')
  console.log(req.headers)
  console.log('Headers for auth >>>')
  console.log(headers)
  console.log('----')
  */
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
