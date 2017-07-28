/*
 * Copyright 2017 Datawire. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * Example auth service for Ambassador[1] using ExtAuth[2].
 * See the Ambassador documentation[3] for more information.
 * [1]: https://github.com/datawire/ambassador
 * [2]: https://github.com/datawire/ambassador-envoy
 * [3]: http://www.getambassador.io/
*/

const express = require('express')
const app = express()

// Set up authentication middleware
const basicAuth = require('express-basic-auth')
const authenticate = basicAuth({
  'users': { 'username': 'password' },
  'challenge': true,
  'realm': 'Ambassador Realm'
})

// Add verbose logging of requests (see below)
app.use(logRequests)

// Require authentication for /service requests
app.all('/service', authenticate, function (req, res) {
  res.send('OK (authenticated)')
})

// Everything else is okay without auth
app.all('*', function (req, res) {
  res.send('OK (not /service)')
})

app.listen(3000, function () {
  console.log('Subrequest auth server sample listening on port 3000')
})

// Middleware to log requests, including basic auth header info
function logRequests (req, res, next) {
  console.log('\nNew request')
  console.log(`  Path: ${req.path}`)
  console.log('  Incoming headers >>>')
  Object.entries(req.headers).forEach(
    ([key, value]) => console.log(`    ${key}: ${value}`)
  )

  // Check for expected authorization header
  const auth = req.headers['authorization']
  if (!auth) {
    console.log('  No authorization header')
    return next()
  }
  if (!auth.toLowerCase().startsWith('basic ')) {
    console.log('  Not Basic Auth')
    return next()
  }

  // Parse authorization header
  const userpass = Buffer.from(auth.slice(6), 'base64').toString()
  console.log(`  Auth decodes to "${userpass}"`)
  const splitIdx = userpass.search(':')
  if (splitIdx < 1) {  // No colon or empty username
    console.log('  Bad authorization format')
    return next()
  }

  // Extract username and password pair
  const username = userpass.slice(0, splitIdx)
  const password = userpass.slice(splitIdx + 1)
  console.log(`  Auth user="${username}" pass="${password}"`)
  return next()
}
